import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { fixture, seed } from "./fixtures/admin-service/helpers.ts";
import { AdminService } from "../server/admin/service.ts";
import { createAdminHandler } from "../server/admin/http.ts";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { bank, headers } from "./fixtures/admin-service/http-bank.ts";
test("HTTP requires origin/non-simple headers, rejects invalid JSON/UTF8/size, no-store CSP on failures", async () => {
  const f = await bank();
  try {
    for (const h of [
      {},
      { ...headers, origin: "https://evil.test" },
      { ...headers, "sec-fetch-site": "cross-site" },
    ]) {
      const r = await fetch(f.base + "/api/admin/contexto", { headers: h });
      assert.equal(r.status, 403);
      assert.equal(r.headers.get("cache-control"), "no-store");
      assert.match(
        r.headers.get("content-security-policy")!,
        /frame-ancestors 'none'/,
      );
    }
    for (const [body, status] of [
      ["{", 400],
      ["x".repeat(8193), 413],
    ] as const) {
      const r = await fetch(f.base + "/api/admin/acceso", {
        method: "POST",
        headers,
        body,
      });
      assert.equal(r.status, status);
    }
    const bad = await fetch(f.base + "/api/admin/acceso", {
      method: "POST",
      headers,
      body: Buffer.from([0xff]),
    });
    assert.equal(bad.status, 400);
    const get = await fetch(f.base + "/api/admin/acceso", { headers });
    assert.equal(get.status, 405);
  } finally {
    await f.close();
  }
});
test("real cookie/context login/guard/session/logout; no public HTML aliases or debug routes", async () => {
  const f = await bank();
  try {
    await seed(f);
    for (const path of [
      "/admin",
      "/admin/historias",
      "/admin/contacto",
      "/admin/panel.html",
      "/.private-build/admin/panel.html",
      "/api/admin/debug",
      "/admin/%2e%2e/panel.html",
    ])
      assert.ok((await fetch(f.base + path, { headers })).status >= 400);
    const c = await fetch(f.base + "/api/admin/contexto", { headers });
    assert.equal(c.status, 200);
    const pre = c.headers.getSetCookie()[0];
    assert.match(pre, /Secure; HttpOnly; SameSite=Strict; Path=\//);
    let ck = pre.split(";")[0];
    const ctx = await c.json();
    const request = {
      method: "POST",
      headers: { ...headers, cookie: ck, "x-csrf-token": ctx.csrfToken },
      body: JSON.stringify({
        email: "one@example.com",
        password: "synthetic private phrase 2026",
      }),
    };
    const login = await fetch(f.base + "/api/admin/acceso", request);
    assert.equal(login.status, 200);
    const lc = login.headers
      .getSetCookie()
      .find((v) => v.startsWith("__Host-priva_session="))!;
    assert.ok(lc);
    ck = lc.split(";")[0];
    const state = await fetch(f.base + "/api/admin/sesion", {
      headers: { ...headers, cookie: ck },
    });
    const info = await state.json();
    assert.equal(info.account.email, "one@example.com");
    assert.equal("passwordRecord" in info.account, false);
    assert.equal(
      (await fetch(f.base + "/admin", { headers: { cookie: ck } })).status,
      200,
    );
    const denied = await fetch(f.base + "/api/admin/salir", {
      method: "POST",
      headers: { ...headers, cookie: ck },
      body: "{}",
    });
    assert.equal(denied.status, 403);
    const out = await fetch(f.base + "/api/admin/salir", {
      method: "POST",
      headers: { ...headers, cookie: ck, "x-csrf-token": info.csrfToken },
      body: "{}",
    });
    assert.equal(out.status, 200);
    assert.equal(
      (await fetch(f.base + "/admin", { headers: { cookie: ck } })).status,
      401,
    );
    assert.equal(
      (
        await fetch(f.base + "/api/admin/salir", {
          method: "POST",
          headers: { ...headers, cookie: ck },
          body: "{}",
        })
      ).status,
      200,
    );
  } finally {
    await f.close();
  }
});
import { RecoveryService, decryptEnvelope } from "../server/admin/recovery.ts";
import { MailWorker } from "../server/admin/mail-worker.ts";
import {
  PREAUTH,
  digest,
  cookie,
  SESSION_COOKIE,
} from "../server/admin/sessions.ts";
test("preauth context reused until strict expiry, consumed at login, GET state never renews", async () => {
  const f = await bank();
  try {
    const a = await fetch(f.base + "/api/admin/contexto", { headers });
    const c = a.headers.getSetCookie()[0].split(";")[0];
    const state = await a.json();
    const again = await fetch(f.base + "/api/admin/contexto", {
      headers: { ...headers, cookie: c },
    });
    assert.equal((await again.json()).csrfToken, state.csrfToken);
    assert.equal(again.headers.getSetCookie().length, 0);
    f.setTime(f.time() + PREAUTH);
    const stale = await fetch(f.base + "/api/admin/acceso", {
      method: "POST",
      headers: { ...headers, cookie: c, "x-csrf-token": state.csrfToken },
      body: JSON.stringify({ email: "one@example.com", password: "anything" }),
    });
    assert.equal(stale.status, 403);
    assert.equal(
      (
        await fetch(f.base + "/api/admin/contexto", {
          headers: { ...headers, cookie: c },
        })
      ).status,
      200,
    );
  } finally {
    await f.close();
  }
});
test("recovery/reset work with CSRF from another account; token alone determines recovered account", async () => {
  const f = await bank();
  try {
    await seed(f);
    await seed(f, "two@example.com");
    const auth = new AdminService(f.repository, f.hasher, f.abuseKey);
    const logged = await auth.login(
      "two@example.com",
      "synthetic private phrase 2026",
      "two",
    );
    const ck = SESSION_COOKIE + "=" + logged.token;
    const ctx = await fetch(f.base + "/api/admin/contexto", {
      headers: { ...headers, cookie: ck },
    });
    const csrf = (await ctx.json()).csrfToken;
    const post = (path: string, v: unknown) =>
      fetch(f.base + "/api/admin/" + path, {
        method: "POST",
        headers: { ...headers, cookie: ck, "x-csrf-token": csrf },
        body: JSON.stringify(v),
      });
    assert.equal(
      (await post("recuperacion", { email: "one@example.com" })).status,
      202,
    );
    const job = f.repository.db
      .prepare("SELECT * FROM admin_jobs WHERE kind='real'")
      .get()!;
    const payload = decryptEnvelope(
      new Map([["v1", f.mailKey]]),
      `${job.id}:${job.accountId}:${job.credentialVersion}`,
      job.envelope as string,
    );
    const token = new URLSearchParams(
      new URL(payload.resetURL).hash.slice(1),
    ).get("token")!;
    assert.equal((await fetch(f.base + "/admin/restablecer")).status, 200);
    assert.ok(f.repository.proof(token));
    const response = await post("restablecer", {
      token,
      password: "new synthetic phrase 2026",
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.getSetCookie().length, 0);
    assert.ok(f.repository.session(logged.token));
    assert.equal(
      f.repository.findAccount("one@example.com")!.credentialVersion,
      2,
    );
    assert.equal(
      f.repository.findAccount("two@example.com")!.credentialVersion,
      1,
    );
  } finally {
    await f.close();
  }
});
test("logout storage failure gives unknown, keeps cookie and rejects subsequent protected reads", async () => {
  const f = await bank();
  try {
    f.repository.close();
    const out = await fetch(f.base + "/api/admin/salir", {
      method: "POST",
      headers,
      body: "{}",
    });
    assert.equal(out.status, 503);
    assert.equal(out.headers.getSetCookie().length, 0);
    assert.equal((await fetch(f.base + "/admin")).status, 503);
  } finally {
    await f.close();
  }
});
test("recovery non-enumeration timing: twenty interleaved samples per class, pairwise median/p95 thresholds", async () => {
  const f = await bank();
  try {
    await seed(f);
    const disabled = f.repository.createAccount("disabled@example.com");
    f.repository.setAuthorization(disabled.id, false);
    await seed(f, "worker@example.com");
    const initial = await fetch(f.base + "/api/admin/contexto", { headers });
    const ck = initial.headers.getSetCookie()[0].split(";")[0],
      csrf = (await initial.json()).csrfToken;
    const classes = [
      "one@example.com",
      "missing@example.com",
      "disabled@example.com",
      "worker@example.com",
    ];
    const times = classes.map(() => [] as number[]);
    let canonical = "";
    let canonicalHeaders = "";
    const worker = new MailWorker(f.repository, new Map([["v1", f.mailKey]]), {
      idempotent: false,
      send: async (input) => {
        if (input.to === "worker@example.com")
          throw Error("Synthetic provider failure");
        return "accepted";
      },
    });
    for (let i = 0; i < 20; i++)
      for (let k = 0; k < classes.length; k++) {
        f.repository.db.prepare("DELETE FROM admin_abuse").run();
        const start = performance.now();
        const response = await fetch(f.base + "/api/admin/recuperacion", {
          method: "POST",
          headers: { ...headers, cookie: ck, "x-csrf-token": csrf },
          body: JSON.stringify({ email: classes[k] }),
        });
        const text = await response.text();
        times[k].push(performance.now() - start);
        assert.equal(response.status, 202);
        const hs = JSON.stringify(
          Object.fromEntries(
            [...response.headers].filter(
              ([key]) => !["date", "connection", "keep-alive"].includes(key),
            ),
          ),
        );
        if (!canonical) {
          canonical = text;
          canonicalHeaders = hs;
        }
        assert.equal(text, canonical);
        assert.equal(hs, canonicalHeaders);
        await worker.tick();
      }
    const quantile = (v: number[], p: number) =>
      [...v].sort((a, b) => a - b)[Math.ceil(v.length * p) - 1];
    const stats = times.map((v) => ({
      median: quantile(v, 0.5),
      p95: quantile(v, 0.95),
      min: Math.min(...v),
    }));
    for (const a of stats) {
      assert.ok(a.min >= 250);
      for (const b of stats) {
        assert.ok(Math.abs(a.median - b.median) <= 50);
        assert.ok(Math.abs(a.p95 - b.p95) <= 100);
      }
    }
    console.log(
      "006 timing local ms (classes eligible/unknown/disabled/worker-failure): " +
        JSON.stringify(
          stats.map((s) =>
            Object.fromEntries(
              Object.entries(s).map(([k, v]) => [k, Math.round(v)]),
            ),
          ),
        ),
    );
  } finally {
    await f.close();
  }
});
test("new anonymous contexts limited before insertion, same-origin reusable context remains usable", async () => {
  const f = await bank();
  try {
    let saved = "";
    for (let i = 0; i < 60; i++) {
      const r = await fetch(f.base + "/api/admin/contexto", { headers });
      assert.equal(r.status, 200);
      if (i === 0) saved = r.headers.getSetCookie()[0].split(";")[0];
    }
    assert.equal(
      (await fetch(f.base + "/api/admin/contexto", { headers })).status,
      429,
    );
    assert.equal(
      f.repository.db.prepare("SELECT count(*) AS n FROM admin_preauth").get()
        ?.n,
      60,
    );
    assert.equal(
      (
        await fetch(f.base + "/api/admin/contexto", {
          headers: { ...headers, cookie: saved },
        })
      ).status,
      200,
    );
  } finally {
    await f.close();
  }
});
