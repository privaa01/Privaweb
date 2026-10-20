import { SqliteContactRepository } from "../../server/contact/sqlite-repository.ts";
import { InboxRepository } from "../../server/inbox/sqlite-repository.ts";
import {
  inboxFixture,
  receive,
  input,
} from "../fixtures/inbox-service/helpers.ts";
import { migratePrivacy } from "../../server/privacy/schema.ts";
import { PrivacyRepository } from "../../server/privacy/repository.ts";
import { FileJournal } from "../../server/privacy/deletion-journal.ts";
import { ControlledCopies, ControlledMail } from "./privacy-doubles.ts";
import { ErasureCoordinator } from "../../server/privacy/erasure.ts";
import { PrivacyWorker } from "../../server/privacy/worker.ts";
import { sharedLock, exclusiveRun } from "../../server/privacy/maintenance.ts";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdtempSync, rmSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
export { receive, input };
export async function privacyFixture() {
  const f = await inboxFixture(Date.now());
  migratePrivacy(f.contact.db);
  const path = join(f.dir, "contact.sqlite"),
    p = new PrivacyRepository(f.repository, path),
    replicaDir = mkdtempSync(join(tmpdir(), "priva009-replica-"));
  chmodSync(replicaDir, 0o700);
  const key = randomBytes(32),
    mailKey = randomBytes(32),
    journal = new FileJournal(join(replicaDir, "journal.sqlite"), key),
    copies = new ControlledCopies(replicaDir, key),
    lock = join(f.dir, "maintenance.lock");
  const maintenance = {
    clean: async () => {
      p.close();
      f.repo.close();
      f.contact.close();
      try {
        exclusiveRun(lock, [resolve("scripts/privacy-checkpoint.ts"), path]);
      } finally {
        p.reopen();
        f.contact = new SqliteContactRepository(path, f.tokens);
        f.repo = new InboxRepository(
          f.repository,
          path,
          f.crypto,
          f.csrfKey,
          "synthetic@example.com",
        );
        f.service.repository = f.repo;
        f.worker.repository = f.repo;
      }
    },
  };
  const erasure = new ErasureCoordinator(p, journal, copies, maintenance),
    privacyWorker = new PrivacyWorker(
      erasure,
      () => {},
      join(f.dir, "heartbeat.json"),
    ),
    mail = new ControlledMail(f.time);
  return {
    ...f,
    get contact() {
      return f.contact;
    },
    get repo() {
      return f.repo;
    },
    p,
    path,
    key,
    mailKey,
    journal,
    copies,
    erasure,
    privacyWorker,
    confirmationMail: mail,
    replicaDir,
    lock,
    cleanup: () => {
      p.close();
      journal.close();
      f.repo.close();
      f.contact.close();
      f.cleanup();
      rmSync(replicaDir, { recursive: true, force: true });
    },
  };
}
export function populate(
  f: Awaited<ReturnType<typeof privacyFixture>>,
  count = 1000,
  replies = 10,
) {
  const db = f.p.db,
    now = f.time(),
    date = new Date(now).toISOString();
  db.exec("BEGIN IMMEDIATE");
  try {
    const insert = db.prepare(
      "INSERT INTO consultations(id,nameOrAlias,email,message,receivedAt,lastActivityAt,status) VALUES(?,?,?,?,?,?,'Pendiente')",
    );
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      const id = randomUUID();
      insert.run(
        id,
        "Synthetic",
        "synthetic@example.com",
        "synthetic message " + i,
        date,
        date,
      );
      ids.push(id);
    }
    db.exec("COMMIT");
    return ids;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
