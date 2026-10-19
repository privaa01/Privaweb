import { randomToken, digest } from "../server/admin/sessions.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import {
  storyFixture,
  create,
} from "./fixtures/story-management-service/helpers.ts";
import { createStoriesHandler } from "../server/stories/http.ts";
test("every private route refuses missing or revoked authority before data/effect, no anonymous metadata", async () => {
  const f = await storyFixture(),
    a = create(f),
    uuid = randomUUID(),
    origin = "https://admin.example.test";
  const h = createStoriesHandler({
      service: f.service,
      media: f.media,
      origin,
      csrfKey: f.csrfKey,
    }),
    server = createServer(async (q, r) => {
      if (!(await h(q, r))) {
        r.writeHead(404);
        r.end();
      }
    });
  await new Promise<void>((yes) => server.listen(0, "127.0.0.1", yes));
  const base =
    "http://127.0.0.1:" + (server.address() as { port: number }).port;
  try {
    const routes = [
      ["GET", ""],
      ["POST", ""],
      ["GET", "/" + a.storyId],
      ["PUT", "/" + a.storyId],
      ["POST", "/" + a.storyId + "/publicar"],
      ["POST", "/" + a.storyId + "/activacion"],
      ["PUT", "/" + a.storyId + "/recursos/" + uuid],
      ["GET", "/recursos/" + uuid],
      ["HEAD", "/recursos/" + uuid],
      ["GET", "/operaciones/" + uuid],
    ];
    const third = randomToken();
    f.repository.createSession(
      f.two.account.id,
      f.two.account.credentialVersion,
      digest(third),
    );
    for (const cookie of [
      "",
      "__Host-priva_session=invalid",
      `__Host-priva_session=${f.token}`,
      `__Host-priva_session=${f.token2}`,
      `__Host-priva_session=${third}`,
    ]) {
      if (cookie.endsWith(f.token))
        f.repository.setAuthorization(f.one.account.id, false);
      if (cookie.endsWith(f.token2)) f.repository.logout(f.token2);
      if (cookie.endsWith(third)) f.setTime(f.time() + 3600000);
      for (const [method, path] of routes) {
        const res = await fetch(base + "/api/admin/historias" + path, {
          method,
          headers: { "X-Priva-Request": "1", Origin: origin, Cookie: cookie },
          ...(method === "POST" || method === "PUT"
            ? { body: "not valid private payload" }
            : {}),
        });
        assert.equal(res.status, 401, method + " " + path);
        if (method !== "HEAD") {
          const txt = await res.text();
          assert.equal(txt.includes(a.storyId), false);
        }
      }
    }
    assert.equal(f.repo.get(a.storyId).revision, 1);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((yes) => server.close(() => yes()));
    f.cleanup();
  }
});
