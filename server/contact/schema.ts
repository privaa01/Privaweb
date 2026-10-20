import type { DatabaseSync } from "node:sqlite";
const consultation = `CREATE TABLE consultations(id TEXT PRIMARY KEY,nameOrAlias TEXT NOT NULL,email TEXT NOT NULL,message TEXT NOT NULL,receivedAt TEXT NOT NULL,lastActivityAt TEXT NOT NULL,status TEXT NOT NULL CHECK(status IN('Pendiente','Respondido')),revision INTEGER NOT NULL DEFAULT 1 CHECK(revision>0),lifecycle TEXT NOT NULL DEFAULT 'active' CHECK(lifecycle IN('active','deleting')));`;
const attempts = `CREATE TABLE attempts(tokenDigest TEXT PRIMARY KEY,attemptId TEXT NOT NULL,expiresAt INTEGER NOT NULL,state TEXT NOT NULL CHECK(state IN ('COMMITTED','REJECTED','REVOKED')),consultationId TEXT UNIQUE REFERENCES consultations(id) ON DELETE RESTRICT,CHECK((state='COMMITTED' AND consultationId IS NOT NULL) OR (state!='COMMITTED' AND consultationId IS NULL)));`;
const inbox = `CREATE TABLE IF NOT EXISTS reply_operations(operationId TEXT PRIMARY KEY,consultationId TEXT NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,actorAccountId TEXT NOT NULL,sessionDigest TEXT NOT NULL,expectedRevision INTEGER NOT NULL,reviewedRevision INTEGER NOT NULL,retryOf TEXT,payloadHash TEXT NOT NULL,deliveryId TEXT NOT NULL UNIQUE,envelope TEXT,state TEXT NOT NULL CHECK(state IN('queued','dispatching','unknown','rejected','accepted','canceled')),createdAt INTEGER NOT NULL,updatedAt INTEGER NOT NULL,leaseOwner TEXT,leaseGeneration INTEGER NOT NULL DEFAULT 0,leaseUntil INTEGER,nextLookupAt INTEGER NOT NULL DEFAULT 0,dispatchStartedAt INTEGER,providerKeyExpiry INTEGER,acceptedAt INTEGER,proof TEXT,rejectionCode TEXT,lookupAttempts INTEGER NOT NULL DEFAULT 0);
CREATE UNIQUE INDEX IF NOT EXISTS reply_one_unresolved ON reply_operations(consultationId) WHERE state IN('queued','dispatching','unknown');
CREATE TABLE IF NOT EXISTS reply_responses(id TEXT PRIMARY KEY,consultationId TEXT NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,operationId TEXT NOT NULL UNIQUE REFERENCES reply_operations(operationId) ON DELETE CASCADE,actorAccountId TEXT NOT NULL,acceptedAt INTEGER NOT NULL,envelope TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS reply_history ON reply_responses(consultationId,acceptedAt,id);
CREATE INDEX IF NOT EXISTS consultations_list ON consultations(lifecycle,status,receivedAt DESC,id DESC);`;
export function initializeContactSchema(db: DatabaseSync) {
  const version = Number(db.prepare("PRAGMA user_version").get()!.user_version);
  const exists = db
    .prepare(
      "SELECT 1 FROM sqlite_master WHERE type='table' AND name='consultations'",
    )
    .get();
  if (exists) {
    if (version !== 8) throw Error("Offline contact migration required");
    const cols = db
      .prepare("PRAGMA table_info(consultations)")
      .all()
      .map((x) => x.name);
    if (!cols.includes("revision") || !cols.includes("lifecycle"))
      throw Error("Invalid contact schema");
    return;
  }
  if (version !== 0) throw Error("Unknown contact schema");
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec(consultation + attempts + inbox + "PRAGMA user_version=8;COMMIT;");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
// Operator-only, all writers stopped. Only contact data is migrated, never credentials/keys.
export function migrateContactSchema(db: DatabaseSync) {
  const v = Number(db.prepare("PRAGMA user_version").get()!.user_version);
  if (v === 8) {
    initializeContactSchema(db);
    return;
  }
  if (v !== 0) throw Error("Unknown contact schema");
  const cols = db
    .prepare("PRAGMA table_info(consultations)")
    .all()
    .map((x) => x.name)
    .join(",");
  if (cols !== "id,nameOrAlias,email,message,receivedAt,lastActivityAt,status")
    throw Error("Unrecognized legacy schema");
  db.exec("PRAGMA foreign_keys=OFF;BEGIN IMMEDIATE");
  try {
    db.exec(
      "ALTER TABLE consultations RENAME TO consultations_old; ALTER TABLE attempts RENAME TO attempts_old;" +
        consultation +
        attempts +
        "INSERT INTO consultations(id,nameOrAlias,email,message,receivedAt,lastActivityAt,status) SELECT id,nameOrAlias,email,message,receivedAt,lastActivityAt,status FROM consultations_old;INSERT INTO attempts SELECT * FROM attempts_old;DROP TABLE attempts_old;DROP TABLE consultations_old;" +
        inbox,
    );
    if (
      db.prepare("PRAGMA foreign_key_check").all().length ||
      db.prepare("PRAGMA integrity_check").get()!.integrity_check !== "ok"
    )
      throw Error("Migration integrity failure");
    db.exec("PRAGMA user_version=8;COMMIT;");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  } finally {
    db.exec("PRAGMA foreign_keys=ON");
  }
}
export function removeConsultation(db: DatabaseSync, id: string) {
  db.prepare(
    "UPDATE consultations SET lifecycle='deleting',revision=revision+1 WHERE id=?",
  ).run(id);
  db.prepare(
    "UPDATE attempts SET state='REVOKED',consultationId=NULL WHERE consultationId=?",
  ).run(id);
  db.prepare("DELETE FROM reply_responses WHERE consultationId=?").run(id);
  db.prepare("DELETE FROM reply_operations WHERE consultationId=?").run(id);
  db.prepare("DELETE FROM consultations WHERE id=?").run(id);
}
