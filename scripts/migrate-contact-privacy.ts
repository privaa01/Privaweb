import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  privatePath,
  secureConnection,
  checkpoint,
} from "../server/privacy/storage.ts";
import { migratePrivacy } from "../server/privacy/schema.ts";
import { createBackup } from "../server/privacy/backups.ts";
import {
  exclusiveCli,
  operatorConfig,
} from "../server/privacy/operator-cli.ts";
import { operatorModule } from "../server/privacy/runtime.ts";
const [path, backupPath, configPath, flag] = process.argv.slice(2);
if (flag !== "--writers-stopped")
  throw Error(
    "Usage: migrate-contact-privacy.ts ABS_DATABASE ABS_NEW_BACKUP ABS_CONFIG --writers-stopped",
  );
privatePath(path);
privatePath(backupPath, true);
const cfg = operatorConfig(configPath),
  lock = path + ".maintenance.lock";
if (
  exclusiveCli(lock, fileURLToPath(import.meta.url), [
    path,
    backupPath,
    configPath,
    flag,
  ])
) {
  const m = await operatorModule(cfg.module);
  const operations = await m.privacyOperations(cfg);
  const db = new DatabaseSync(path);
  try {
    secureConnection(db);
    const head = await operations.journal.currentHead();
    privatePath(cfg.manifestKey);
    const key = Buffer.from(readFileSync(cfg.manifestKey));
    if (key.length !== 32) throw Error("Manifest key required");
    if (!Number.isSafeInteger(cfg.restoreUntil))
      throw Error("Verified backup horizon required");
    await createBackup(
      db,
      backupPath,
      head,
      key,
      Date.now(),
      cfg.restoreUntil,
      cfg.keyVersions,
    );
    migratePrivacy(db);
    db.exec("VACUUM");
    checkpoint(db, path);
    db.prepare("INSERT INTO privacy_backup_manifests VALUES(?,?)").run(
      backupPath,
      readFileSync(backupPath + ".manifest", "utf8"),
    );
    console.info("privacy_migration_verified_recovery_still_required");
  } finally {
    db.close();
    await operations.close?.();
  }
}
