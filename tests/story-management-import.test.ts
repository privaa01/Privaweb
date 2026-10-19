import { test } from "node:test";
import assert from "node:assert/strict";
import { storyFixture } from "./fixtures/story-management-service/helpers.ts";
import { emptyDraft } from "../src/lib/story-management-contract.ts";
import { importInitialStory } from "../server/stories/import.ts";
test("operator import requires access, initial ID, materials and review; no fake seeds", async () => {
  const f = await storyFixture();
  try {
    const input = {
      id: "enlace-falso",
      working: emptyDraft(),
      imagePath: "/missing",
      audioPath: "/missing",
      sourceReference: "",
      reviewReference: "",
    };
    await assert.rejects(() =>
      importInitialStory(f.service, f.media, undefined, input),
    );
    await assert.rejects(() =>
      importInitialStory(f.service, f.media, f.token, input),
    );
    await assert.rejects(() =>
      importInitialStory(f.service, f.media, f.token, {
        ...input,
        id: "new-story",
        sourceReference: "synthetic",
        reviewReference: "synthetic",
      }),
    );
    assert.equal(f.service.list(f.token).stories.length, 0);
  } finally {
    f.cleanup();
  }
});

test("restricted import keeps three initial IDs/order and repeated import preserves managed changes (synthetic materials only)", async () => {
  const { execFileSync } = await import("node:child_process");
  const { join } = await import("node:path");
  const { save } =
    await import("./fixtures/story-management-service/helpers.ts");
  const f = await storyFixture();
  try {
    const image = join(f.dir, "synthetic.png"),
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
    const ids = ["enlace-falso", "llamada-sospechosa", "contrasena-compartida"];
    const working = {
      ...emptyDraft(),
      title: "Caso sintético de importación",
      category: "Prueba",
      description: "Relato sintético",
      imageAlt: "Cuadro verde",
      transcript: "Señal sintética",
      question: "¿QUÉ ERROR SE COMETIÓ?",
      options: [1, 2, 3].map((n) => ({
        id: "opcion-" + n,
        label: "Opción " + n,
        explanation: "Riesgo y prevención " + n,
      })),
    };
    for (const id of ids) {
      const input = {
        id,
        working,
        imagePath: image,
        audioPath: audio,
        sourceReference: "synthetic-only",
        reviewReference: "synthetic-only",
      };
      const imported = await importInitialStory(
        f.service,
        f.media,
        f.token,
        input,
      );
      assert.equal(imported.id, id);
      assert.equal(imported.active, false);
      save(f, id, { ...imported.working, title: "Cambio gestionado" });
      const again = await importInitialStory(
        f.service,
        f.media,
        f.token,
        input,
      );
      assert.equal(again.working.title, "Cambio gestionado");
    }
    assert.deepEqual(
      f.repo.all().map((s) => s.id),
      ids,
    );
    assert.equal(
      f.repository.db
        .prepare("SELECT count(*) AS n FROM stories_resources")
        .get()!.n,
      6,
    );
    assert.deepEqual(f.service.catalog().stories, []);
  } finally {
    f.cleanup();
  }
});
