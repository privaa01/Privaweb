import type { SqliteAdminRepository } from "../admin/sqlite-repository.ts";
import { PrivacyRepository } from "./repository.ts";
import { PrivacyService } from "./service.ts";
import { PrivacyMailWorker } from "./mail-worker.ts";
import { PrivacyWorker } from "./worker.ts";
import { ErasureCoordinator } from "./erasure.ts";
import { createPrivacyHandler } from "./http.ts";
import { assertRecovery } from "./restore.ts";
import type { DeletionJournal } from "./deletion-journal.ts";
import type { CopiesAdapter } from "./copies.ts";
import type { Maintenance } from "./maintenance.ts";
import type { ConfirmationMailAdapter } from "./mail-adapter.ts";
export async function composePrivacy(o: {
  admin: SqliteAdminRepository;
  database: string;
  challengeKey: Buffer | Map<string, Buffer>;
  mailKey: Buffer | Map<string, Buffer>;
  sender: string;
  origin: string;
  csrfKey: Buffer;
  journal: DeletionJournal;
  copies: CopiesAdapter;
  maintenance: Maintenance;
  adapter: ConfirmationMailAdapter;
  heartbeatPath: string;
}) {
  const repository = new PrivacyRepository(o.admin, o.database);
  try {
    await assertRecovery(repository.db, o.journal);
    repository.queueExpired();
    if (
      repository.db
        .prepare("SELECT 1 FROM erasure_jobs WHERE state!='completed'")
        .get()
    )
      throw Error("Privacy recovery maintenance required before serving");
    const service = new PrivacyService(
        repository,
        o.challengeKey,
        o.mailKey,
        o.sender,
      ),
      mailWorker = new PrivacyMailWorker(service, o.adapter),
      worker = new PrivacyWorker(
        new ErasureCoordinator(repository, o.journal, o.copies, o.maintenance),
      );
    worker.heartbeatPath = o.heartbeatPath;
    return {
      repository,
      service,
      mailWorker,
      worker,
      handler: createPrivacyHandler({
        service,
        origin: o.origin,
        csrfKey: o.csrfKey,
      }),
      close: () => repository.close(),
    };
  } catch (e) {
    repository.close();
    throw e;
  }
}
