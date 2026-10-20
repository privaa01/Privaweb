import { randomUUID } from "node:crypto";
import { PrivacyService } from "./service.ts";
import {
  assertConfirmationAdapter,
  type ConfirmationMailAdapter,
  type MailResult,
  type ConfirmationPayload,
} from "./mail-adapter.ts";
import type { Row } from "./repository.ts";
export class PrivacyMailWorker {
  service: PrivacyService;
  adapter: ConfirmationMailAdapter;
  busy = false;
  timeout: number;
  constructor(
    service: PrivacyService,
    adapter: ConfirmationMailAdapter,
    timeout = 10000,
  ) {
    assertConfirmationAdapter(adapter);
    this.service = service;
    this.adapter = adapter;
    this.timeout = timeout;
  }
  async tick() {
    if (this.busy) return false;
    this.busy = true;
    const r = this.service.repository;
    try {
      this.service.cleanup();
      const job: Row | undefined = r.admin.transaction(() =>
        r.tx(() => {
          const now = r.clock();
          r.db
            .prepare(
              "UPDATE privacy_mail_operations SET state='unknown',leaseUntil=NULL WHERE state='dispatching' AND leaseUntil<=?",
            )
            .run(now);
          const j = r.db
            .prepare(
              "SELECT m.*,q.expiresAt,q.actorAccountId FROM privacy_mail_operations m JOIN privacy_requests q ON q.requestId=m.operationId WHERE m.state IN('queued','unknown') AND q.state IN('awaiting_send','awaiting_confirmation') AND q.expiresAt>? AND m.nextLookupAt<=? AND (m.leaseUntil IS NULL OR m.leaseUntil<=?) ORDER BY m.createdAt LIMIT 1",
            )
            .get(now, now, now) as Row | undefined;
          if (!j) return;
          if (j.state === "queued") {
            const auth = r.admin.sessionByDigest(j.sessionDigest);
            if (!auth || auth.account.id !== j.actorAccountId) {
              this.service.terminate(j.operationId, "canceled", now);
              return;
            }
          }
          const owner = randomUUID();
          r.db
            .prepare(
              "UPDATE privacy_mail_operations SET state=?,leaseOwner=?,leaseGeneration=leaseGeneration+1,leaseUntil=? WHERE operationId=?",
            )
            .run(
              j.state === "queued" ? "dispatching" : "unknown",
              owner,
              now + 30000,
              j.operationId,
            );
          return {
            ...j,
            leaseOwner: owner,
            leaseGeneration: j.leaseGeneration + 1,
            kind: j.state === "queued" ? "send" : "lookup",
          };
        }),
      );
      if (!job) return false;
      let result: MailResult = { state: "unknown" },
        timer: ReturnType<typeof setTimeout> | undefined;
      const abort = new AbortController();
      try {
        const request =
          job.kind === "send"
            ? this.adapter.send(
                {
                  ...this.service.crypto.open<ConfirmationPayload>(
                    "privacy009:" + job.operationId,
                    job.payloadEncrypted,
                  ),
                  deliveryId: job.deliveryId,
                  payloadDigest: job.payloadDigest,
                },
                abort.signal,
              )
            : this.adapter.lookup({ deliveryId: job.deliveryId }, abort.signal);
        result = await Promise.race([
          request,
          new Promise<MailResult>((resolve) => {
            timer = setTimeout(() => {
              abort.abort();
              resolve({ state: "unknown" });
            }, this.timeout);
          }),
        ]);
        if (
          !result ||
          !["accepted", "rejected", "unknown"].includes(result.state)
        )
          result = { state: "unknown" };
        if (
          result.state !== "unknown" &&
          (Buffer.byteLength(JSON.stringify(result)) > 16384 ||
            !this.adapter.verify(result, {
              deliveryId: job.deliveryId,
              payloadDigest: job.payloadDigest,
            }) ||
            (result.state === "accepted" &&
              (!Number.isSafeInteger(result.acceptedAt) ||
                result.acceptedAt < job.createdAt ||
                result.acceptedAt > r.clock() + 300000 ||
                !result.providerReference)) ||
            (result.state === "rejected" &&
              (!result.terminal || !result.noFutureAcceptance)))
        )
          result = { state: "unknown" };
      } catch {
        result = { state: "unknown" };
      } finally {
        clearTimeout(timer);
      }
      const settled = result;
      r.tx(() => {
        const current = r.db
          .prepare(
            "SELECT m.*,q.expiresAt,q.state qstate FROM privacy_mail_operations m JOIN privacy_requests q ON q.requestId=m.operationId WHERE operationId=?",
          )
          .get(job.operationId) as Row | undefined;
        if (
          !current ||
          current.leaseOwner !== job.leaseOwner ||
          current.leaseGeneration !== job.leaseGeneration ||
          !["dispatching", "unknown"].includes(current.state)
        )
          return;
        if (current.expiresAt <= r.clock()) {
          this.service.terminate(job.operationId, "expired", r.clock());
          return;
        }
        if (settled.state === "accepted") {
          r.db
            .prepare(
              "UPDATE privacy_mail_operations SET state='accepted',acceptedAt=?,proofEncrypted=?,leaseUntil=NULL WHERE operationId=?",
            )
            .run(
              settled.acceptedAt,
              this.service.crypto.seal(
                "privacy009:" + job.operationId,
                settled,
              ),
              job.operationId,
            );
          r.db
            .prepare(
              "UPDATE privacy_requests SET state='awaiting_confirmation' WHERE requestId=? AND state='awaiting_send'",
            )
            .run(job.operationId);
        } else if (settled.state === "rejected") {
          this.service.terminate(job.operationId, "canceled", r.clock());
          r.db
            .prepare(
              "UPDATE privacy_mail_operations SET state='rejected' WHERE operationId=?",
            )
            .run(job.operationId);
        } else
          r.db
            .prepare(
              "UPDATE privacy_mail_operations SET state='unknown',leaseUntil=NULL,nextLookupAt=?,lookupAttempts=lookupAttempts+1 WHERE operationId=?",
            )
            .run(
              r.clock() +
                [2000, 5000, 15000, 30000, 60000][
                  Math.min(current.lookupAttempts, 4)
                ],
              job.operationId,
            );
      });
      return true;
    } finally {
      this.busy = false;
    }
  }
}
