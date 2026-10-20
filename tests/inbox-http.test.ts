import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  inboxFixture,
  receive,
  input,
} from "./fixtures/inbox-service/helpers.ts";
import { createInboxHandler } from "../server/inbox/http.ts";
import { csrf, SESSION_COOKIE } from "../server/admin/sessions.ts";
export async function httpFixture() {
  const f = await inboxFixture();
  let origin = "";
  const server = createServer((req, res) => {
    void createInboxHandler({ service: f.service, csrfKey: f.csrfKey, origin })(
      req,
      res,
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  origin = "http://127.0.0.1:" + (server.address() as any).port;
  const headers = {
    "X-Priva-Request": "1",
    Cookie: SESSION_COOKIE + "=" + f.token,
    Origin: origin,
    "X-CSRF-Token": csrf(f.csrfKey, "session", f.token),
    "Content-Type": "application/json",
  };
  return {
    ...f,
    origin,
    headers,
    server,
    close: async () => {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      f.cleanup();
    },
  };
}
test("HTTP list, enqueue, polling and public denial use actual authorization and same data", async () => {
  const f = await httpFixture();
  try {
    const { id } = receive(f);
    let res = await fetch(f.origin + "/api/admin/contacto/listado", {
      method: "POST",
      headers: f.headers,
      body: JSON.stringify({ status: "Pendiente", cursor: null, limit: 25 }),
    });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).summary.total, 1);
    assert.equal(res.headers.get("cache-control"), "no-store");
    const i = input(f, id);
    res = await fetch(
      f.origin + "/api/admin/contacto/consultas/" + id + "/respuestas",
      { method: "POST", headers: f.headers, body: JSON.stringify(i) },
    );
    assert.equal(res.status, 202);
    await f.worker.tick();
    res = await fetch(
      f.origin + "/api/admin/contacto/operaciones/" + i.operationId,
      { headers: f.headers },
    );
    assert.equal((await res.json()).state, "accepted");
    res = await fetch(f.origin + "/api/admin/contacto/consultas/" + id, {
      headers: { "X-Priva-Request": "1" },
    });
    assert.equal(res.status, 401);
    assert.ok(!(await res.text()).includes("visitor@example.com"));
  } finally {
    await f.close();
  }
});
test("HTTP rejects forged origin, CSRF, query, invalid UTF8 and oversized body without sending", async () => {
  const f = await httpFixture();
  try {
    const { id } = receive(f),
      url = f.origin + "/api/admin/contacto/consultas/" + id + "/respuestas";
    for (const [headers, body, expected] of [
      [
        { ...f.headers, Origin: "https://evil.invalid" },
        JSON.stringify(input(f, id)),
        403,
      ],
      [{ ...f.headers, "X-CSRF-Token": "bad" }, "{}", 403],
      [f.headers, Buffer.from([0xff]), 400],
      [f.headers, "x".repeat(32769), 413],
      [
        f.headers,
        JSON.stringify({ ...input(f, id), to: "attacker@example.com" }),
        422,
      ],
    ] as const) {
      const r = await fetch(url, { method: "POST", headers, body });
      assert.equal(r.status, expected);
    }
    assert.equal(
      (
        await fetch(f.origin + "/api/admin/contacto/resumen?x=1", {
          headers: f.headers,
        })
      ).status,
      404,
    );
    assert.equal(f.mail.calls, 0);
    assert.equal(
      f.repo.db.prepare("SELECT count(*) n FROM reply_operations").get()!.n,
      0,
    );
  } finally {
    await f.close();
  }
});
test("operation polling never touches session inactivity and rate limit never creates intent", async () => {
  const f = await httpFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    const before = f.repository.session(f.token)!.session.lastActivityAt;
    f.setTime(f.time() + 1000);
    for (let n = 0; n < 60; n++)
      assert.equal(
        (
          await fetch(
            f.origin + "/api/admin/contacto/operaciones/" + i.operationId,
            { headers: f.headers },
          )
        ).status,
        200,
      );
    assert.equal(f.repository.session(f.token)!.session.lastActivityAt, before);
    const rate = await fetch(
      f.origin + "/api/admin/contacto/operaciones/" + i.operationId,
      { headers: f.headers },
    );
    assert.equal(rate.status, 429);
    assert.equal(rate.headers.get("retry-after"), "60");
    assert.equal(
      f.repo.db.prepare("SELECT count(*) n FROM reply_operations").get()!.n,
      1,
    );
  } finally {
    await f.close();
  }
});
import { request as rawRequest } from "node:http";
test(
  "partial chunked JSON reaches enforced30s deadline without queued response",
  { timeout: 40000 },
  async () => {
    const f = await httpFixture();
    try {
      const { id } = receive(f),
        started = Date.now();
      await new Promise<void>((resolve, reject) => {
        const req = rawRequest(
          f.origin + "/api/admin/contacto/consultas/" + id + "/respuestas",
          {
            method: "POST",
            headers: { ...f.headers, "Transfer-Encoding": "chunked" },
          },
          (res) => {
            res.resume();
            res.on("end", () =>
              reject(Error("Unfinished body unexpectedly accepted")),
            );
          },
        );
        req.on("error", () => resolve());
        req.write("{");
      });
      const elapsed = Date.now() - started;
      assert.ok(elapsed >= 29500 && elapsed < 35000);
      assert.equal(
        f.repo.db.prepare("SELECT count(*) n FROM reply_operations").get()!.n,
        0,
      );
    } finally {
      await f.close();
    }
  },
);
