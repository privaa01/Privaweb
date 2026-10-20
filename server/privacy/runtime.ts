import { lstatSync, realpathSync } from "node:fs";
import { isAbsolute } from "node:path";
import { pathToFileURL } from "node:url";
import { requirePrivacy } from "./readiness.ts";
/** Operator-owned composition must supply qualified replica, maintenance supervisor and provider. No default provider or test switch. */
export async function operatorModule(path: string | undefined) {
  if (!path || !isAbsolute(path))
    throw Error("Qualified privacy operator module required");
  const s = lstatSync(path);
  if (
    !s.isFile() ||
    s.isSymbolicLink() ||
    realpathSync(path) !== path ||
    s.mode & 0o022
  )
    throw Error("Unsafe privacy operator module");
  return await import(pathToFileURL(path).href);
}
export async function productionPrivacy(context: unknown) {
  requirePrivacy();
  const m = await operatorModule(process.env.PRIVA_PRIVACY_OPERATOR_MODULE);
  if (typeof m.openPrivacy !== "function")
    throw Error("Missing privacy operator composition");
  return m.openPrivacy(context);
}
