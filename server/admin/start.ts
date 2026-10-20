import {composeInbox} from '../inbox/composition.ts';
import {inboxIssues} from '../../src/config/inbox.ts';
import type {ReplyMailAdapter} from '../inbox/mail-adapter.ts';
import {composeStories} from '../stories/composition.ts';
import {storyManagementReadiness,storyManagementIssues} from '../../src/config/story-management.ts';
import { createServer } from "node:http";
import { resolve, isAbsolute } from "node:path";
import { pathToFileURL } from "node:url";
import { lstatSync, existsSync, realpathSync, readdirSync } from "node:fs";
import { adminContent } from "../../src/content/admin.ts";
import { adminReadiness } from "../../src/config/admin.ts";
import { adminPublicationIssues } from "../../src/lib/admin-publication.ts";
import { openAdminRuntime, loadKey } from "./runtime.ts";
import { AdminService } from "./service.ts";
import { RecoveryService } from "./recovery.ts";
import { MailWorker } from "./mail-worker.ts";
import { createAdminHandler } from "./http.ts";
import type { MailAdapter } from "./repository.ts";
export async function startAdmin() {
  const issues = [...adminPublicationIssues(adminContent, adminReadiness),...storyManagementIssues(storyManagementReadiness),...inboxIssues()];
  if (issues.length) throw Error("Administrative publication not qualified");
  const raw = process.env.PRIVA_ADMIN_PUBLIC_ORIGIN,
    dir = process.env.PRIVA_ADMIN_DATA_DIR,
    adapterPath = process.env.PRIVA_ADMIN_MAIL_ADAPTER;
  const origin = new URL(raw ?? "invalid");
  if (
    origin.protocol !== "https:" ||
    origin.origin !== raw ||
    origin.username ||
    origin.password ||
    !dir ||
    !isAbsolute(dir) ||
    !adapterPath ||
    !isAbsolute(adapterPath)
  )
    throw Error("Missing qualified runtime configuration");
  const st = lstatSync(adapterPath);
  if (!st.isFile() || st.isSymbolicLink() || (st.mode & 0o022) !== 0)
    throw Error("Unsafe operator adapter");
  const adapter = (await import(pathToFileURL(adapterPath).href))
    .mailAdapter as MailAdapter;
  if (
    !adapter ||
    typeof adapter.send !== "function" ||
    typeof adapter.idempotent !== "boolean"
  )
    throw Error("Invalid MailAdapter");
  const port = Number(process.env.PRIVA_ADMIN_PORT ?? "4329");
  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw Error("Invalid port");
  const viewsRoot = resolve(".private-build/admin");
  for (const page of [
    "login",
    "panel",
    "historias",
    "contacto",
    "recuperar",
    "restablecer",
  ])
    if (!existsSync(resolve(viewsRoot, page + ".html")))
      throw Error("Private templates missing");
  if (!existsSync(resolve("public", "." + adminReadiness.officialBrand)))
    throw Error("Official brand missing");
  const runtime = openAdminRuntime(dir, [
    resolve("public"),
    resolve("dist"),
    viewsRoot,
    resolve(".git"),
  ]);
  const service = new AdminService(
    runtime.repository,
    runtime.hasher,
    runtime.abuseKey,
  );
  const recovery = new RecoveryService(
    runtime.repository,
    runtime.hasher,
    runtime.abuseKey,
    runtime.mailKey,
    origin.origin,
  );
  const worker = new MailWorker(
    runtime.repository,
    new Map([["v1", runtime.mailKey]]),
    adapter,
  );
  const stories=composeStories({repository:runtime.repository,directory:dir,origin:origin.origin,csrfKey:runtime.csrfKey,contactDatabase:process.env.PRIVA_CONTACT_DATABASE});
  const replyAdapterPath=process.env.PRIVA_INBOX_MAIL_ADAPTER, sender=process.env.PRIVA_INBOX_SENDER, contactDatabase=process.env.PRIVA_CONTACT_DATABASE;
  if(!replyAdapterPath||!isAbsolute(replyAdapterPath)||realpathSync(replyAdapterPath)!==replyAdapterPath||!sender||!contactDatabase)throw Error('Missing qualified inbox configuration');
  const replyStat=lstatSync(replyAdapterPath);
  if(!replyStat.isFile()||replyStat.isSymbolicLink()||(replyStat.mode&0o022))throw Error('Unsafe reply adapter');
  const replyAdapter=(await import(pathToFileURL(replyAdapterPath).href)).replyMailAdapter as ReplyMailAdapter;
  const keyVersion=process.env.PRIVA_INBOX_KEY_VERSION??'v1';
  if(!/^v[1-9][0-9]{0,5}$/.test(keyVersion))throw Error('Invalid inbox key version');
  loadKey(resolve(dir,'inbox-mail-'+keyVersion+'.key'));
  const keys=new Map<string,Buffer>();
  for(const file of readdirSync(dir)){const match=file.match(/^inbox-mail-(v[1-9][0-9]{0,5})\.key$/);if(match)keys.set(match[1],loadKey(resolve(dir,file)));}
  const inbox=composeInbox({repository:runtime.repository,contactDatabase,keys,currentKey:keyVersion,csrfKey:runtime.csrfKey,origin:origin.origin,sender,adapter:replyAdapter});
  let maintenanceAt=0;
  let work: Promise<unknown> | undefined;
  const timer = setInterval(() => {
    if (!work)
      work = (async () => {
        runtime.repository.purge();
        if(Date.now()-maintenanceAt>3600000){stories.media.cleanup();inbox.repository.purgeExpired();maintenanceAt=Date.now();}
        await worker.tick();
        await inbox.worker.tick();
      })()
        .catch(() => {
          console.error("admin_maintenance_failed");
        })
        .finally(() => {
          work = undefined;
        });
  }, 1000);
  const server = createServer(
    createAdminHandler({
      ...runtime,
      service,
      recovery,
      stories:stories.handler,
      inbox:inbox.handler,
      origin: origin.origin,
      viewsRoot,
    }),
  );
  server.requestTimeout = 120000;
  server.headersTimeout = 30000;
  server.listen(port, "127.0.0.1");
  const stop = () => {
    clearInterval(timer);
    server.close(async () => {
      await work;
      inbox.repository.close();
      runtime.repository.close();
    });
  };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
  return { server, stop };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  startAdmin().catch(() => {
    console.error(
      "BLOQUEADO 006: configuración, recursos u operación no calificados. No se inició administración.",
    );
    process.exitCode = 1;
  });
