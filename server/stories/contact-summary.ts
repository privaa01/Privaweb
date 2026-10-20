import { DatabaseSync } from "node:sqlite";
import { lstatSync, realpathSync } from "node:fs";
import { isAbsolute } from "node:path";
export function contactSummary(
  path: string | undefined,
  now: number = Date.now(),
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
    const cols = db
      .prepare("PRAGMA table_info(consultations)")
      .all()
      .map((c) => c.name);
    const query = cols.includes("lifecycle")
      ? "SELECT count(*) AS n FROM consultations WHERE lifecycle='active' AND lastActivityAt>? AND lastActivityAt<=?"
      : "SELECT count(*) AS n FROM consultations";
    const n = cols.includes("lifecycle")
      ? db
          .prepare(query)
          .get(
            new Date(now - 90 * 86400000).toISOString(),
            new Date(now).toISOString(),
          )!.n
      : db.prepare(query).get()!.n;
    return { state: "available", total: Number(n) };
  } catch {
    return { state: "unavailable" };
  } finally {
    db?.close();
  }
}
