// Isolated synthetic bank, never imported by production. No public test controls.
import { resolve } from "node:path";
import { inboxFixture, receive } from "./helpers.ts";
import { createAdminHandler } from "../../../server/admin/http.ts";
import { AdminService } from "../../../server/admin/service.ts";
import { createInboxHandler } from "../../../server/inbox/http.ts";
import { contactServer } from "../../../server/contact/http.ts";
import { ContactService } from "../../../server/contact/service.ts";
if (process.env.PRIVA_TEST_MODE === "integration")
  throw Error(
    "BLOQUEADO 008: real provider, mailbox and retention qualification required; synthetic bank cannot certify integration.",
  );
const f = await inboxFixture(Date.now()),
  origin = "http://localhost:4333";
for (let n = 0; n < 25; n++) {
  const account = f.repository.createAccount("synthetic-" + n + "@example.com");
  f.repository.db
    .prepare(
      "UPDATE admin_accounts SET passwordRecord=?,mailboxVerifiedAt=? WHERE id=?",
    )
    .run(JSON.stringify(f.one.account.passwordRecord), f.time(), account.id);
}
for (let n = 1; n <= 3; n++) receive(f, "Mensaje sintético " + n);
const inbox = createInboxHandler({
  service: f.service,
  origin,
  csrfKey: f.csrfKey,
});
const handler = createAdminHandler({
  ...f,
  service: new AdminService(f.repository, f.hasher, f.abuseKey),
  origin,
  viewsRoot: resolve(".private-build/admin"),
  inbox,
});
const server = contactServer(new ContactService(f.contact, f.tokens), {
  origin,
  staticHandler: (req, res) => {
    void handler(req, res);
  },
});
let work: Promise<unknown> | undefined;
const timer = setInterval(() => {
  f.setTime(Date.now());
  if (!work)
    work = f.worker
      .tick()
      .catch(() => {})
      .finally(() => {
        work = undefined;
      });
}, 100);
server.listen(4333, "127.0.0.1");
const stop = () => {
  clearInterval(timer);
  server.close(async () => {
    await work;
    f.cleanup();
  });
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
