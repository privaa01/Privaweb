import type { SqliteAdminRepository } from "./sqlite-repository.ts";
import type { MailAdapter, RecoveryJob } from "./repository.ts";
import { decryptEnvelope } from "./recovery.ts";
export class MailWorker {
  r: SqliteAdminRepository;
  keys: Map<string, Buffer>;
  adapter: MailAdapter;
  currentKeyVersion: string;
  constructor(
    r: SqliteAdminRepository,
    keys: Map<string, Buffer>,
    adapter: MailAdapter,
    currentKeyVersion = "v1",
  ) {
    this.r = r;
    this.keys = keys;
    this.adapter = adapter;
    this.currentKeyVersion = currentKeyVersion;
  }
  retireUnusedKeys() {
    const needed = new Set<string>([this.currentKeyVersion]);
    for (const row of this.r.db
      .prepare(
        "SELECT envelope FROM admin_jobs WHERE expiresAt>? AND state IN('queued','leased') AND envelope IS NOT NULL",
      )
      .all(this.r.clock())) {
      try {
        needed.add(JSON.parse(row.envelope as string).keyVersion);
      } catch {
        /* malformed envelopes cannot retain keys */
      }
    }
    for (const version of this.keys.keys())
      if (!needed.has(version)) this.keys.delete(version);
  }
  async tick() {
    const job = this.r.transaction(() => {
      const n = this.r.clock();
      this.r.db.prepare("DELETE FROM admin_jobs WHERE kind='noop'").run();
      this.r.db
        .prepare(
          "UPDATE admin_jobs SET state='expired',envelope=NULL,leaseUntil=NULL WHERE expiresAt<=? AND state IN('queued','leased')",
        )
        .run(n);
      this.r.db
        .prepare(
          "UPDATE admin_jobs SET state='failed',envelope=NULL,leaseUntil=NULL WHERE state='leased' AND leaseUntil<=? AND attempts>=3",
        )
        .run(n);
      const row = this.r.db
        .prepare(
          "SELECT * FROM admin_jobs WHERE kind='real' AND envelope IS NOT NULL AND expiresAt>? AND attempts<3 AND nextAttemptAt<=? AND (state='queued' OR (state='leased' AND leaseUntil<=?)) ORDER BY createdAt LIMIT 1",
        )
        .get(n, n, n) as unknown as RecoveryJob | undefined;
      if (!row) return null;
      // An expired lease might mean the prior process sent mail before crashing. Never blindly resend without provider idempotency.
      if (row.state === "leased" && !this.adapter.idempotent) {
        this.r.db
          .prepare(
            "UPDATE admin_jobs SET state='failed',envelope=NULL,leaseUntil=NULL WHERE id=?",
          )
          .run(row.id);
        return null;
      }
      const a = row.accountId ? this.r.accountById(row.accountId) : null;
      if (!a?.authorized || a.credentialVersion !== row.credentialVersion) {
        this.r.db
          .prepare(
            "UPDATE admin_jobs SET state='expired',envelope=NULL,leaseUntil=NULL WHERE id=?",
          )
          .run(row.id);
        return null;
      }
      this.r.db
        .prepare(
          "UPDATE admin_jobs SET state='leased',leaseUntil=?,attempts=attempts+1 WHERE id=?",
        )
        .run(n + 60000, row.id);
      return { ...row, attempts: row.attempts + 1 };
    });
    this.retireUnusedKeys();
    if (!job) return false;
    let outcome: "accepted" | "rejected" | "unknown" = "unknown";
    const abort = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const payload = decryptEnvelope(
        this.keys,
        `${job.id}:${job.accountId}:${job.credentialVersion}`,
        job.envelope!,
      );
      const timeout = new Promise<"unknown">((res) => {
        timer = setTimeout(() => {
          abort.abort();
          res("unknown");
        }, 10000);
      });
      outcome = await Promise.race([
        this.adapter.send(
          { deliveryId: job.deliveryId!, ...payload },
          abort.signal,
        ),
        timeout,
      ]);
    } catch {
      outcome = "unknown";
    } finally {
      clearTimeout(timer);
    }
    this.r.transaction(() => {
      const current = this.r.job(job.id);
      if (
        !current ||
        current.state !== "leased" ||
        current.attempts !== job.attempts
      )
        return;
      const n = this.r.clock();
      if (n >= current.expiresAt) {
        this.r.db
          .prepare(
            "UPDATE admin_jobs SET state='expired',envelope=NULL,leaseUntil=NULL WHERE id=?",
          )
          .run(job.id);
        return;
      }
      const terminal =
        outcome === "accepted" ||
        job.attempts >= 3 ||
        (outcome === "unknown" && !this.adapter.idempotent);
      if (terminal)
        this.r.db
          .prepare(
            "UPDATE admin_jobs SET state=?,envelope=NULL,leaseUntil=NULL WHERE id=?",
          )
          .run(outcome === "accepted" ? "accepted" : "failed", job.id);
      else
        this.r.db
          .prepare(
            "UPDATE admin_jobs SET state='queued',leaseUntil=NULL,nextAttemptAt=? WHERE id=?",
          )
          .run(n + (job.attempts === 1 ? 30000 : 120000), job.id);
    });
    return true;
  }
}
