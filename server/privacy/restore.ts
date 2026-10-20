import { ErasureCoordinator, type ErasureRepository } from "./erasure.ts";
import type { CopiesAdapter } from "./copies.ts";
import { checkpoint } from "./storage.ts";
import type { DatabaseSync } from "node:sqlite";
import type { DeletionJournal, Head } from "./deletion-journal.ts";
import { eraseRows, queueErasure, isPrivacy } from "./schema.ts";
import { expiresAt } from "./policy.ts";
export async function verifiedHead(
  journal: DeletionJournal,
  minimumSequence = 0,
) {
  const head = await journal.currentHead();
  if (!Number.isSafeInteger(head.sequence) || head.sequence < minimumSequence)
    throw Error("Rollback of deletion journal");
  const entries = await journal.readRange(1, head.sequence);
  if (!journal.verify(entries, head))
    throw Error("Incomplete deletion journal");
  return { head, entries };
}
/** Caller holds exclusive maintenance barrier. The independently current journal, never the restored DB, is authority. */
export async function applySuppressions(
  db: DatabaseSync,
  journal: DeletionJournal,
  now: number,
  minimumSequence = 0,
) {
  if (!isPrivacy(db)) throw Error("Privacy schema required");
  const { head, entries } = await verifiedHead(journal, minimumSequence);
  db.exec("BEGIN IMMEDIATE");
  try {
    for (const e of entries) {
      eraseRows(db, e.consultationId, now);
      db.prepare("DELETE FROM erasure_jobs WHERE consultationId=?").run(
        e.consultationId,
      );
    }
    for (const c of db
      .prepare("SELECT id,lastActivityAt FROM consultations")
      .all()) {
      if (expiresAt(String(c.lastActivityAt)) <= now)
        queueErasure(db, String(c.id), now, undefined, "expiry");
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  return head;
}
export function recordRecovery(db: DatabaseSync, head: Head, now: number) {
  if (db.prepare("SELECT 1 FROM erasure_jobs WHERE state!='completed'").get())
    throw Error("Recovery erasures pending");
  db.prepare(
    "INSERT INTO privacy_recovery VALUES(1,?,?) ON CONFLICT(singleton) DO UPDATE SET head=excluded.head,verifiedAt=excluded.verifiedAt",
  ).run(JSON.stringify(head), now);
}
export async function assertRecovery(
  db: DatabaseSync,
  journal: DeletionJournal,
) {
  if (!isPrivacy(db)) throw Error("Privacy schema required");
  const saved = db
    .prepare("SELECT head FROM privacy_recovery WHERE singleton=1")
    .get();
  if (!saved) throw Error("Recovery receipt missing");
  const previous = JSON.parse(String(saved.head)) as Head,
    { head, entries } = await verifiedHead(journal, previous.sequence);
  if (
    previous.sequence > 0 &&
    (entries.find((e) => e.sequence === previous.sequence)?.signature ??
      (typeof (journal as any).anchor === "function" &&
      (journal as any).anchor().sequence === previous.sequence
        ? (journal as any).anchor().digest
        : undefined)) !== previous.digest
  )
    throw Error("Recovery receipt fork");
  for (const e of entries) {
    if (
      db
        .prepare(
          "SELECT 1 FROM consultations WHERE id=? AND lifecycle='active'",
        )
        .get(e.consultationId)
    )
      throw Error("Suppressed data reappeared");
  }
  return head;
}

export async function finishOfflineRecovery(
  db: DatabaseSync,
  path: string,
  journal: DeletionJournal,
  copies: CopiesAdapter,
  now: number,
) {
  const repository: ErasureRepository = {
    db,
    clock: () => now,
    queueExpired: () => 0,
    tx<T>(fn: () => T) {
      db.exec("BEGIN IMMEDIATE");
      try {
        const v = fn();
        if (v && typeof (v as any).then === "function")
          throw Error("Async transaction forbidden");
        db.exec("COMMIT");
        return v;
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
    },
  };
  const coordinator = new ErasureCoordinator(repository, journal, copies, {
    clean: async () => checkpoint(db, path),
  });
  // A failure stops recovery, never changes deadline or reopens a partial restore.
  while (
    db.prepare("SELECT 1 FROM erasure_jobs WHERE state!='completed'").get()
  ) {
    if (!(await coordinator.tick()))
      throw Error("Offline recovery erasure blocked");
  }
  checkpoint(db, path);
}
