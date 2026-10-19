import { createServer } from "node:http";
import { fixture } from "./helpers.ts";
import { AdminService } from "../../../server/admin/service.ts";
import { createAdminHandler } from "../../../server/admin/http.ts";
import { RecoveryService } from "../../../server/admin/recovery.ts";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
export async function bank() {
  const f = fixture();
  const root = join(f.dir, "views");
  mkdirSync(root);
  for (const p of [
    "login",
    "panel",
    "historias",
    "contacto",
    "recuperar",
    "restablecer",
  ])
    writeFileSync(join(root, p + ".html"), `<h1>${p}</h1>`);
  const options = {
    ...f,
    service: new AdminService(f.repository, f.hasher, f.abuseKey),
    origin: "https://admin.example.test",
    viewsRoot: root,
    recovery: new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    ),
  };
  const server = createServer(createAdminHandler(options));
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const port = (
    server.address() as {
      port: number;
    }
  ).port;
  const base = `http://127.0.0.1:${port}`;
  return {
    ...f,
    base,
    async close() {
      await new Promise<void>((r, j) => server.close((e) => (e ? j(e) : r())));
      f.cleanup();
    },
  };
}
export const headers = {
  "x-priva-request": "1",
  origin: "https://admin.example.test",
  "content-type": "application/json",
};
