// Child-process bank helper. Sensitive synthetic input is read through stdin, never argv/logs.
import { join } from "node:path";
import { openAdminRuntime } from "../../../server/admin/runtime.ts";
import { InboxRepository } from "../../../server/inbox/sqlite-repository.ts";
import { ReplyCrypto } from "../../../server/inbox/crypto.ts";
import { InboxService } from "../../../server/inbox/service.ts";
let text = "";
for await (const chunk of process.stdin) text += chunk;
const v = JSON.parse(text),
  admin = openAdminRuntime(v.directory, [], { clock: () => v.now });
const repo = new InboxRepository(
  admin.repository,
  join(v.directory, "contact.sqlite"),
  new ReplyCrypto(new Map([["v1", Buffer.from(v.key, "hex")]])),
  admin.csrfKey,
  "synthetic@example.com",
);
try {
  const result = new InboxService(repo).send(
    v.token,
    v.consultationId,
    v.input,
  );
  process.stdout.write(JSON.stringify({ replay: result.replay }));
} finally {
  repo.close();
  admin.repository.close();
}
