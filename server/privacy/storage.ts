import { fileURLToPath } from "node:url";
import { lstatSync, realpathSync, existsSync, statSync } from "node:fs";
import { isAbsolute, dirname, relative, resolve } from "node:path";
import type { DatabaseSync } from "node:sqlite";
export function privatePath(path: string, allowMissing = false) {
  if (!isAbsolute(path) || resolve(path) !== path)
    throw Error("Canonical private path required");
  for (const root of [
    fileURLToPath(new URL("../../", import.meta.url)),
    "public",
    "dist",
    ".git",
    ".private-build",
  ]) {
    const rel = relative(resolve(root), path);
    if (rel === "" || (!rel.startsWith("..") && !isAbsolute(rel)))
      throw Error("Private path below served root");
  }
  for (const f of [dirname(path), path, path + "-wal", path + "-shm"]) {
    if (!existsSync(f)) {
      if (
        (allowMissing && f === path) ||
        f.endsWith("-wal") ||
        f.endsWith("-shm")
      )
        continue;
      throw Error("Missing private path");
    }
    const st = lstatSync(f);
    if (
      st.isSymbolicLink() ||
      realpathSync(f) !== f ||
      st.mode & 0o077 ||
      !(f === dirname(path) ? st.isDirectory() : st.isFile())
    )
      throw Error("Unsafe private path");
  }
}
export function secureConnection(db: DatabaseSync) {
  db.exec(
    "PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA secure_delete=ON; PRAGMA temp_store=MEMORY",
  );
  if (Number(db.prepare("PRAGMA secure_delete").get()!.secure_delete) !== 1)
    throw Error("secure_delete required");
}
export function checkpoint(db: DatabaseSync, path: string) {
  const row = db.prepare("PRAGMA wal_checkpoint(TRUNCATE)").get()!;
  if (
    Number(row.busy) !== 0 ||
    (existsSync(path + "-wal") && statSync(path + "-wal").size !== 0)
  )
    throw Error("Privacy checkpoint blocked");
  if (
    db.prepare("PRAGMA integrity_check").get()!.integrity_check !== "ok" ||
    db.prepare("PRAGMA foreign_key_check").all().length
  )
    throw Error("Privacy integrity failure");
}
