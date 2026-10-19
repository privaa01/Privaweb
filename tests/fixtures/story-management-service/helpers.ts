import { fixture, seed } from "../admin-service/helpers.ts";
import { randomUUID, createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { StoriesRepository } from "../../../server/stories/sqlite-repository.ts";
import { StoriesService } from "../../../server/stories/service.ts";
import { StoryMedia } from "../../../server/stories/media.ts";
import { randomToken, digest } from "../../../server/admin/sessions.ts";
import {
  emptyDraft,
  type StoryDraft,
} from "../../../src/lib/story-management-contract.ts";
export async function storyFixture() {
  const f = fixture();
  const one = await seed(f),
    two = await seed(f, "two@example.com");
  const token = randomToken(),
    token2 = randomToken();
  f.repository.createSession(
    one.account.id,
    one.account.credentialVersion,
    digest(token),
  );
  f.repository.createSession(
    two.account.id,
    two.account.credentialVersion,
    digest(token2),
  );
  const repo = new StoriesRepository(f.repository),
    media = new StoryMedia(repo, join(f.dir, "media"));
  const service = new StoriesService(repo, media.verify);
  return { ...f, repo, media, service, token, token2, one, two };
}
export function create(
  f: Awaited<ReturnType<typeof storyFixture>>,
  working: StoryDraft = emptyDraft(),
) {
  return f.service.change(f.token, "create", null, {
    operationId: randomUUID(),
    working,
  });
}
// Explicit domain-test resources: bytes are synthetic, NOT media-inspection or official-material evidence.
export function complete(
  f: Awaited<ReturnType<typeof storyFixture>>,
  storyId: string,
) {
  const ids = [randomUUID(), randomUUID()];
  for (let i = 0; i < 2; i++) {
    const blob = Buffer.from("synthetic domain bytes " + ids[i]);
    writeFileSync(join(f.media.directory, ids[i]), blob, { mode: 0o600 });
    f.repository.db
      .prepare(
        "INSERT INTO stories_resources VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .run(
        ids[i],
        storyId,
        i ? "audio" : "image",
        ids[i],
        createHash("sha256").update(blob).digest("hex"),
        blob.length,
        i ? "audio/wav" : "image/png",
        i ? null : 10,
        i ? null : 10,
        i ? 5 : null,
        "ready",
        f.time(),
        f.one.account.id,
      );
  }
  return {
    ...emptyDraft(),
    title: "Historia sintética",
    category: "Prueba",
    description: "Relato de prueba",
    imageResourceId: ids[0],
    imageAlt: "Imagen de prueba",
    audioResourceId: ids[1],
    transcript: "Audio de prueba",
    question: "¿Qué riesgo observas?",
    options: [1, 2, 3].map((n) => ({
      id: `opcion-${n}`,
      label: `Opción ${n}`,
      explanation: `Riesgo y prevención ${n}`,
    })),
  };
}
export function save(
  f: Awaited<ReturnType<typeof storyFixture>>,
  id: string,
  working: StoryDraft,
) {
  return f.service.change(f.token, "save", id, {
    operationId: randomUUID(),
    expectedRevision: f.service.get(f.token, id).revision,
    working,
  });
}
export function publish(
  f: Awaited<ReturnType<typeof storyFixture>>,
  id: string,
) {
  return f.service.change(f.token, "publish", id, {
    operationId: randomUUID(),
    expectedRevision: f.service.get(f.token, id).revision,
  });
}
export function activate(
  f: Awaited<ReturnType<typeof storyFixture>>,
  id: string,
  active = true,
) {
  return f.service.change(f.token, "activate", id, {
    operationId: randomUUID(),
    expectedRevision: f.service.get(f.token, id).revision,
    active,
  });
}
