import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { privacyFixture, receive } from "./helpers/privacy-fixtures.ts";
import { createBackup } from "../server/privacy/backups.ts";
import {
  applySuppressions,
  assertRecovery,
  recordRecovery,
} from "../server/privacy/restore.ts";
import { secureConnection, checkpoint } from "../server/privacy/storage.ts";
import { RETENTION } from "../server/privacy/policy.ts";
test("V09 old backup does not resurrect early deleted contact, reply permission or receipt", async () => {
  const f = await privacyFixture();
  try {
    const x = receive(f),
      live = receive(f, "still current"),
      path = join(f.replicaDir, "old.sqlite");
    await createBackup(
      f.p.db,
      path,
      await f.journal.currentHead(),
      f.key,
      f.time(),
      f.time() + RETENTION,
    );
    f.contact.revoke(x.id);
    await f.privacyWorker.tick();
    const db = new DatabaseSync(path);
    try {
      secureConnection(db);
      assert(db.prepare("SELECT 1 FROM consultations WHERE id=?").get(x.id));
      const head = await applySuppressions(db, f.journal, f.time());
      assert(!db.prepare("SELECT 1 FROM consultations WHERE id=?").get(x.id));
      assert(db.prepare("SELECT 1 FROM consultations WHERE id=?").get(live.id));
      assert.equal(
        db
          .prepare("SELECT state FROM attempts WHERE attemptId=?")
          .get(x.attempt.attemptId)!.state,
        "REVOKED",
      );
      recordRecovery(db, head, f.time());
      await assertRecovery(db, f.journal);
      checkpoint(db, path);
    } finally {
      db.close();
    }
  } finally {
    f.cleanup();
  }
});
test("V10 missing, forked or lower than known head fails closed; pending expiry prevents reopening", async () => {
  const f = await privacyFixture();
  try {
    const x = receive(f);
    await f.journal.append({
      jobId: randomUUID(),
      consultationId: x.id,
      intendedAt: f.time(),
      reason: "request",
    });
    await assert.rejects(() => assertRecovery(f.p.db, f.journal));
    const head = await applySuppressions(f.p.db, f.journal, f.time());
    recordRecovery(f.p.db, head, f.time());
    const old = {
      ...f.journal,
      currentHead: async () => ({ sequence: 0, digest: "0".repeat(64) }),
    };
    await assert.rejects(() => assertRecovery(f.p.db, old as any));
    const bad = {
      currentHead: async () => head,
      readRange: async () => [],
      verify: () => false,
    };
    await assert.rejects(() => applySuppressions(f.p.db, bad as any, f.time()));
    receive(f);
    f.setTime(f.time() + RETENTION);
    await applySuppressions(f.p.db, f.journal, f.time());
    assert.throws(() => recordRecovery(f.p.db, head, f.time()));
  } finally {
    f.cleanup();
  }
});
