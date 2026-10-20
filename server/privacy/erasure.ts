import { randomUUID } from "node:crypto";
import { PrivacyRepository, type Row } from "./repository.ts";
import type { DeletionJournal } from "./deletion-journal.ts";
import { validateCapture, type CopiesAdapter } from "./copies.ts";
import { eraseRows } from "./schema.ts";
import type { Maintenance } from "./maintenance.ts";
export type ErasureRepository = Pick<
  PrivacyRepository,
  "db" | "clock" | "tx" | "queueExpired"
>;
export class ErasureCoordinator {
  repository: ErasureRepository;
  journal: DeletionJournal;
  copies: CopiesAdapter;
  maintenance: Maintenance;
  failure?: (stage: string) => void;
  timeout = 10000;
  async bounded<T>(operation: Promise<T>): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        operation,
        new Promise<T>((_resolve, reject) => {
          timer = setTimeout(
            () => reject(Error("Privacy adapter timeout")),
            this.timeout,
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  }

  constructor(
    repository: ErasureRepository,
    journal: DeletionJournal,
    copies: CopiesAdapter,
    maintenance: Maintenance,
  ) {
    this.repository = repository;
    this.journal = journal;
    this.copies = copies;
    this.maintenance = maintenance;
  }
  async tick(deferPhysical = false) {
    const r = this.repository,
      now = r.clock();
    const job: Row | undefined = r.tx(() => {
      const j = r.db
        .prepare(
          "SELECT * FROM erasure_jobs WHERE state!='completed' AND nextAttemptAt<=? AND (leaseUntil IS NULL OR leaseUntil<=?) AND (?=0 OR state IN('intent','replicated')) ORDER BY dueAt LIMIT 1",
        )
        .get(now, now, deferPhysical ? 1 : 0) as Row | undefined;
      if (!j) return;
      const owner = randomUUID();
      r.db
        .prepare(
          "UPDATE erasure_jobs SET leaseOwner=?,leaseGeneration=leaseGeneration+1,leaseUntil=?,overdueAt=CASE WHEN dueAt<? THEN coalesce(overdueAt,?) ELSE overdueAt END WHERE jobId=?",
        )
        .run(owner, now + 60000, now, now, j.jobId);
      return {
        ...j,
        leaseOwner: owner,
        leaseGeneration: j.leaseGeneration + 1,
      };
    });
    if (!job) return false;
    const fence = () => {
      const j = r.db
        .prepare(
          "SELECT * FROM erasure_jobs WHERE jobId=? AND leaseOwner=? AND leaseGeneration=?",
        )
        .get(job.jobId, job.leaseOwner, job.leaseGeneration) as Row | undefined;
      if (!j || j.leaseUntil < r.clock()) throw Error("Stale erasure lease");
      return j;
    };
    try {
      let j = fence();
      if (j.state === "intent") {
        const receipt = await this.bounded(
          this.journal.append({
            jobId: j.jobId,
            consultationId: j.consultationId,
            intendedAt: j.intentAt,
            reason: j.reason,
          }),
        );
        const head = await this.bounded(this.journal.currentHead());
        const entries = await this.bounded(
          this.journal.readRange(1, head.sequence),
        );
        if (
          !this.journal.verify(entries, head) ||
          !entries.some(
            (e) => e.signature === receipt.signature && e.jobId === j.jobId,
          )
        )
          throw Error("Unverified journal receipt");
        this.failure?.("afterReplica");
        const refs = r.db
          .prepare(
            "SELECT deliveryId FROM reply_operations WHERE consultationId=?",
          )
          .all(j.consultationId)
          .map((o) => ({
            deliveryId: String(o.deliveryId),
            namespace: "reply008" as const,
          }));
        const mailRefs = r.db
          .prepare(
            "SELECT m.deliveryId FROM privacy_mail_operations m JOIN privacy_request_targets t ON t.requestId=m.operationId WHERE t.consultationId=?",
          )
          .all(j.consultationId)
          .map((o) => ({
            deliveryId: String(o.deliveryId),
            namespace: "confirmation009" as const,
          }));
        const capture = await this.bounded(
          this.copies.capture(j.jobId, [...refs, ...mailRefs]),
        );
        validateCapture(this.copies, capture, j.jobId);
        this.failure?.("afterCapture");
        r.tx(() => {
          fence();
          r.db
            .prepare(
              "UPDATE erasure_jobs SET state='replicated',journalSequence=?,replicaReceipt=?,captureReceipt=? WHERE jobId=?",
            )
            .run(
              receipt.sequence,
              JSON.stringify(receipt),
              JSON.stringify(capture),
              j.jobId,
            );
        });
        j = fence();
      }
      if (j.state === "replicated") {
        r.tx(() => {
          fence();
          eraseRows(r.db, j.consultationId, r.clock());
          r.db
            .prepare(
              "UPDATE erasure_jobs SET state='logical_deleted',logicalDeletedAt=? WHERE jobId=?",
            )
            .run(r.clock(), j.jobId);
        });
        this.failure?.("afterDelete");
        j = fence();
      }
      if (deferPhysical && j.state === "logical_deleted") {
        r.tx(() => {
          fence();
          r.db
            .prepare("UPDATE erasure_jobs SET leaseUntil=NULL WHERE jobId=?")
            .run(j.jobId);
        });
        return true;
      }
      if (j.state === "logical_deleted") {
        await this.maintenance.clean();
        this.failure?.("afterPhysical");
        r.tx(() => {
          fence();
          r.db
            .prepare(
              "UPDATE erasure_jobs SET state='physical_verified',physicalVerifiedAt=? WHERE jobId=?",
            )
            .run(r.clock(), j.jobId);
        });
        j = fence();
      }
      if (j.state === "physical_verified")
        r.tx(() => {
          fence();
          r.db
            .prepare(
              "UPDATE erasure_jobs SET state='completed',failureCode=NULL,leaseUntil=NULL WHERE jobId=?",
            )
            .run(j.jobId);
        });
      return true;
    } catch {
      try {
        r.tx(() => {
          const current = fence();
          r.db
            .prepare(
              "UPDATE erasure_jobs SET failureCode=?,attempts=attempts+1,nextAttemptAt=?,leaseUntil=NULL WHERE jobId=?",
            )
            .run(
              "maintenance_failed",
              r.clock() + [5000, 30000, 60000][Math.min(current.attempts, 2)],
              job.jobId,
            );
        });
      } catch {
        /* stale worker cannot mutate current generation */
      }
      return false;
    }
  }
  async finishPending() {
    const r = this.repository,
      now = r.clock(),
      owner = randomUUID();
    const jobs = r.tx(() => {
      const found = r.db
        .prepare(
          "SELECT * FROM erasure_jobs WHERE state IN('logical_deleted','physical_verified') AND nextAttemptAt<=? AND (leaseUntil IS NULL OR leaseUntil<=?) ORDER BY dueAt LIMIT 100",
        )
        .all(now, now) as Row[];
      for (const j of found)
        r.db
          .prepare(
            "UPDATE erasure_jobs SET leaseOwner=?,leaseGeneration=leaseGeneration+1,leaseUntil=? WHERE jobId=?",
          )
          .run(owner, now + 60000, j.jobId);
      return found.map(
        (j) =>
          ({
            ...j,
            leaseOwner: owner,
            leaseGeneration: j.leaseGeneration + 1,
          }) as Row,
      );
    });
    if (!jobs.length) return false;
    try {
      await this.maintenance.clean();
      r.tx(() => {
        for (const j of jobs)
          r.db
            .prepare(
              "UPDATE erasure_jobs SET state='completed',physicalVerifiedAt=?,failureCode=NULL,leaseUntil=NULL,overdueAt=CASE WHEN dueAt<? THEN coalesce(overdueAt,?) ELSE overdueAt END WHERE jobId=? AND leaseOwner=? AND leaseGeneration=? AND leaseUntil>=?",
            )
            .run(
              r.clock(),
              r.clock(),
              r.clock(),
              j.jobId,
              owner,
              j.leaseGeneration,
              r.clock(),
            );
      });
      return true;
    } catch {
      r.tx(() => {
        for (const j of jobs)
          r.db
            .prepare(
              "UPDATE erasure_jobs SET failureCode='maintenance_failed',attempts=attempts+1,nextAttemptAt=?,leaseUntil=NULL WHERE jobId=? AND leaseOwner=? AND leaseGeneration=?",
            )
            .run(r.clock() + 5000, j.jobId, owner, j.leaseGeneration);
      });
      return false;
    }
  }
}
