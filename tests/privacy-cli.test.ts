import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes, randomUUID } from "node:crypto";
import { inboxFixture, receive } from "./fixtures/inbox-service/helpers.ts";
import { FileJournal, sign } from "../server/privacy/deletion-journal.ts";
test("operator migration8→9 and restore CLIs hold real exclusive flock, preserve tuples and suppress old backup", async () => {
  const f = await inboxFixture(Date.now()),
    dir = mkdtempSync(join(tmpdir(), "priva009-cli-"));
  try {
    const x = receive(f),
      database = join(f.dir, "contact.sqlite"),
      backup = join(dir, "before.sqlite"),
      target = join(dir, "restored.sqlite"),
      config = join(dir, "operator.json"),
      keyPath = join(dir, "manifest.key"),
      modulePath = join(dir, "operator.mjs"),
      journalPath = join(dir, "replica.sqlite");
    const key = randomBytes(32);
    writeFileSync(keyPath, key, { mode: 0o600 });
    writeFileSync(
      modulePath,
      `import {readFileSync} from 'node:fs';import {FileJournal} from ${JSON.stringify(resolve("server/privacy/deletion-journal.ts"))};export async function privacyOperations(c){const journal=new FileJournal(c.journal,readFileSync(c.manifestKey));return {journal,copies:{capture:async(jobId,refs)=>({jobId,receipt:'synthetic-only',handles:refs.length}),verify:()=>true,erase:async()=> 'completed',status:async()=> 'completed'},close:()=>journal.close()};}`,
      { mode: 0o600 },
    );
    writeFileSync(
      config,
      JSON.stringify({
        module: modulePath,
        manifestKey: keyPath,
        journal: journalPath,
        restoreUntil: Date.now() + 86400000,
        keyVersions: ["v1"],
      }),
      { mode: 0o600 },
    );
    f.repo.close();
    f.contact.close();
    const run = (script: string, args: string[]) =>
      spawnSync(
        process.execPath,
        ["--experimental-strip-types", resolve(script), ...args],
        { encoding: "utf8", timeout: 30000 },
      );
    const migrated = run("scripts/migrate-contact-privacy.ts", [
      database,
      backup,
      config,
      "--writers-stopped",
    ]);
    assert.equal(migrated.status, 0, migrated.stderr);
    const db = new DatabaseSync(database);
    assert.equal(db.prepare("PRAGMA user_version").get()!.user_version, 9);
    assert.equal(
      db.prepare("SELECT message FROM consultations WHERE id=?").get(x.id)!
        .message,
      x.data.message,
    );
    db.close();
    const journal = new FileJournal(journalPath, key);
    await journal.append({
      jobId: randomUUID(),
      consultationId: x.id,
      intendedAt: Date.now(),
      reason: "request",
    });
    journal.close();
    const verified = run("scripts/privacy-restore.ts", [
      "verify",
      backup,
      target,
      config,
    ]);
    assert.equal(verified.status, 0, verified.stderr);
    const restored = run("scripts/privacy-restore.ts", [
      "apply",
      backup,
      target,
      config,
    ]);
    assert.equal(restored.status, 0, restored.stderr);
    const final = new DatabaseSync(target);
    assert.equal(
      final.prepare("SELECT count(*) n FROM consultations").get()!.n,
      0,
    );
    assert(final.prepare("SELECT * FROM privacy_recovery").get());
    final.close();
    const manifest = JSON.parse(readFileSync(backup + ".manifest", "utf8"));
    const { signature: oldSignature, ...destroyed } = manifest;
    destroyed.destroyedAt = Date.now();
    destroyed.evidenceRef = "synthetic fixture copy destroyed";
    rmSync(backup);
    rmSync(backup + ".manifest");
    const proofBody = {
        complete: true,
        verifiedAt: Date.now(),
        horizon: Date.now(),
        manifests: [{ ...destroyed, signature: sign(key, destroyed) }],
      },
      proofPath = join(dir, "retirement.json");
    writeFileSync(
      proofPath,
      JSON.stringify({ ...proofBody, signature: sign(key, proofBody) }),
      { mode: 0o600 },
    );
    const retired = run("scripts/privacy-retire.ts", [
      target,
      config,
      proofPath,
      "1",
    ]);
    assert.equal(retired.status, 0, retired.stderr);
    const compacted = new FileJournal(journalPath, key);
    assert.equal(compacted.entries().length, 0);
    assert.equal((await compacted.currentHead()).sequence, 1);
    compacted.close();
    const bypass = run("scripts/migrate-contact-privacy.ts", [
      database,
      join(dir, "bypass.sqlite"),
      config,
      "--writers-stopped",
      "--locked",
    ]);
    assert.notEqual(bypass.status, 0);
  } finally {
    f.cleanup();
    rmSync(dir, { recursive: true, force: true });
  }
});
