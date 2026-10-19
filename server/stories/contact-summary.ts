import { DatabaseSync } from "node:sqlite";
import { lstatSync, realpathSync } from "node:fs";
import { isAbsolute } from "node:path";
export function contactSummary(
  path: string | undefined,
): { state: "available"; total: number } | { state: "unavailable" } {
  let db: DatabaseSync | undefined;
  try {
    if (!path || !isAbsolute(path)) throw Error();
    const st = lstatSync(path);
    if (
      !st.isFile() ||
      st.isSymbolicLink() ||
      st.mode & 0o077 ||
      realpathSync(path) !== path
    )
      throw Error();
    db = new DatabaseSync(path, { readOnly: true });
    db.exec("PRAGMA busy_timeout=5000");
    const n = db.prepare("SELECT count(*) AS n FROM consultations").get()!.n;
    return { state: "available", total: Number(n) };
  } catch {
    return { state: "unavailable" };
  } finally {
    db?.close();
  }
}
