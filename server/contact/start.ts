import { requirePrivacy } from "../privacy/readiness.ts";
import { operatorModule } from "../privacy/runtime.ts";
import { resolve } from "node:path";
import { openContactRuntime } from "./runtime.ts";
import { contactServer } from "./http.ts";
import { contactContent, contactReadiness } from "../../src/config/contact.ts";
import { assertContactPublication } from "../../src/lib/contact-publication.ts";
// Production entry fails closed until editorial and operational review is configured.
requirePrivacy();
assertContactPublication(contactContent, contactReadiness, resolve("public"));
const origin = process.env.PUBLIC_ORIGIN,
  directory = process.env.PRIVA_CONTACT_DATA_DIR;
if (!origin || !directory || origin !== contactReadiness.origin)
  throw new Error("BLOQUEADO 005: configure qualified origin/private storage.");
const privacyOperator = await operatorModule(
  process.env.PRIVA_PRIVACY_OPERATOR_MODULE,
);
if (typeof privacyOperator.beforeContactStart !== "function")
  throw Error("Qualified privacy supervisor required");
await privacyOperator.beforeContactStart(directory);
const runtime = openContactRuntime(directory, [
  resolve("public"),
  resolve("dist"),
]);
if (
  Number(
    runtime.repository.db.prepare("PRAGMA user_version").get()!.user_version,
  ) !== 9
)
  throw Error("Offline privacy migration required");
const server = contactServer(runtime.service, { origin });
server.listen(Number(process.env.PRIVA_CONTACT_PORT ?? "4327"), "127.0.0.1");
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () =>
    server.close(() => {
      runtime.repository.close();
      process.exit(0);
    }),
  );
