import { DatabaseSync, backup } from "node:sqlite";
import { isAbsolute, dirname, resolve } from "node:path";
import { lstatSync, existsSync, chmodSync, realpathSync } from "node:fs";
import { migrateContactSchema } from "../server/contact/schema.ts";
// Operator CLI requires a declared maintenance window; it never stops someone else's processes.
const [path, backupPath, flag] = process.argv.slice(2);
if (
  !path ||
  !backupPath ||
  flag !== "--writers-stopped" ||
  !isAbsolute(path) ||
  !isAbsolute(backupPath) ||
  resolve(path) !== path ||
  resolve(backupPath) !== backupPath ||
  path === backupPath ||
  existsSync(backupPath)
)
  throw Error(
    "Usage: migrate-contact-inbox.ts ABS_DATABASE ABS_NEW_BACKUP --writers-stopped",
  );
for (const f of [path, dirname(path), dirname(backupPath)]) {
  const st = lstatSync(f);
  if (st.isSymbolicLink() || realpathSync(f) !== f || st.mode & 0o077)
    throw Error("Unsafe migration path");
}
const mask = process.umask(0o077),
  db = new DatabaseSync(path);
try {
  db.exec(
    "PRAGMA foreign_keys=ON;PRAGMA busy_timeout=5000;PRAGMA synchronous=FULL",
  );
  await backup(db, backupPath);
  chmodSync(backupPath, 0o600);
  migrateContactSchema(db);
  console.info("contact_migration_verified");
} finally {
  db.close();
  process.umask(mask);
}
