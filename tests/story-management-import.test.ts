import {mediaBinary} from '../server/stories/macos-media.ts';
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
    execFileSync(mediaBinary("ffmpeg"), [
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
    execFileSync(mediaBinary("ffmpeg"), [
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

test('initial import selects supplied official covers when no imagePath is specified, without publishing', async () => {
  const {execFileSync}=await import('node:child_process');
  const {join,resolve}=await import('node:path');
  const {readFileSync}=await import('node:fs');
  const {createHash}=await import('node:crypto');
  const filenames={'enlace-falso':'enlace.png','llamada-sospechosa':'llamada.png','contrasena-compartida':'contra.png'};
  const f=await storyFixture();
  try {
    const audio=join(f.dir,'test-tone.wav');
    execFileSync(mediaBinary('ffmpeg'),['-v','error','-f','lavfi','-i','sine=frequency=440:duration=1','-threads','1',audio]);
    for(const id of ['enlace-falso','llamada-sospechosa','contrasena-compartida']) {
      const imported=await importInitialStory(f.service,f.media,f.token,{
        id,audioPath:audio,sourceReference:'Supplied cover; synthetic test audio only',reviewReference:'Synthetic test review, not real editorial approval',
        working:{...emptyDraft(),title:'Caso de prueba',category:'Prueba',description:'Relato sintético de prueba',imageAlt:'Portada de prueba',transcript:'Tono sintético de prueba',question:'¿QUÉ ERROR SE COMETIÓ?',options:[1,2,3].map(n=>({id:'opcion-'+n,label:'Opción '+n,explanation:'Riesgo y prevención de prueba '+n}))},
      });
      const image=f.repository.db.prepare('SELECT width,height,state,sha256 FROM stories_resources WHERE id=?').get(imported.working.imageResourceId);
      assert.equal(image?.sha256,createHash('sha256').update(readFileSync(resolve('public/images/stories',filenames[id as keyof typeof filenames]))).digest('hex'));
      assert.equal(image?.width,660);assert.equal(image?.height,195);assert.equal(image?.state,'ready');assert.equal(imported.active,false);
    }
    assert.deepEqual(f.service.catalog().stories,[]);
  }finally{f.cleanup();}
});

test('initial import selects the owner-approved audio for each initial case when audioPath is omitted', async () => {
  const {readFileSync}=await import('node:fs');
  const {resolve}=await import('node:path');
  const {createHash}=await import('node:crypto');
  const approved={
    'enlace-falso':'historia_tres_editada.mp3.mpeg',
    'llamada-sospechosa':'hidtoria_dos_editada.mp3.mpeg',
    'contrasena-compartida':'historia_uno_editada.mp3.mpeg',
  };
  const f=await storyFixture();
  try {
    for(const [id,file] of Object.entries(approved)){
      const imported=await importInitialStory(f.service,f.media,f.token,{
        id,sourceReference:'Owner-approved source audio; synthetic test record',reviewReference:'Synthetic record review for isolated test, not editorial approval',
        working:{...emptyDraft(),title:'Ficha de prueba',category:'Prueba',description:'Prueba de asociación de medios',imageAlt:'Portada de prueba',transcript:'Texto de prueba, no transcripción oficial',question:'¿QUÉ ERROR SE COMETIÓ?',options:[1,2,3].map(n=>({id:'opcion-'+n,label:'Opción '+n,explanation:'Explicación de prueba '+n}))},
      });
      const audio=f.repository.db.prepare('SELECT sha256,mime,durationSeconds,state FROM stories_resources WHERE id=?').get(imported.working.audioResourceId);
      assert.equal(audio?.sha256,createHash('sha256').update(readFileSync(resolve('content/stories/audio',file))).digest('hex'));
      assert.equal(audio?.mime,'audio/mpeg');assert.equal(audio?.state,'ready');assert(Number(audio?.durationSeconds)>100);assert.equal(imported.active,false);
    }
    assert.deepEqual(f.service.catalog().stories,[]);
  }finally{f.cleanup();}
});

test('initial default audio rejects a changed approval hash without leaving a story or media behind', async () => {
  const {initialStoryAudio}=await import('../server/stories/initial-audio.ts');
  const {readdirSync}=await import('node:fs');
  const material=initialStoryAudio['enlace-falso'];const originalHash=material.sha256;
  const f=await storyFixture();
  try{
    Object.assign(material,{sha256:'0'.repeat(64)});
    await assert.rejects(()=>importInitialStory(f.service,f.media,f.token,{
      id:'enlace-falso',sourceReference:'Test source',reviewReference:'Test review',
      working:{...emptyDraft(),title:'Prueba',category:'Prueba',description:'Prueba',imageAlt:'Prueba',transcript:'Texto de prueba',question:'¿QUÉ ERROR SE COMETIÓ?',options:[1,2,3].map(n=>({id:'opcion-'+n,label:'Opción '+n,explanation:'Explicación '+n}))},
    }),(error:any)=>error.result==='initial_audio_changed');
    assert.equal(f.repo.all().length,0);assert.deepEqual(readdirSync(f.media.directory),[]);
  }finally{Object.assign(material,{sha256:originalHash});f.cleanup();}
});
