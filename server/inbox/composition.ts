import { resolve, relative, isAbsolute } from "node:path";
import { InboxRepository } from "./sqlite-repository.ts";
import { InboxService } from "./service.ts";
import { ReplyCrypto } from "./crypto.ts";
import { ReplyWorker } from "./worker.ts";
import { createInboxHandler } from "./http.ts";
import type { SqliteAdminRepository } from "../admin/sqlite-repository.ts";
import type { ReplyMailAdapter } from "./mail-adapter.ts";
export function composeInbox(o: {
  repository: SqliteAdminRepository;
  contactDatabase: string;
  keys: Map<string, Buffer>;
  currentKey?: string;
  csrfKey: Buffer;
  origin: string;
  sender: string;
  adapter: ReplyMailAdapter;
  staticRoots?: string[];
}) {
  const path = resolve(o.contactDatabase);
  if (path !== o.contactDatabase) throw Error("Canonical inbox path required");
  for (const root of [
    resolve("public"),
    resolve("dist"),
    resolve(".git"),
    resolve(".private-build"),
    ...(o.staticRoots ?? []),
  ]) {
    const rel = relative(root, path);
    if (!rel || (!rel.startsWith("..") && !isAbsolute(rel)))
      throw Error("Private inbox below served root");
  }
  const repository = new InboxRepository(
      o.repository,
      path,
      new ReplyCrypto(o.keys, o.currentKey ?? "v1"),
      o.csrfKey,
      o.sender,
    ),
    service = new InboxService(repository),
    worker = new ReplyWorker(repository, o.adapter);
  // Recovery barrier: expire local data before enabling views/worker. Does not qualify backups009.
  repository.purgeExpired();
  return {
    repository,
    service,
    worker,
    handler: createInboxHandler({
      service,
      origin: o.origin,
      csrfKey: o.csrfKey,
      log: (v) => console.info(JSON.stringify(v)),
    }),
  };
}
