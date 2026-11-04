// Local reading profile: persistent Contact storage, no provider or reply worker.
import { join } from "node:path";
import { loadKey } from "../admin/runtime.ts";
import type { SqliteAdminRepository } from "../admin/sqlite-repository.ts";
import { SqliteContactRepository } from "../contact/sqlite-repository.ts";
import { AttemptTokens } from "../contact/attempt-token.ts";
import { InboxRepository } from "./sqlite-repository.ts";
import { ReplyCrypto } from "./crypto.ts";
import { InboxService } from "./service.ts";
import { createInboxHandler } from "./http.ts";

export function composeLocalInbox(o: {
  repository: SqliteAdminRepository;
  directory: string;
  csrfKey: Buffer;
  origin: string;
}) {
  if (process.env.PRIVA_ADMIN_MODE !== "local")
    throw Error("Local inbox requires explicit local mode");
  const contactDatabase = join(o.directory, "contact.sqlite");
  const contact = new SqliteContactRepository(
    contactDatabase,
    new AttemptTokens(loadKey(join(o.directory, "contact.key"))),
  );
  contact.close();
  const repository = new InboxRepository(
    o.repository,
    contactDatabase,
    new ReplyCrypto(new Map([["v1", loadKey(join(o.directory, "inbox-mail-v1.key"))]])),
    o.csrfKey,
    // Reserved, non-deliverable value required by the shared repository. No worker is created.
    "sin-envio@example.invalid",
  );
  repository.purgeExpired();
  const service = new InboxService(repository);
  return {
    repository,
    service,
    contactDatabase,
    handler: createInboxHandler({ ...o, service, repliesEnabled: false }),
  };
}
