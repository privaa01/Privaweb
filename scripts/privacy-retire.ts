import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  exclusiveCli,
  operatorConfig,
} from "../server/privacy/operator-cli.ts";
import { operatorModule } from "../server/privacy/runtime.ts";
import {
  privatePath,
  secureConnection,
  checkpoint,
} from "../server/privacy/storage.ts";
import { assertRecovery, recordRecovery } from "../server/privacy/restore.ts";
const [path, configPath, proofPath, sequenceText] = process.argv.slice(2),
  sequence = Number(sequenceText);
if (!Number.isSafeInteger(sequence) || sequence < 1)
  throw Error(
    "Usage: privacy-retire.ts ABS_DATABASE ABS_CONFIG ABS_SIGNED_PROOF THROUGH_SEQUENCE",
  );
privatePath(path);
privatePath(proofPath);
const config = operatorConfig(configPath),
  lock = path + ".maintenance.lock";
if (
  exclusiveCli(lock, fileURLToPath(import.meta.url), [
    path,
    configPath,
    proofPath,
    sequenceText,
  ])
) {
  const m = await operatorModule(config.module),
    ops = await m.privacyOperations(config),
    db = new DatabaseSync(path);
  try {
    secureConnection(db);
    await assertRecovery(db, ops.journal);
    if (db.prepare("SELECT 1 FROM erasure_jobs WHERE state!='completed'").get())
      throw Error("Erasure still pending");
    if (typeof ops.journal.retire !== "function")
      throw Error("Replica retirement unsupported");
    await ops.journal.retire(
      sequence,
      JSON.parse(readFileSync(proofPath, "utf8")),
      Date.now(),
    );
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare(
        "DELETE FROM erasure_jobs WHERE state='completed' AND journalSequence<=?",
      ).run(sequence);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
    recordRecovery(db, await ops.journal.currentHead(), Date.now());
    checkpoint(db, path);
    console.info("privacy_retirement_verified");
  } finally {
    db.close();
    await ops.close?.();
  }
}
