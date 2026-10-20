import { durableWrite } from "./backups.ts";
import { cleanupPrivacy } from "./cleanup.ts";
import { ErasureCoordinator } from "./erasure.ts";
import { health, safeEvent, type PrivacyEvent } from "./observability.ts";
export class PrivacyWorker {
  busy = false;
  heartbeatPath?: string;
  lastSuccessAt = 0;
  coordinator: ErasureCoordinator;
  log: (e: PrivacyEvent) => void;
  constructor(
    c: ErasureCoordinator,
    log: (e: PrivacyEvent) => void = () => {},
    heartbeatPath?: string,
  ) {
    this.coordinator = c;
    this.log = log;
    this.heartbeatPath = heartbeatPath;
  }
  async tick() {
    if (this.busy) return false;
    this.busy = true;
    const start = Date.now(),
      r = this.coordinator.repository;
    try {
      const cleanupDirty = r.tx(() => cleanupPrivacy(r.db, r.clock()));
      r.queueExpired();
      for (let i = 0; i < 100; i++) {
        const eligible = r.db
          .prepare(
            "SELECT 1 FROM erasure_jobs WHERE state IN('intent','replicated') AND nextAttemptAt<=? AND (leaseUntil IS NULL OR leaseUntil<=?)",
          )
          .get(r.clock(), r.clock());
        if (!eligible) break;
        await this.coordinator.tick(true);
      }
      const cleaned = await this.coordinator.finishPending();
      if (cleanupDirty && !cleaned)
        await this.coordinator.bounded(this.coordinator.maintenance.clean());
      const oldest = r.db
        .prepare(
          "SELECT min(dueAt) n FROM erasure_jobs WHERE state!='completed'",
        )
        .get()!.n;
      const failed = r.db
        .prepare(
          "SELECT count(*) n FROM erasure_jobs WHERE state!='completed' AND failureCode IS NOT NULL",
        )
        .get()!.n;
      this.lastSuccessAt = Number(failed) ? this.lastSuccessAt : r.clock();
      this.log(
        safeEvent(
          oldest !== null && Number(oldest) < r.clock()
            ? "overdue"
            : Number(failed)
              ? "failed"
              : "ok",
          Date.now() - start,
        ),
      );
      const state = health(
        this.lastSuccessAt,
        oldest === null ? null : Number(oldest),
        r.clock(),
      );
      if (this.heartbeatPath) durableWrite(this.heartbeatPath, state);
      return state;
    } finally {
      this.busy = false;
    }
  }
  start() {
    let work: Promise<unknown> | undefined;
    const timer = setInterval(() => {
      if (!work)
        work = this.tick()
          .catch(() => this.log(safeEvent("failed", 0)))
          .finally(() => {
            work = undefined;
          });
    }, 60000);
    return async () => {
      clearInterval(timer);
      await work;
    };
  }
}
