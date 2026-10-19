import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import {
  storyFixture,
  create,
  complete,
  save,
  publish,
  activate,
} from "./fixtures/story-management-service/helpers.ts";
import { createStoriesHandler } from "../server/stories/http.ts";
import { SESSION_COOKIE, csrf } from "../server/admin/sessions.ts";
import { emptyDraft } from "../src/lib/story-management-contract.ts";
async function bank() {
  const f = await storyFixture(),
    origin = "https://admin.example.test";
  const handler = createStoriesHandler({
    service: f.service,
    media: f.media,
    origin,
    csrfKey: f.csrfKey,
  });
  const server = createServer(async (q, r) => {
    if (!(await handler(q, r))) {
      r.writeHead(404);
      r.end();
    }
  });
  await new Promise<void>((yes) => server.listen(0, "127.0.0.1", yes));
  const base =
    "http://127.0.0.1:" + (server.address() as { port: number }).port;
  const headers = {
    "X-Priva-Request": "1",
    Origin: origin,
    Cookie: `${SESSION_COOKIE}=${f.token}`,
    "X-CSRF-Token": csrf(f.csrfKey, "session", f.token),
    "Content-Type": "application/json",
  };
  return {
    ...f,
    base,
    headers,
    async close() {
      server.closeAllConnections();
      await new Promise<void>((yes) => server.close(() => yes()));
      f.cleanup();
    },
  };
}
test("HTTP authorization before payload, CSRF, methods, UTF8 and size guard", async () => {
  const f = await bank();
  try {
    for (const [headers, status] of [
      [{}, 403],
      [{ "X-Priva-Request": "1" }, 401],
      [{ ...f.headers, Origin: "https://evil.test" }, 403],
      [{ ...f.headers, "X-CSRF-Token": "invalid" }, 403],
    ] as const) {
      const r = await fetch(f.base + "/api/admin/historias", {
        method: "POST",
        headers,
        body: "bad",
      });
      assert.equal(r.status, status);
      assert.equal(r.headers.get("cache-control"), "no-store");
    }
    for (const [body, status] of [
      ["{", 400],
      ["a".repeat(262145), 413],
    ] as const) {
      const r = await fetch(f.base + "/api/admin/historias", {
        method: "POST",
        headers: f.headers,
        body,
      });
      assert.equal(r.status, status);
    }
    assert.equal(
      (
        await fetch(f.base + "/api/admin/historias", {
          method: "DELETE",
          headers: f.headers,
        })
      ).status,
      405,
    );
    assert.equal(
      (
        await fetch(f.base + "/api/admin/historias?private=1", {
          headers: f.headers,
        })
      ).status,
      404,
    );
  } finally {
    await f.close();
  }
});
test("HTTP persisted draft, receipt and public DTO; server excludes drafts regardless of client", async () => {
  const f = await bank();
  try {
    const operationId = randomUUID();
    const r = await fetch(f.base + "/api/admin/historias", {
      method: "POST",
      headers: f.headers,
      body: JSON.stringify({ operationId, working: emptyDraft() }),
    });
    assert.equal(r.status, 201);
    const saved = await r.json();
    const receipt = await fetch(
      f.base + "/api/admin/historias/operaciones/" + operationId,
      { headers: f.headers },
    );
    assert.deepEqual(await receipt.json(), saved);
    const publicRes = await fetch(f.base + "/api/public/historias");
    assert.equal(publicRes.headers.get("set-cookie"), null);
    assert.deepEqual(await publicRes.json(), { schemaVersion: 1, stories: [] });
    const get = await fetch(f.base + "/api/admin/historias/" + saved.storyId, {
      headers: f.headers,
    });
    assert.equal((await get.json()).working.title, "");
  } finally {
    await f.close();
  }
});
test("HTTP public/private media authorization, HEAD and Range semantics using explicit synthetic domain bytes", async () => {
  const f = await bank();
  try {
    const a = create(f),
      d = complete(f, a.storyId);
    save(f, a.storyId, d);
    const path = "/media/public/" + d.audioResourceId;
    assert.equal((await fetch(f.base + path)).status, 404);
    assert.equal(
      (
        await fetch(
          f.base + "/api/admin/historias/recursos/" + d.audioResourceId,
        )
      ).status,
      403,
    );
    publish(f, a.storyId);
    activate(f, a.storyId);
    const cat = await fetch(f.base + "/api/public/historias");
    const data = await cat.json();
    assert.equal(data.stories[0].id, a.storyId);
    const range = await fetch(f.base + path, {
      headers: { Range: "bytes=0-3" },
    });
    assert.equal(range.status, 206);
    assert.equal((await range.arrayBuffer()).byteLength, 4);
    assert.match(range.headers.get("content-range")!, /^bytes 0-3\//);
    const head = await fetch(f.base + path, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal((await head.arrayBuffer()).byteLength, 0);
    for (const range of ["bytes=999999-", "bytes=1-0", "bytes=0-1,3-4"])
      assert.equal(
        (await fetch(f.base + path, { headers: { Range: range } })).status,
        416,
      );
    activate(f, a.storyId, false);
    assert.equal((await fetch(f.base + path)).status, 404);
  } finally {
    await f.close();
  }
});
test("rate limit produces Retry-After without repeated database mutations", async () => {
  const f = await bank();
  try {
    const b = { operationId: randomUUID(), working: emptyDraft() };
    for (let i = 0; i < 61; i++) {
      const r = await fetch(f.base + "/api/admin/historias", {
        method: "POST",
        headers: f.headers,
        body: JSON.stringify(b),
      });
      assert.equal(r.status, i === 60 ? 429 : 201);
      if (i === 60) assert.equal(r.headers.get("retry-after"), "60");
    }
    assert.equal(f.service.list(f.token).stories.length, 1);
  } finally {
    await f.close();
  }
});

test("real binary upload enforces size/empty limits and unavailable inspector leaves no private metadata", async () => {
  const f = await bank();
  try {
    const a = create(f);
    for (const [buf, expected] of [
      [Buffer.alloc(0), 422],
      [Buffer.alloc(8 * 1048576 + 1), 413],
      [Buffer.from("not an image"), 503],
    ] as const) {
      const r = await fetch(
        f.base + `/api/admin/historias/${a.storyId}/recursos/${randomUUID()}`,
        {
          method: "PUT",
          headers: {
            ...f.headers,
            "Content-Type": "image/png",
            "X-Resource-Kind": "image",
          },
          body: buf,
        },
      );
      assert.equal(r.status, expected);
    }
    assert.equal(
      f.repository.db
        .prepare("SELECT count(*) AS n FROM stories_resources")
        .get()!.n,
      0,
    );
    assert.equal(f.service.catalog().stories.length, 0);
  } finally {
    await f.close();
  }
});

test("real accepted image/audio upload persists privately, publishes atomically and supports catalog/Range", async () => {
  const f = await bank();
  const { execFileSync } = await import("node:child_process");
  const { readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  try {
    const a = create(f),
      image = join(f.dir, "synthetic.png"),
      audio = join(f.dir, "synthetic.wav");
    execFileSync("/usr/bin/ffmpeg", [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "color=c=green:s=16x16",
      "-frames:v",
      "1",
      "-threads",
      "1",
      image,
    ]);
    execFileSync("/usr/bin/ffmpeg", [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:duration=1",
      "-threads",
      "1",
      audio,
    ]);
    const ids = [randomUUID(), randomUUID()];
    for (let i = 0; i < 2; i++) {
      const r = await fetch(
        f.base + `/api/admin/historias/${a.storyId}/recursos/${ids[i]}`,
        {
          method: "PUT",
          headers: {
            ...f.headers,
            "Content-Type": i ? "audio/wav" : "image/png",
            "X-Resource-Kind": i ? "audio" : "image",
          },
          body: readFileSync(i ? audio : image),
        },
      );
      assert.equal(r.status, 201);
      assert.equal((await r.json()).state, "ready");
      assert.equal(
        (await fetch(f.base + "/media/public/" + ids[i])).status,
        404,
      );
    }
    const working = {
      ...emptyDraft(),
      title: "Carga real sintética",
      category: "Prueba",
      description: "Relato sintético",
      imageResourceId: ids[0],
      audioResourceId: ids[1],
      imageAlt: "Cuadro verde sintético",
      transcript: "Señal de prueba",
      question: "¿Qué riesgo identificas?",
      options: [1, 2, 3].map((n) => ({
        id: "opcion-" + n,
        label: "Opción " + n,
        explanation: "Riesgo y prevención " + n,
      })),
    };
    save(f, a.storyId, working);
    publish(f, a.storyId);
    activate(f, a.storyId);
    const data = await (await fetch(f.base + "/api/public/historias")).json();
    assert.equal(data.stories[0].image.width, 16);
    const bytes = await fetch(f.base + data.stories[0].audio.src, {
      headers: { Range: "bytes=0-15" },
    });
    assert.equal(bytes.status, 206);
    assert.deepEqual(
      Buffer.from(await bytes.arrayBuffer()),
      readFileSync(audio).subarray(0, 16),
    );
  } finally {
    await f.close();
  }
});

test("revocation during an actual upload denies resource registration and removes staging bytes", async () => {
  const { request } = await import("node:http");
  const { execFileSync } = await import("node:child_process");
  const { readFileSync, readdirSync } = await import("node:fs");
  const { join } = await import("node:path");
  const f = await bank();
  try {
    const a = create(f),
      path = join(f.dir, "revoked.wav");
    execFileSync("/usr/bin/ffmpeg", [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:duration=1",
      "-threads",
      "1",
      path,
    ]);
    const bytes = readFileSync(path);
    let q: ReturnType<typeof request>;
    const response = new Promise<number>((resolve) => {
      q = request(
        f.base + `/api/admin/historias/${a.storyId}/recursos/${randomUUID()}`,
        {
          method: "PUT",
          headers: {
            ...f.headers,
            "Content-Type": "audio/wav",
            "X-Resource-Kind": "audio",
            "Content-Length": bytes.length,
          },
        },
        (res) => {
          res.resume();
          res.on("end", () => resolve(res.statusCode!));
        },
      );
      q.on("error", () => resolve(0));
    });
    q!.write(bytes.subarray(0, 128));
    for (let i = 0; i < 100 && !readdirSync(f.media.directory).length; i++)
      await new Promise((resolve) => setTimeout(resolve, 5));
    assert.equal(
      readdirSync(f.media.directory).length,
      1,
      "stream is staged before revocation",
    );
    f.repository.setAuthorization(f.one.account.id, false);
    q!.end(bytes.subarray(128));
    assert.equal(await response, 401);
    assert.equal(
      f.repository.db
        .prepare("SELECT count(*) AS n FROM stories_resources")
        .get()!.n,
      0,
    );
    assert.deepEqual(readdirSync(f.media.directory), []);
  } finally {
    await f.close();
  }
});

test("JSON30s/upload120s deadlines and two-upload semaphore enforce bounds without optimistic writes", async (t) => {
  const { request } = await import("node:http");
  const { readdirSync } = await import("node:fs");
  const f = await bank();
  const requests: ReturnType<typeof request>[] = [];
  const turn = () => new Promise<void>((resolve) => setImmediate(resolve));
  const waitFor = async (predicate: () => boolean) => {
    for (let i = 0; i < 2000 && !predicate(); i++) await turn();
    assert.equal(predicate(), true);
  };
  const start = (path: string, method: string, type: string) => {
    let req: ReturnType<typeof request>;
    const result = new Promise<number>((resolve) => {
      req = request(
        f.base + path,
        {
          method,
          headers: {
            ...f.headers,
            "Content-Type": type,
            "X-Resource-Kind": "audio",
          },
        },
        (res) => {
          res.resume();
          res.once("end", () => resolve(res.statusCode!));
        },
      );
      req.once("error", () => resolve(0));
    });
    requests.push(req!);
    req!.write("partial");
    return { req: req!, result };
  };
  try {
    const a = create(f);
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const json = start("/api/admin/historias", "POST", "application/json");
    await waitFor(
      () =>
        Number(
          f.repository.db
            .prepare("SELECT count(*) AS n FROM admin_abuse")
            .get()!.n,
        ) > 0,
    );
    t.mock.timers.tick(30000);
    assert.equal(await json.result, 0);
    assert.equal(f.service.list(f.token).stories.length, 1);
    const upload = start(
      `/api/admin/historias/${a.storyId}/recursos/${randomUUID()}`,
      "PUT",
      "audio/wav",
    );
    await waitFor(() => readdirSync(f.media.directory).length === 1);
    t.mock.timers.tick(120000);
    assert.equal(await upload.result, 0);
    await waitFor(() => readdirSync(f.media.directory).length === 0);
    t.mock.timers.reset();
    const first = start(
        `/api/admin/historias/${a.storyId}/recursos/${randomUUID()}`,
        "PUT",
        "audio/wav",
      ),
      second = start(
        `/api/admin/historias/${a.storyId}/recursos/${randomUUID()}`,
        "PUT",
        "audio/wav",
      );
    await waitFor(() => readdirSync(f.media.directory).length === 2);
    const third = await fetch(
      f.base + `/api/admin/historias/${a.storyId}/recursos/${randomUUID()}`,
      {
        method: "PUT",
        headers: {
          ...f.headers,
          "Content-Type": "audio/wav",
          "X-Resource-Kind": "audio",
        },
        body: "partial",
      },
    );
    assert.equal(third.status, 429);
    assert.equal(third.headers.get("retry-after"), "60");
    first.req.destroy();
    second.req.destroy();
    await Promise.all([first.result, second.result]);
    await waitFor(() => readdirSync(f.media.directory).length === 0);
    assert.equal(
      f.repository.db
        .prepare("SELECT count(*) AS n FROM stories_resources")
        .get()!.n,
      0,
    );
  } finally {
    t.mock.timers.reset();
    for (const q of requests) q.destroy();
    await f.close();
  }
});
