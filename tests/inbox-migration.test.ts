import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import {
  initializeContactSchema,
  migrateContactSchema,
} from "../server/contact/schema.ts";
const legacy = `CREATE TABLE consultations(id TEXT PRIMARY KEY,nameOrAlias TEXT NOT NULL,email TEXT NOT NULL,message TEXT NOT NULL,receivedAt TEXT NOT NULL,lastActivityAt TEXT NOT NULL,status TEXT NOT NULL CHECK(status='Pendiente')); CREATE TABLE attempts(tokenDigest TEXT PRIMARY KEY,attemptId TEXT NOT NULL,expiresAt INTEGER NOT NULL,state TEXT NOT NULL CHECK(state IN ('COMMITTED','REJECTED','REVOKED')),consultationId TEXT UNIQUE REFERENCES consultations(id) ON DELETE RESTRICT,CHECK((state='COMMITTED' AND consultationId IS NOT NULL) OR (state!='COMMITTED' AND consultationId IS NULL)));`;
test("migration preserves legacy identity, dates and receipt; is repeatable", () => {
  const db = new DatabaseSync(":memory:");
  try {
    db.exec("PRAGMA foreign_keys=ON;" + legacy);
    db.prepare("INSERT INTO consultations VALUES(?,?,?,?,?,?,?)").run(
      "original",
      "Alias",
      "synthetic@example.com",
      "consulta",
      "2026-01-01",
      "2026-01-01",
      "Pendiente",
    );
    db.prepare("INSERT INTO attempts VALUES(?,?,?,?,?)").run(
      "digest",
      "attempt",
      99,
      "COMMITTED",
      "original",
    );
    migrateContactSchema(db);
    migrateContactSchema(db);
    const row = db.prepare("SELECT * FROM consultations").get()!;
    assert.equal(row.id, "original");
    assert.equal(row.revision, 1);
    assert.equal(row.lifecycle, "active");
    assert.equal(row.receivedAt, "2026-01-01");
    db.exec("UPDATE consultations SET status='Respondido'");
    assert.equal(
      db.prepare("SELECT consultationId FROM attempts").get()!.consultationId,
      "original",
    );
    assert.equal(db.prepare("PRAGMA foreign_key_check").all().length, 0);
  } finally {
    db.close();
  }
});
test("runtime refuses online legacy migration and unknown schema", () => {
  const db = new DatabaseSync(":memory:");
  try {
    db.exec(legacy);
    assert.throws(() => initializeContactSchema(db));
    db.exec("PRAGMA user_version=999");
    assert.throws(() => migrateContactSchema(db));
  } finally {
    db.close();
  }
});
test("new schema enforces state, revision and unique unresolved operation", () => {
  const db = new DatabaseSync(":memory:");
  try {
    initializeContactSchema(db);
    assert.throws(() =>
      db.exec(
        "INSERT INTO consultations(id,nameOrAlias,email,message,receivedAt,lastActivityAt,status,revision) VALUES('a','a','a','a','a','a','Pendiente',0)",
      ),
    );
    assert.equal(db.prepare("PRAGMA user_version").get()!.user_version, 8);
  } finally {
    db.close();
  }
});
import {
  mkdtempSync,
  chmodSync,
  writeFileSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
test("offline CLI creates private consistent backup and leaves contact signing key unchanged", () => {
  const directory = mkdtempSync(join(tmpdir(), "priva-migration-"));
  try {
    const path = join(directory, "contact.sqlite"),
      backupPath = join(directory, "before.sqlite"),
      keyPath = join(directory, "contact.key"),
      key = randomBytes(32);
    writeFileSync(keyPath, key, { mode: 0o600 });
    const original = new DatabaseSync(path);
    original.exec(legacy);
    original.exec(
      "INSERT INTO consultations VALUES('preserved','alias','synthetic@example.com','message','2026-10-01','2026-10-01','Pendiente')",
    );
    original.close();
    chmodSync(path, 0o600);
    const run = spawnSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "scripts/migrate-contact-inbox.ts",
        path,
        backupPath,
        "--writers-stopped",
      ],
      { encoding: "utf8" },
    );
    assert.equal(run.status, 0, run.stderr);
    assert.equal(statSync(backupPath).mode & 0o077, 0);
    assert.deepEqual(readFileSync(keyPath), key);
    const current = new DatabaseSync(path),
      before = new DatabaseSync(backupPath, { readOnly: true });
    try {
      assert.equal(
        current.prepare("PRAGMA user_version").get()!.user_version,
        8,
      );
      assert.equal(
        before.prepare("PRAGMA user_version").get()!.user_version,
        0,
      );
      assert.equal(
        current.prepare("SELECT id FROM consultations").get()!.id,
        "preserved",
      );
      assert.equal(
        before.prepare("SELECT id FROM consultations").get()!.id,
        "preserved",
      );
    } finally {
      current.close();
      before.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
