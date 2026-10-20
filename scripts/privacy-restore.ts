import { DatabaseSync } from "node:sqlite";
import { readFileSync, existsSync, copyFileSync, chmodSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  privatePath,
  secureConnection,
  checkpoint,
} from "../server/privacy/storage.ts";
import { migratePrivacy } from "../server/privacy/schema.ts";
import { verifyBackup } from "../server/privacy/backups.ts";
import {
  applySuppressions,
  verifiedHead,
  recordRecovery,
  finishOfflineRecovery,
} from "../server/privacy/restore.ts";
import {
  exclusiveCli,
  operatorConfig,
} from "../server/privacy/operator-cli.ts";
import { operatorModule } from "../server/privacy/runtime.ts";
const [action, source, target, configPath] = process.argv.slice(2);
if (!["verify", "apply"].includes(action) || source === target)
  throw Error(
    "Usage: privacy-restore.ts verify|apply ABS_BACKUP ABS_NEW_TARGET ABS_CONFIG",
  );
privatePath(source);
privatePath(target, true);
const cfg = operatorConfig(configPath),
  lock = target + ".maintenance.lock";
if (
  exclusiveCli(lock, fileURLToPath(import.meta.url), [
    action,
    source,
    target,
    configPath,
  ])
) {
  const m = await operatorModule(cfg.module),
    ops = await m.privacyOperations(cfg);
  try {
    privatePath(cfg.manifestKey);
    const key = readFileSync(cfg.manifestKey),
      manifest = JSON.parse(readFileSync(source + ".manifest", "utf8"));
    verifyBackup(source, manifest, key, Date.now());
    await verifiedHead(ops.journal, manifest.snapshotSequence);
    if (action === "apply") {
      if (existsSync(target)) throw Error("Restore requires a new target");
      copyFileSync(source, target, 1);
      chmodSync(target, 0o600);
      const db = new DatabaseSync(target);
      try {
        secureConnection(db);
        migratePrivacy(db);
        const head = await applySuppressions(
          db,
          ops.journal,
          Date.now(),
          manifest.snapshotSequence,
        );
        await finishOfflineRecovery(
          db,
          target,
          ops.journal,
          ops.copies,
          Date.now(),
        );
        checkpoint(db, target);
        recordRecovery(db, head, Date.now());
        checkpoint(db, target);
      } finally {
        db.close();
      }
    }
    console.info(
      action === "apply"
        ? "privacy_restore_verified"
        : "privacy_backup_verified",
    );
  } finally {
    await ops.close?.();
  }
}
