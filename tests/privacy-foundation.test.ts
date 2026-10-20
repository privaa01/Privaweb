import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { randomUUID, randomBytes } from "node:crypto";
import { join } from "node:path";
import {
  mkdtempSync,
  rmSync,
  writeFileSync,
  symlinkSync,
  chmodSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { privacyFixture, receive } from "./helpers/privacy-fixtures.ts";
import { migratePrivacy } from "../server/privacy/schema.ts";
import { FileJournal } from "../server/privacy/deletion-journal.ts";
import { createBackup, verifyBackup } from "../server/privacy/backups.ts";
import { privatePath } from "../server/privacy/storage.ts";
test("schema9 idempotent and all existing writers use secure_delete, original tuple retained", async () => {
  const f = await privacyFixture();
  try {
    const x = receive(f);
    const before = f.p.db.prepare("SELECT * FROM consultations").get();
    migratePrivacy(f.p.db);
    assert.deepEqual(
      f.p.db.prepare("SELECT * FROM consultations").get(),
      before,
    );
    for (const db of [f.p.db, f.repo.db, f.contact.db])
      assert.equal(db.prepare("PRAGMA secure_delete").get()!.secure_delete, 1);
    assert.equal(f.contact.submit(x.attempt, x.data).result, "stored");
    assert.equal(f.p.db.prepare("PRAGMA foreign_key_check").all().length, 0);
  } finally {
    f.cleanup();
  }
});
test("journal append idempotent, conflict/fork/tamper rejected", async () => {
  const f = await privacyFixture();
  try {
    const entry = {
      jobId: randomUUID(),
      consultationId: randomUUID(),
      intendedAt: f.time(),
      reason: "expiry",
    };
    const first = await f.journal.append(entry);
    assert.deepEqual(await f.journal.append(entry), first);
    await assert.rejects(() =>
      f.journal.append({ ...entry, consultationId: randomUUID() }),
    );
    const head = await f.journal.currentHead();
    assert(f.journal.verify([first], head));
    assert(!f.journal.verify([{ ...first, reason: "request" }], head));
    assert(!f.journal.verify([], head));
    f.journal.db
      .prepare("UPDATE entries SET value=?")
      .run(JSON.stringify({ ...first, reason: "request" }));
    await assert.rejects(() => f.journal.currentHead());
  } finally {
    f.cleanup();
  }
});
test("coherent backup gets authenticated manifest and changed bytes are refused", async () => {
  const f = await privacyFixture();
  try {
    receive(f);
    const path = join(f.replicaDir, "backup.sqlite"),
      head = await f.journal.currentHead();
    const m = await createBackup(
      f.p.db,
      path,
      head,
      f.key,
      f.time(),
      f.time() + 86400000,
    );
    verifyBackup(path, m, f.key, f.time());
    assert.throws(() =>
      verifyBackup(
        path,
        { ...m, restoreUntil: m.restoreUntil + 1 },
        f.key,
        f.time(),
      ),
    );
    const db = new DatabaseSync(path);
    db.prepare("UPDATE consultations SET message='changed bytes'").run();
    db.close();
    assert.throws(() => verifyBackup(path, m, f.key, f.time()));
  } finally {
    f.cleanup();
  }
});
test("private paths reject symlinks, public roots and loose permissions", () => {
  const dir = mkdtempSync(join(tmpdir(), "priva009-path-"));
  try {
    const a = join(dir, "a");
    writeFileSync(a, "x", { mode: 0o644 });
    chmodSync(a, 0o644);
    assert.throws(() => privatePath(a));
    symlinkSync(a, join(dir, "b"));
    assert.throws(() => privatePath(join(dir, "b")));
    assert.throws(() =>
      privatePath("/workspace/Privaweb/public/private.db", true),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
