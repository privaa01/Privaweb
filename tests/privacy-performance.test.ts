import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { randomUUID } from "node:crypto";
import { privacyFixture, populate } from "./helpers/privacy-fixtures.ts";
import { RETENTION } from "../server/privacy/policy.ts";
test("V03 1000 contacts/10 replies each: indexed 100-row deadline batches p95 <=5s and expired exclusion", async () => {
  const allBatches: number[] = [];
  for (let round = 0; round < 4; round++) {
    const f = await privacyFixture();
    try {
      const ids = populate(f);
      const date = f.time();
      f.p.tx(() => {
        const op = f.p.db.prepare(
            "INSERT INTO reply_operations(operationId,consultationId,actorAccountId,sessionDigest,expectedRevision,reviewedRevision,payloadHash,deliveryId,state,createdAt,updatedAt) VALUES(?,?,?,'synthetic',1,1,'synthetic',?,'accepted',?,?)",
          ),
          reply = f.p.db.prepare(
            "INSERT INTO reply_responses VALUES(?,?,?,?,?,?)",
          );
        for (const id of ids)
          for (let n = 0; n < 10; n++) {
            const operationId = randomUUID(),
              deliveryId = randomUUID();
            op.run(operationId, id, f.one.account.id, deliveryId, date, date);
            const envelope = f.crypto.seal(
              [operationId, id, f.one.account.id, deliveryId].join(":"),
              {
                to: "synthetic@example.com",
                from: "synthetic@example.com",
                subject: "synthetic",
                text: "synthetic",
              },
            );
            reply.run(
              randomUUID(),
              id,
              operationId,
              f.one.account.id,
              date,
              envelope,
            );
          }
      });
      f.setTime(f.time() + RETENTION);
      f.p.queueExpired();
      assert.equal(f.repo.summary().total, 0);
      const samples: number[] = [];
      for (let n = 0; n < 35; n++) {
        const start = performance.now();
        const rows = f.p.db
          .prepare(
            "SELECT jobId FROM erasure_jobs WHERE state='intent' AND nextAttemptAt<=? ORDER BY dueAt LIMIT 100",
          )
          .all(f.time());
        assert.equal(rows.length, 100);
        if (n >= 5) samples.push(performance.now() - start);
      }
      samples.sort((a, b) => a - b);
      const p95 = samples[Math.ceil(samples.length * 0.95) - 1];
      assert(p95 <= 5000, "p95 exceeded: " + p95);
      console.info("privacy deadline batch query p95(ms): " + p95.toFixed(3));
      const batchDurations: number[] = [];
      for (let n = 0; n < 10; n++) {
        const start = performance.now();
        await f.privacyWorker.tick();
        const duration = performance.now() - start;
        batchDurations.push(duration);
        if (round > 0) allBatches.push(duration);
      }
      assert.equal(
        f.p.db.prepare("SELECT count(*) n FROM consultations").get()!.n,
        0,
      );
      assert.equal(
        f.p.db
          .prepare(
            "SELECT count(*) n FROM erasure_jobs WHERE state='completed'",
          )
          .get()!.n,
        1000,
      );

      console.info(
        "privacy full100-row batch maximum(ms): " +
          Math.max(...batchDurations).toFixed(3),
      );
    } finally {
      f.cleanup();
    }
  }
  assert.equal(allBatches.length, 30);
  allBatches.sort((a, b) => a - b);
  const fullP95 = allBatches[Math.ceil(allBatches.length * 0.95) - 1];
  assert(fullP95 <= 5000, "full batch p95 exceeded5s: " + fullP95);
  console.info(
    "privacy full-batch p95 across30 post-warmup samples(ms): " +
      fullP95.toFixed(3),
  );
});
