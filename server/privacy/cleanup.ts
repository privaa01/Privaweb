import type { DatabaseSync } from "node:sqlite";
/** Called by independent retention worker as well as mail worker; never requires a live provider. */
export function cleanupPrivacy(db: DatabaseSync, now: number) {
  const before = Number(db.prepare("SELECT total_changes() n").get()!.n);
  db.prepare(
    "UPDATE privacy_requests SET state='expired',challengeDigest=NULL,terminalAt=? WHERE expiresAt<=? AND state IN('awaiting_send','awaiting_confirmation')",
  ).run(now, now);
  db.prepare(
    "UPDATE privacy_mail_operations SET payloadEncrypted=NULL,proofEncrypted=NULL,leaseUntil=NULL,state=CASE WHEN state='accepted' THEN state ELSE 'canceled' END WHERE (payloadEncrypted IS NOT NULL OR proofEncrypted IS NOT NULL) AND operationId IN(SELECT requestId FROM privacy_requests WHERE state IN('expired','locked','canceled','confirmed','completed'))",
  ).run();
  db.prepare(
    "UPDATE privacy_requests SET state='completed',terminalAt=?,challengeDigest=NULL WHERE state='confirmed' AND NOT EXISTS(SELECT 1 FROM privacy_request_targets t WHERE t.requestId=privacy_requests.requestId)",
  ).run(now);
  db.prepare(
    "DELETE FROM privacy_requests WHERE terminalAt<=? AND state IN('expired','locked','canceled','completed')",
  ).run(now - 86400000);
  db.prepare("DELETE FROM privacy_abuse WHERE windowEnd<=?").run(now);
  return Number(db.prepare("SELECT total_changes() n").get()!.n) !== before;
}
