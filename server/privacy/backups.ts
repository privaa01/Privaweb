import { createHash, randomUUID } from "node:crypto";
import {
  readFileSync,
  writeFileSync,
  renameSync,
  openSync,
  closeSync,
  fsyncSync,
  unlinkSync,
  existsSync,
} from "node:fs";
import { dirname } from "node:path";
import { backup, type DatabaseSync } from "node:sqlite";
import { privatePath } from "./storage.ts";
import { sign, signatureEqual, type Head } from "./deletion-journal.ts";
export type Manifest = {
  backupId: string;
  createdAt: number;
  snapshotSequence: number;
  schemaVersion: number;
  keyVersions: string[];
  restoreUntil: number;
  contentDigest: string;
  signature: string;
  destroyedAt: number | null;
  evidenceRef: string | null;
};
export function durableWrite(path: string, value: unknown) {
  privatePath(path, true);
  const temp = path + "." + randomUUID() + ".tmp";
  const fd = openSync(temp, "wx", 0o600);
  try {
    writeFileSync(fd, JSON.stringify(value));
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  renameSync(temp, path);
  const dir = openSync(dirname(path), "r");
  try {
    fsyncSync(dir);
  } finally {
    closeSync(dir);
  }
}
export function hashFile(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}
export function verifyManifest(m: Manifest, key: Buffer, now: number) {
  const { signature, ...body } = m;
  return (
    Number.isSafeInteger(m.createdAt) &&
    Number.isSafeInteger(m.restoreUntil) &&
    m.createdAt <= now &&
    m.restoreUntil > now &&
    m.createdAt < m.restoreUntil &&
    m.destroyedAt === null &&
    m.keyVersions.length > 0 &&
    signatureEqual(signature, sign(key, body))
  );
}
export async function createBackup(
  db: DatabaseSync,
  path: string,
  head: Head,
  key: Buffer,
  now: number,
  restoreUntil: number,
  keyVersions = ["v1"],
) {
  privatePath(path, true);
  if (existsSync(path) || existsSync(path + ".manifest"))
    throw Error("New backup path required");
  if (restoreUntil <= now) throw Error("Backup horizon required");
  // Must be called while writers are stopped under an exclusive maintenance lock.
  const mask = process.umask(0o077);
  try {
    await backup(db, path);
    const { chmodSync } = await import("node:fs");
    chmodSync(path, 0o600);
  } finally {
    process.umask(mask);
  }
  const body = {
    backupId: randomUUID(),
    createdAt: now,
    snapshotSequence: head.sequence,
    schemaVersion: Number(
      db.prepare("PRAGMA user_version").get()!.user_version,
    ),
    keyVersions,
    restoreUntil,
    contentDigest: hashFile(path),
    destroyedAt: null,
    evidenceRef: null,
  };
  const m = { ...body, signature: sign(key, body) };
  durableWrite(path + ".manifest", m);
  return m;
}
export function verifyBackup(
  path: string,
  m: Manifest,
  key: Buffer,
  now: number,
) {
  privatePath(path);
  if (!verifyManifest(m, key, now) || hashFile(path) !== m.contentDigest)
    throw Error("Backup not qualified");
}
/** Safe reclamation requires a complete externally qualified inventory, not just an empty caller list. */
export function canRetireSuppression(
  entriesThrough: number,
  manifests: Manifest[],
  inventory: { complete: boolean; verifiedAt: number; horizon: number },
  now: number,
) {
  return (
    inventory.complete &&
    inventory.verifiedAt <= now &&
    now - inventory.verifiedAt <= 60000 &&
    Number.isSafeInteger(inventory.horizon) &&
    inventory.horizon <= now &&
    manifests.every(
      (m) =>
        m.destroyedAt !== null ||
        m.restoreUntil <= now ||
        m.snapshotSequence >= entriesThrough,
    )
  );
}
