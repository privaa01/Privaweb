import { test } from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import {
  storyFixture,
  create,
  complete,
  save,
  publish,
} from "./fixtures/story-management-service/helpers.ts";
import { emptyDraft } from "../src/lib/story-management-contract.ts";
test("1000 records local metadata list and prepared publication p95 below 1s", async () => {
  const f = await storyFixture();
  try {
    const d = JSON.stringify(emptyDraft()),
      now = f.time();
    f.repository.transaction(() => {
      const stmt = f.repository.db.prepare(
        "INSERT INTO stories_records VALUES(?,1,?,NULL,0,0,?,?,NULL,?,?)",
      );
      for (let i = 0; i < 1000; i++)
        stmt.run(
          "historia-local-" + i,
          d,
          now,
          now,
          f.one.account.id,
          f.one.account.id,
        );
    });
    const timings = [];
    for (let i = 0; i < 30; i++) {
      const began = performance.now();
      assert.equal(f.service.list(f.token).stories.length, 1000);
      timings.push(performance.now() - began);
    }
    const a = create(f);
    save(f, a.storyId, complete(f, a.storyId));
    const pub = [];
    for (let i = 0; i < 30; i++) {
      const began = performance.now();
      publish(f, a.storyId);
      pub.push(performance.now() - began);
    }
    const p95 = (a: number[]) =>
      a.sort((a, b) => a - b)[Math.ceil(a.length * 0.95) - 1];
    console.info(
      JSON.stringify({
        benchmark: "007-local",
        node: process.version,
        records: 1000,
        samples: 30,
        listP95ms: p95(timings),
        publicationP95ms: p95(pub),
      }),
    );
    assert.ok(p95(timings) < 1000);
    assert.ok(p95(pub) < 1000);
  } finally {
    f.cleanup();
  }
});
