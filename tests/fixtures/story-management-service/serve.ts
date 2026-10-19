import { randomUUID, createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { randomToken, digest } from "../../../server/admin/sessions.ts";
import { emptyDraft } from "../../../src/lib/story-management-contract.ts";
// Synthetic reference only; never imported by production startup.
import { createServer } from "node:http";
import {
  mkdtempSync,
  rmSync,
  readFileSync,
  lstatSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { openAdminRuntime } from "../../../server/admin/runtime.ts";
import { AdminService } from "../../../server/admin/service.ts";
import { createAdminHandler } from "../../../server/admin/http.ts";
import { StoriesRepository } from "../../../server/stories/sqlite-repository.ts";
import { StoriesService } from "../../../server/stories/service.ts";
import { StoryMedia } from "../../../server/stories/media.ts";
import { createStoriesHandler } from "../../../server/stories/http.ts";
const dir = mkdtempSync(join(tmpdir(), "priva-stories-browser-")),
  runtime = openAdminRuntime(dir, [
    resolve("public"),
    resolve("dist"),
    resolve(".private-build"),
  ]);
for (const email of [
  "one@example.com",
  "two@example.com",
  ...[360, 390, 430, 768, 1024, 1280, 1440].flatMap((w) =>
    [100, 200].map((z) => `matrix-${w}-${z}@example.com`),
  ),
]) {
  const a = runtime.repository.createAccount(email);
  const hash = await runtime.hasher.hash("synthetic private phrase 2026");
  runtime.repository.db
    .prepare(
      "UPDATE admin_accounts SET passwordRecord=?,mailboxVerifiedAt=? WHERE id=?",
    )
    .run(JSON.stringify(hash), Date.now(), a.id);
}
const repo = new StoriesRepository(runtime.repository),
  media = new StoryMedia(repo, join(dir, "media")),
  service = new StoriesService(repo, media.verify);
// Offline domain fixture ONLY: media acceptance/isolation is not certified by these records.
const actor = runtime.repository.findAccount("one@example.com")!;
const fixtureToken = randomToken();
runtime.repository.createSession(
  actor.id,
  actor.credentialVersion,
  digest(fixtureToken),
);
for (const fixtureIndex of [0, 1, 2, 3]) {
  const prepared = service.change(fixtureToken, "create", null, {
    operationId: randomUUID(),
    working: emptyDraft(),
  });
  const resourceIds = [randomUUID(), randomUUID()];
  const blobs = [
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jkXcAAAAASUVORK5CYII=",
      "base64",
    ),
    readFileSync(
      resolve("tests/fixtures/stories/public/media/public/test-audio-0.wav"),
    ),
  ];
  for (let i = 0; i < 2; i++) {
    writeFileSync(join(media.directory, resourceIds[i]), blobs[i], {
      mode: 0o600,
    });
    runtime.repository.db
      .prepare(
        "INSERT INTO stories_resources VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .run(
        resourceIds[i],
        prepared.storyId,
        i ? "audio" : "image",
        resourceIds[i],
        createHash("sha256").update(blobs[i]).digest("hex"),
        blobs[i].length,
        i ? "audio/wav" : "image/png",
        i ? null : 1,
        i ? null : 1,
        i ? 1 : null,
        "ready",
        Date.now(),
        actor.id,
      );
  }
  service.change(fixtureToken, "save", prepared.storyId, {
    operationId: randomUUID(),
    expectedRevision: 1,
    working: {
      ...emptyDraft(),
      title:
        "Caso sintético de integración" +
        (fixtureIndex ? ` ${fixtureIndex + 1}` : ""),
      category: "Prueba",
      description: "Contenido sintético de prueba",
      imageResourceId: resourceIds[0],
      imageAlt: "Imagen sintética",
      audioResourceId: resourceIds[1],
      transcript: "Transcripción sintética A",
      question: "¿QUÉ ERROR SE COMETIÓ?",
      options: [1, 2, 3].map((n) => ({
        id: "opcion-" + n,
        label: "Opción " + n,
        explanation: "Riesgo y prevención " + n,
      })),
    },
  });
  service.change(fixtureToken, "publish", prepared.storyId, {
    operationId: randomUUID(),
    expectedRevision: 2,
  });
  service.change(fixtureToken, "activate", prepared.storyId, {
    operationId: randomUUID(),
    expectedRevision: 3,
    active: true,
  });
}
runtime.repository.logout(fixtureToken);
const stories = createStoriesHandler({
  service,
  media,
  origin: "http://localhost:4331",
  csrfKey: runtime.csrfKey,
});
const handler = createAdminHandler({
  ...runtime,
  service: new AdminService(
    runtime.repository,
    runtime.hasher,
    runtime.abuseKey,
  ),
  origin: "http://localhost:4331",
  viewsRoot: resolve(".private-build/admin"),
  stories,
});
const server = createServer(async (req, res) => {
  if ((req.url ?? "").startsWith("/_astro/")) {
    const file = resolve(".test-output/stories", req.url!.slice(1));
    try {
      if (
        !file.startsWith(resolve(".test-output/stories") + "/") ||
        realpathSync(file) !== file ||
        !lstatSync(file).isFile()
      )
        throw Error();
      res.setHeader(
        "Content-Type",
        file.endsWith(".js") ? "text/javascript" : "text/css",
      );
      res.end(readFileSync(file));
    } catch {
      res.writeHead(404);
      res.end();
    }
    return;
  }
  if (req.url === "/historias.html") {
    res.setHeader("Content-Type", "text/html");
    res.end(readFileSync(resolve(".test-output/stories/historias.html")));
    return;
  }
  await handler(req, res);
});
server.requestTimeout = 120000;
server.headersTimeout = 30000;
server.listen(4331, "127.0.0.1");
const stop = () =>
  server.close(() => {
    runtime.repository.close();
    rmSync(dir, { recursive: true, force: true });
  });
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
