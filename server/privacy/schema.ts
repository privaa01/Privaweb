import type { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { dueAt, expiresAt } from "./policy.ts";
export const privacySchema = `
CREATE TABLE privacy_requests(requestId TEXT PRIMARY KEY,actorAccountId TEXT NOT NULL,createdAt INTEGER NOT NULL,expiresAt INTEGER NOT NULL,state TEXT NOT NULL CHECK(state IN('awaiting_send','awaiting_confirmation','confirmed','expired','locked','canceled','completed')),confirmedAt INTEGER,deadlineAt INTEGER,failedAttempts INTEGER NOT NULL DEFAULT 0 CHECK(failedAttempts BETWEEN 0 AND 5),challengeDigest TEXT,keyVersion TEXT NOT NULL,payloadHash TEXT NOT NULL,terminalAt INTEGER);
CREATE TABLE privacy_request_targets(requestId TEXT NOT NULL REFERENCES privacy_requests(requestId) ON DELETE CASCADE,consultationId TEXT NOT NULL,reviewedRevision INTEGER NOT NULL,PRIMARY KEY(requestId,consultationId));
CREATE TABLE privacy_mail_operations(operationId TEXT PRIMARY KEY REFERENCES privacy_requests(requestId) ON DELETE CASCADE,deliveryId TEXT NOT NULL UNIQUE,payloadEncrypted TEXT,payloadDigest TEXT NOT NULL,sessionDigest TEXT NOT NULL,state TEXT NOT NULL CHECK(state IN('queued','dispatching','unknown','accepted','rejected','canceled')),createdAt INTEGER NOT NULL,acceptedAt INTEGER,leaseOwner TEXT,leaseGeneration INTEGER NOT NULL DEFAULT 0,leaseUntil INTEGER,nextLookupAt INTEGER NOT NULL DEFAULT 0,lookupAttempts INTEGER NOT NULL DEFAULT 0,proofEncrypted TEXT);
CREATE TABLE erasure_jobs(jobId TEXT PRIMARY KEY,consultationId TEXT NOT NULL UNIQUE,reason TEXT NOT NULL CHECK(reason IN('expiry','request','restore')),intentAt INTEGER NOT NULL,dueAt INTEGER NOT NULL,state TEXT NOT NULL CHECK(state IN('intent','replicated','logical_deleted','physical_verified','completed')),journalSequence INTEGER,replicaReceipt TEXT,captureReceipt TEXT,logicalDeletedAt INTEGER,physicalVerifiedAt INTEGER,overdueAt INTEGER,failureCode TEXT,leaseOwner TEXT,leaseGeneration INTEGER NOT NULL DEFAULT 0,leaseUntil INTEGER,nextAttemptAt INTEGER NOT NULL DEFAULT 0,attempts INTEGER NOT NULL DEFAULT 0);
CREATE INDEX erasure_due ON erasure_jobs(state,nextAttemptAt,dueAt);
CREATE INDEX consultations_expiry ON consultations(lifecycle,lastActivityAt);
CREATE TABLE privacy_abuse(bucket TEXT PRIMARY KEY,count INTEGER NOT NULL,windowEnd INTEGER NOT NULL);
CREATE TABLE privacy_backup_manifests(backupId TEXT PRIMARY KEY,manifest TEXT NOT NULL);
CREATE TABLE privacy_recovery(singleton INTEGER PRIMARY KEY CHECK(singleton=1),head TEXT NOT NULL,verifiedAt INTEGER NOT NULL);
`;
export function isPrivacy(db: DatabaseSync) {
  return Number(db.prepare("PRAGMA user_version").get()!.user_version) === 9;
}
export function migratePrivacy(db: DatabaseSync) {
  const version = Number(db.prepare("PRAGMA user_version").get()!.user_version);
  if (version === 9) return;
  if (version !== 8) throw Error("Migrate inbox before privacy");
  db.exec("PRAGMA secure_delete=ON; BEGIN IMMEDIATE");
  try {
    db.exec(privacySchema + "PRAGMA user_version=9; COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
export function queueErasure(
  db: DatabaseSync,
  id: string,
  now: number,
  confirmedAt?: number,
  reason: "expiry" | "request" | "restore" = "request",
) {
  const c = db.prepare("SELECT * FROM consultations WHERE id=?").get(id);
  if (!c) return null;
  const existing = db
    .prepare("SELECT * FROM erasure_jobs WHERE consultationId=?")
    .get(id);
  const deadline = dueAt(
    String(c.lastActivityAt),
    confirmedAt ?? (reason === "request" ? now : undefined),
  );
  if (existing) {
    db.prepare("UPDATE erasure_jobs SET dueAt=min(dueAt,?) WHERE jobId=?").run(
      deadline,
      existing.jobId,
    );
    return String(existing.jobId);
  }
  const jobId = randomUUID();
  db.prepare(
    "INSERT INTO erasure_jobs(jobId,consultationId,reason,intentAt,dueAt,state) VALUES(?,?,?,?,?,'intent')",
  ).run(jobId, id, reason, now, deadline);
  db.prepare(
    "UPDATE consultations SET lifecycle='deleting',revision=revision+1 WHERE id=?",
  ).run(id);
  db.prepare(
    "UPDATE reply_operations SET state='canceled',envelope=NULL WHERE consultationId=? AND state='queued'",
  ).run(id);
  return jobId;
}
export function eraseRows(db: DatabaseSync, id: string, now = Date.now()) {
  const linked = db
    .prepare(
      "SELECT requestId FROM privacy_request_targets WHERE consultationId=?",
    )
    .all(id);
  for (const q of linked) {
    db.prepare(
      "UPDATE privacy_requests SET state=CASE WHEN state IN('confirmed','completed') THEN state ELSE 'canceled' END,challengeDigest=NULL,terminalAt=coalesce(terminalAt,?) WHERE requestId=?",
    ).run(now, q.requestId);
    db.prepare(
      "UPDATE privacy_mail_operations SET payloadEncrypted=NULL,proofEncrypted=NULL,state=CASE WHEN state='accepted' THEN state ELSE 'canceled' END WHERE operationId=?",
    ).run(q.requestId);
  }

  db.prepare(
    "UPDATE attempts SET state='REVOKED',consultationId=NULL WHERE consultationId=?",
  ).run(id);
  db.prepare("DELETE FROM reply_responses WHERE consultationId=?").run(id);
  db.prepare("DELETE FROM reply_operations WHERE consultationId=?").run(id);
  db.prepare("DELETE FROM privacy_request_targets WHERE consultationId=?").run(
    id,
  );
  db.prepare("DELETE FROM consultations WHERE id=?").run(id);
}
