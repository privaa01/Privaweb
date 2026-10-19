// Restricted operator module: no public import endpoint or additional account permission.
import {
  readFileSync,
  lstatSync,
  realpathSync,
  openSync,
  closeSync,
  fsyncSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { join } from "node:path";
import { randomUUID, createHash } from "node:crypto";
import type { StoriesService } from "./service.ts";
import type { StoryMedia } from "./media.ts";
import { inspect } from "./media.ts";
import {
  StoryError,
  type StoryDraft,
} from "../../src/lib/story-management-contract.ts";
import { validateDraft } from "./validation.ts";
const initial = ["enlace-falso", "llamada-sospechosa", "contrasena-compartida"];
export async function importInitialStory(
  service: StoriesService,
  media: StoryMedia,
  token: string | undefined,
  input: {
    id: string;
    working: StoryDraft;
    imagePath: string;
    audioPath: string;
    sourceReference: string;
    reviewReference: string;
  },
) {
  service.authorize(token);
  if (
    !initial.includes(input.id) ||
    !input.sourceReference.trim() ||
    !input.reviewReference.trim()
  )
    throw new StoryError(422, "materials_unreviewed");
  try {
    return service.get(token, input.id);
  } catch (e) {
    if (!(e instanceof StoryError) || e.status !== 404) throw e;
  }
  if (input.working.question !== "¿QUÉ ERROR SE COMETIÓ?")
    throw new StoryError(422, "initial_question_changed");
  const resources: (Awaited<ReturnType<typeof inspect>> & {
    id: string;
    kind: "image" | "audio";
    bytes: number;
    hash: string;
  })[] = [];
  const written: string[] = [];
  try {
    for (const [kind, path] of [
      ["image", input.imagePath],
      ["audio", input.audioPath],
    ] as const) {
      service.authorize(token);
      const st = lstatSync(path);
      if (
        !st.isFile() ||
        st.isSymbolicLink() ||
        realpathSync(path) !== path ||
        st.size <= 0 ||
        st.size > (kind === "image" ? 8 : 50) * 1048576
      )
        throw new StoryError(422, "invalid_media");
      const meta = await inspect(path, kind);
      const id = randomUUID(),
        buf = readFileSync(path),
        dest = join(media.directory, id);
      writeFileSync(dest, buf, { flag: "wx", mode: 0o600 });
      written.push(dest);
      const fd = openSync(dest, "r");
      try {
        fsyncSync(fd);
      } finally {
        closeSync(fd);
      }
      resources.push({
        id,
        kind,
        ...meta,
        bytes: buf.length,
        hash: createHash("sha256").update(buf).digest("hex"),
      });
    }
    const fd = openSync(media.directory, "r");
    try {
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    const draft = validateDraft(
      {
        ...input.working,
        imageResourceId: resources[0].id,
        audioResourceId: resources[1].id,
      },
      true,
    );
    const repo = service.repository;
    const story = repo.admin.withAuthorizedTransaction(token, (_db, a) => {
      if (
        repo.admin.db
          .prepare("SELECT 1 FROM stories_records WHERE id=?")
          .get(input.id)
      )
        throw new StoryError(409, "conflict");
      const now = repo.admin.clock() + initial.indexOf(input.id);
      repo.admin.db
        .prepare("INSERT INTO stories_records VALUES(?,1,?,?,0,0,?,?,?,?,?)")
        .run(
          input.id,
          JSON.stringify(draft),
          JSON.stringify(draft),
          now,
          now,
          now,
          a.id,
          a.id,
        );
      for (const v of resources)
        repo.admin.db
          .prepare(
            "INSERT INTO stories_resources VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
          )
          .run(
            v.id,
            input.id,
            v.kind,
            v.id,
            v.hash,
            v.bytes,
            v.mime,
            v.width,
            v.height,
            v.durationSeconds,
            "ready",
            now,
            a.id,
          );
      return repo.get(input.id);
    });
    written.length = 0;
    return story;
  } finally {
    for (const p of written)
      try {
        unlinkSync(p);
      } catch {}
  }
}
