import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { randomUUID, createHmac } from "node:crypto";
import { chmodSync, existsSync, lstatSync, realpathSync } from "node:fs";
import type {
  AdminAccount,
  AdminSession,
  Clock,
  ResetProof,
  RecoveryJob,
} from "./repository.ts";
import { validateEmail } from "../../src/lib/admin-validation.ts";
import { AdminError } from "../../src/lib/admin-contract.ts";
import { digest, canonicalToken, IDLE, ABSOLUTE } from "./sessions.ts";
import { validRecord } from "./password.ts";
const DAY = 86400000;
export class SqliteAdminRepository {
  db: DatabaseSync;
  clock: Clock;
  path: string;
  closed = false;
  constructor(path: string, clock: Clock = Date.now) {
    this.path = path;
    this.clock = clock;
    // lstat catches dangling links too; existsSync follows them and would miss the alias.
    for (const f of [path, path + "-wal", path + "-shm"]) {
      let st;
      try {
        st = lstatSync(f);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw error;
      }
      if (
        !st.isFile() ||
        st.isSymbolicLink() ||
        realpathSync(f) !== f ||
        (st.mode & 0o077) !== 0
      )
        throw Error("Unsafe administrative file");
    }
    this.db = new DatabaseSync(path);
    chmodSync(path, 0o600);
    this.db.exec(
      "PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;",
    );
    this.db
      .exec(`CREATE TABLE IF NOT EXISTS admin_accounts(id TEXT PRIMARY KEY,email TEXT NOT NULL,emailKey TEXT NOT NULL UNIQUE,authorized INTEGER NOT NULL CHECK(authorized IN(0,1)),passwordRecord TEXT,credentialVersion INTEGER NOT NULL CHECK(credentialVersion>=1),mailboxVerifiedAt INTEGER,createdAt INTEGER NOT NULL,updatedAt INTEGER NOT NULL,permission TEXT NOT NULL DEFAULT 'administrador' CHECK(permission='administrador'));
 CREATE TABLE IF NOT EXISTS admin_sessions(tokenDigest TEXT PRIMARY KEY,accountId TEXT NOT NULL REFERENCES admin_accounts(id),credentialVersion INTEGER NOT NULL,createdAt INTEGER NOT NULL,absoluteExpiresAt INTEGER NOT NULL,lastActivityAt INTEGER NOT NULL,idleExpiresAt INTEGER NOT NULL,revokedAt INTEGER);
 CREATE TABLE IF NOT EXISTS admin_preauth(tokenDigest TEXT PRIMARY KEY,expiresAt INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS admin_resets(tokenDigest TEXT PRIMARY KEY,accountId TEXT NOT NULL REFERENCES admin_accounts(id),credentialVersion INTEGER NOT NULL,issuedAt INTEGER NOT NULL,expiresAt INTEGER NOT NULL,consumedAt INTEGER,invalidatedAt INTEGER);
 CREATE TABLE IF NOT EXISTS admin_jobs(id TEXT PRIMARY KEY,accountId TEXT REFERENCES admin_accounts(id),credentialVersion INTEGER,kind TEXT NOT NULL CHECK(kind IN('real','noop')),createdAt INTEGER NOT NULL,expiresAt INTEGER NOT NULL,leaseUntil INTEGER,attempts INTEGER NOT NULL DEFAULT 0,state TEXT NOT NULL CHECK(state IN('queued','leased','accepted','failed','expired')),deliveryId TEXT,envelope TEXT,nextAttemptAt INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS admin_abuse(bucket TEXT PRIMARY KEY,count INTEGER NOT NULL,windowEnd INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS admin_sessions_account ON admin_sessions(accountId); CREATE INDEX IF NOT EXISTS admin_resets_account ON admin_resets(accountId);`);
    for (const f of [path + "-wal", path + "-shm"])
      if (existsSync(f)) chmodSync(f, 0o600);
  }
  close() {
    if (!this.closed) {
      this.closed = true;
      this.db.close();
    }
  }
  transaction<T>(fn: () => T): T {
    if (fn.constructor.name === "AsyncFunction")
      throw Error("Async transaction forbidden");
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const v = fn();
      if (
        v &&
        typeof (
          v as {
            then?: unknown;
          }
        ).then === "function"
      )
        throw Error("Async transaction forbidden");
      this.db.exec("COMMIT");
      return v;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  account(row: Record<string, unknown> | undefined): AdminAccount | null {
    if (!row) return null;
    return {
      ...row,
      authorized: !!row.authorized,
      passwordRecord: row.passwordRecord
        ? JSON.parse(row.passwordRecord as string)
        : null,
    } as unknown as AdminAccount;
  }
  findAccount(emailKey: string) {
    return this.account(
      this.db
        .prepare("SELECT * FROM admin_accounts WHERE emailKey=?")
        .get(emailKey),
    );
  }
  accountById(id: string) {
    return this.account(
      this.db.prepare("SELECT * FROM admin_accounts WHERE id=?").get(id),
    );
  }
  createAccount(email: string) {
    const v = validateEmail(email);
    if (!v) throw new AdminError(422, "invalid");
    const id = randomUUID(),
      now = this.clock();
    this.db
      .prepare(
        "INSERT INTO admin_accounts(id,email,emailKey,authorized,passwordRecord,credentialVersion,mailboxVerifiedAt,createdAt,updatedAt) VALUES(?,?,?,1,NULL,1,NULL,?,?)",
      )
      .run(id, v.email, v.emailKey, now, now);
    return this.accountById(id)!;
  }
  invalidateAccount(id: string, now = this.clock()) {
    this.db
      .prepare(
        "UPDATE admin_sessions SET revokedAt=COALESCE(revokedAt,?) WHERE accountId=?",
      )
      .run(now, id);
    this.db
      .prepare(
        "UPDATE admin_resets SET invalidatedAt=COALESCE(invalidatedAt,?) WHERE accountId=?",
      )
      .run(now, id);
    this.db
      .prepare(
        "UPDATE admin_jobs SET state='expired',envelope=NULL,leaseUntil=NULL WHERE accountId=? AND state IN('queued','leased')",
      )
      .run(id);
  }
  setAuthorization(id: string, enabled: boolean) {
    return this.transaction(() => {
      if (!this.accountById(id)) throw new AdminError(404, "not_found");
      this.db
        .prepare(
          "UPDATE admin_accounts SET authorized=?,passwordRecord=NULL,mailboxVerifiedAt=NULL,credentialVersion=credentialVersion+1,updatedAt=? WHERE id=?",
        )
        .run(enabled ? 1 : 0, this.clock(), id);
      this.invalidateAccount(id);
    });
  }
  createSession(accountId: string, version: number, tokenDigest: string) {
    const n = this.clock();
    this.db
      .prepare("INSERT INTO admin_sessions VALUES(?,?,?,?,?,?,?,NULL)")
      .run(tokenDigest, accountId, version, n, n + ABSOLUTE, n, n + IDLE);
    return this.db
      .prepare("SELECT * FROM admin_sessions WHERE tokenDigest=?")
      .get(tokenDigest) as unknown as AdminSession;
  }
  session(token: string | undefined): {
    session: AdminSession;
    account: AdminAccount;
  } | null {
    if (!canonicalToken(token)) return null;
    const s = this.db
      .prepare("SELECT * FROM admin_sessions WHERE tokenDigest=?")
      .get(digest(token)) as unknown as AdminSession | undefined;
    if (
      !s ||
      s.revokedAt !== null ||
      this.clock() >= s.idleExpiresAt ||
      this.clock() >= s.absoluteExpiresAt
    )
      return null;
    const a = this.accountById(s.accountId);
    return a &&
      a.authorized &&
      a.mailboxVerifiedAt !== null &&
      validRecord(a.passwordRecord) &&
      a.credentialVersion === s.credentialVersion
      ? { session: s, account: a }
      : null;
  }
  withAuthorizedTransaction<T>(
    token: string | undefined,
    operation: ((db: DatabaseSync, account: AdminAccount) => T) &
      ([Extract<T, PromiseLike<unknown>>] extends [never] ? unknown : never),
    touch = true,
  ): T {
    if (operation.constructor.name === "AsyncFunction")
      throw Error("Async transaction forbidden");
    return this.transaction(() => {
      const found = this.session(token);
      if (!found) throw new AdminError(401, "unauthenticated");
      const value = operation(this.db, found.account);
      if (touch) {
        const n = this.clock();
        this.db
          .prepare(
            "UPDATE admin_sessions SET lastActivityAt=?,idleExpiresAt=? WHERE tokenDigest=?",
          )
          .run(
            n,
            Math.min(n + IDLE, found.session.absoluteExpiresAt),
            found.session.tokenDigest,
          );
      }
      return value;
    });
  }
  logout(token: string | undefined) {
    return this.transaction(() => {
      if (canonicalToken(token))
        this.db
          .prepare(
            "UPDATE admin_sessions SET revokedAt=COALESCE(revokedAt,?) WHERE tokenDigest=?",
          )
          .run(this.clock(), digest(token));
    });
  }
  proof(token: string): {
    proof: ResetProof;
    account: AdminAccount;
  } | null {
    if (!canonicalToken(token)) return null;
    const p = this.db
      .prepare("SELECT * FROM admin_resets WHERE tokenDigest=?")
      .get(digest(token)) as unknown as ResetProof | undefined;
    if (
      !p ||
      p.consumedAt !== null ||
      p.invalidatedAt !== null ||
      this.clock() >= p.expiresAt
    )
      return null;
    const a = this.accountById(p.accountId);
    return a && a.authorized && a.credentialVersion === p.credentialVersion
      ? { proof: p, account: a }
      : null;
  }
  bucket(key: Buffer, namespace: string, identity: string, limit: number) {
    const bucket = createHmac("sha256", key)
      .update(namespace + ":" + identity)
      .digest("hex");
    const n = this.clock();
    return this.transaction(() => {
      this.db.prepare("DELETE FROM admin_abuse WHERE windowEnd<=?").run(n);
      this.db
        .prepare(
          "INSERT INTO admin_abuse VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1",
        )
        .run(bucket, n + 900000);
      return (
        (this.db
          .prepare("SELECT count FROM admin_abuse WHERE bucket=?")
          .get(bucket)!.count as number) <= limit
      );
    });
  }
  purge() {
    const n = this.clock();
    this.transaction(() => {
      this.db
        .prepare(
          "DELETE FROM admin_sessions WHERE MIN(COALESCE(revokedAt,absoluteExpiresAt),idleExpiresAt,absoluteExpiresAt)<=?",
        )
        .run(n - DAY);
      this.db
        .prepare(
          "DELETE FROM admin_resets WHERE MIN(COALESCE(consumedAt,expiresAt),COALESCE(invalidatedAt,expiresAt),expiresAt)<=?",
        )
        .run(n - DAY);
      this.db.prepare("DELETE FROM admin_preauth WHERE expiresAt<=?").run(n);
      this.db.prepare("DELETE FROM admin_abuse WHERE windowEnd<=?").run(n);
      this.db
        .prepare(
          "UPDATE admin_jobs SET state='expired',envelope=NULL,leaseUntil=NULL WHERE expiresAt<=? AND state IN('queued','leased')",
        )
        .run(n);
      this.db
        .prepare("DELETE FROM admin_jobs WHERE kind='noop' OR createdAt<=?")
        .run(n - DAY);
    });
  }
  job(id: string) {
    return this.db
      .prepare("SELECT * FROM admin_jobs WHERE id=?")
      .get(id) as unknown as RecoveryJob | undefined;
  }
  run(sql: string, ...values: SQLInputValue[]) {
    return this.db.prepare(sql).run(...values);
  }
}
