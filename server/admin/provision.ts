// Restricted operator process only; no HTTP route and no password argument/default credential.
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { openAdminRuntime } from "./runtime.ts";
import type { SqliteAdminRepository } from "./sqlite-repository.ts";
import { validateEmail } from "../../src/lib/admin-validation.ts";
export function provision(
  r: SqliteAdminRepository,
  action: string,
  email: string,
) {
  const parsed = validateEmail(email);
  if (!parsed) throw Error("Invalid email");
  if (action === "crear") {
    r.createAccount(parsed.email);
    return;
  }
  if (action !== "habilitar" && action !== "deshabilitar")
    throw Error("Invalid operation");
  const a = r.findAccount(parsed.emailKey);
  if (!a) throw Error("Account unavailable");
  r.setAuthorization(a.id, action === "habilitar");
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const [action, email, ...extra] = process.argv.slice(2);
  if (!action || !email || extra.length || !process.env.PRIVA_ADMIN_DATA_DIR) {
    console.error(
      "Uso: PRIVA_ADMIN_DATA_DIR privado; provision.ts crear|habilitar|deshabilitar correo. Sin contraseña en argumentos.",
    );
    process.exitCode = 1;
  } else {
    let runtime: ReturnType<typeof openAdminRuntime> | undefined;
    try {
      runtime = openAdminRuntime(process.env.PRIVA_ADMIN_DATA_DIR, [
        resolve("public"),
        resolve("dist"),
        resolve(".private-build/admin"),
      ]);
      provision(runtime.repository, action, email);
      console.log(
        "Operación confirmada. Activación mediante recuperación por correo cuando corresponda.",
      );
    } catch {
      console.error(
        "Operación no confirmada. Revisa configuración y estado desde el proceso autorizado.",
      );
      process.exitCode = 1;
    } finally {
      runtime?.repository.close();
    }
  }
}
