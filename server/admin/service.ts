import type { SqliteAdminRepository } from "./sqlite-repository.ts";
import type { PasswordHasher } from "./password.ts";
import { AdminError } from "../../src/lib/admin-contract.ts";
import {
  validateEmail,
  validateLoginPassword,
} from "../../src/lib/admin-validation.ts";
import { canonicalToken, digest, randomToken } from "./sessions.ts";
export class AdminService {
  repository: SqliteAdminRepository;
  hasher: PasswordHasher;
  abuseKey: Buffer;
  constructor(
    repository: SqliteAdminRepository,
    hasher: PasswordHasher,
    abuseKey: Buffer,
  ) {
    this.repository = repository;
    this.hasher = hasher;
    this.abuseKey = abuseKey;
  }
  limit(
    kind: string,
    connection: string,
    globalLimit: number,
    connectionLimit: number,
  ) {
    const r = this.repository;
    const global = r.bucket(
      this.abuseKey,
      kind + ":global",
      "all",
      globalLimit,
    );
    const conn = r.bucket(
      this.abuseKey,
      kind + ":connection",
      connection,
      connectionLimit,
    );
    if (!global || !conn) throw new AdminError(429, "limited");
  }
  async login(
    email: unknown,
    password: unknown,
    connection: string,
    previous?: string,
  ) {
    const parsed = validateEmail(email);
    if (!parsed || !validateLoginPassword(password))
      throw new AdminError(422, "invalid");
    this.limit("login", connection, 300, 30);
    if (
      !this.repository.bucket(this.abuseKey, "login:email", parsed.emailKey, 5)
    )
      throw new AdminError(429, "limited");
    // Admission happens before any account lookup, including queued work. No await between lookup and derive admission.
    if (this.hasher.saturated) throw new AdminError(503, "unavailable");
    const account = this.repository.findAccount(parsed.emailKey);
    const eligible = account?.authorized && account.mailboxVerifiedAt !== null;
    const ok = await this.hasher.verify(
      password,
      eligible ? account.passwordRecord : null,
    );
    return this.repository.transaction(() => {
      const current = account ? this.repository.accountById(account.id) : null;
      if (
        !ok ||
        !current ||
        !current.authorized ||
        current.mailboxVerifiedAt === null ||
        current.credentialVersion !== account!.credentialVersion ||
        JSON.stringify(current.passwordRecord) !==
          JSON.stringify(account!.passwordRecord)
      )
        throw new AdminError(401, "invalid_credentials");
      const token = randomToken();
      if (canonicalToken(previous))
        this.repository.db
          .prepare(
            "UPDATE admin_sessions SET revokedAt=COALESCE(revokedAt,?) WHERE tokenDigest=?",
          )
          .run(this.repository.clock(), digest(previous));
      const session = this.repository.createSession(
        current.id,
        current.credentialVersion,
        digest(token),
      );
      return { token, account: current, session };
    });
  }
}
