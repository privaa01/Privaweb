import { DatabaseSync } from "node:sqlite";
import type { SqliteAdminRepository } from "../admin/sqlite-repository.ts";
import { privatePath, secureConnection } from "./storage.ts";
import { isPrivacy, queueErasure } from "./schema.ts";
import { expiresAt, visible, PrivacyError } from "./policy.ts";
export type Row = Record<string, any>;
export class PrivacyRepository {
  db: DatabaseSync;
  failure?: (stage: string) => void;
  path: string;
  admin: SqliteAdminRepository;
  clock: () => number;
  constructor(admin: SqliteAdminRepository, path: string) {
    this.admin = admin;
    this.path = path;
    this.clock = () => admin.clock();
    privatePath(path);
    this.db = new DatabaseSync(path);
    try {
      secureConnection(this.db);
      if (!isPrivacy(this.db))
        throw Error("Offline privacy migration required");
    } catch (e) {
      this.db.close();
      throw e;
    }
  }
  close() {
    this.db.close();
  }
  reopen() {
    privatePath(this.path);
    this.db = new DatabaseSync(this.path);
    secureConnection(this.db);
    if (!isPrivacy(this.db)) throw Error("Privacy schema required");
  }
  tx<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const result = fn();
      if (result && typeof (result as any).then === "function")
        throw Error("Async transaction forbidden");
      this.db.exec("COMMIT");
      return result;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  authorized<T>(
    token: string | undefined,
    fn: (id: string) => T,
    touch = true,
  ): T {
    return this.admin.withAuthorizedTransaction<unknown>(
      token,
      (_db, a) => {
        const result = this.tx(() => fn(a.id));
        this.failure?.("afterContactCommit");
        return result;
      },
      touch,
    ) as T;
  }
  consultation(id: string) {
    const c = this.db
      .prepare("SELECT * FROM consultations WHERE id=?")
      .get(id) as Row | undefined;
    if (!c || !visible(c as any, this.clock()))
      throw new PrivacyError(404, "not_found");
    return c;
  }
  queueExpired() {
    return this.tx(() => {
      let n = 0;
      for (const c of this.db
        .prepare(
          "SELECT id,lastActivityAt FROM consultations WHERE lifecycle='active'",
        )
        .all()) {
        let expired = true;
        try {
          expired = expiresAt(String(c.lastActivityAt)) <= this.clock();
        } catch {
          throw Error("Invalid retention clock data");
        }
        if (expired) {
          queueErasure(
            this.db,
            String(c.id),
            this.clock(),
            undefined,
            "expiry",
          );
          n++;
        }
      }
      return n;
    });
  }
}
