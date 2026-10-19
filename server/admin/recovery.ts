import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
  randomInt,
} from "node:crypto";
import { setTimeout as wait } from "node:timers/promises";
import type { SqliteAdminRepository } from "./sqlite-repository.ts";
import { PasswordHasher, acceptablePassword } from "./password.ts";
import { AdminService } from "./service.ts";
import { AdminError } from "../../src/lib/admin-contract.ts";
import { validateEmail } from "../../src/lib/admin-validation.ts";
import { randomToken, digest, RESET, canonicalToken } from "./sessions.ts";
export interface MailPayload {
  to: string;
  resetURL: string;
}
export function encryptEnvelope(
  key: Buffer,
  aad: string,
  value: MailPayload,
  keyVersion = "v1",
) {
  const nonce = randomBytes(12),
    c = createCipheriv("aes-256-gcm", key, nonce);
  c.setAAD(Buffer.from(aad));
  const ciphertext = Buffer.concat([
    c.update(JSON.stringify(value), "utf8"),
    c.final(),
  ]);
  return JSON.stringify({
    keyVersion,
    nonce: nonce.toString("base64url"),
    tag: c.getAuthTag().toString("base64url"),
    ciphertext: ciphertext.toString("base64url"),
  });
}
export function decryptEnvelope(
  keys: Map<string, Buffer>,
  aad: string,
  envelope: string,
): MailPayload {
  const e = JSON.parse(envelope),
    key = keys.get(e.keyVersion);
  if (!key) throw Error("Missing envelope key");
  const d = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(e.nonce, "base64url"),
  );
  d.setAAD(Buffer.from(aad));
  d.setAuthTag(Buffer.from(e.tag, "base64url"));
  const payload = JSON.parse(
    Buffer.concat([
      d.update(Buffer.from(e.ciphertext, "base64url")),
      d.final(),
    ]).toString("utf8"),
  );
  if (typeof payload.to !== "string" || typeof payload.resetURL !== "string")
    throw Error("Invalid envelope");
  return payload;
}
export class RecoveryService {
  r: SqliteAdminRepository;
  hasher: PasswordHasher;
  abuseKey: Buffer;
  mailKey: Buffer;
  mailKeyVersion: string;
  origin: string;
  auth: AdminService;
  constructor(
    r: SqliteAdminRepository,
    hasher: PasswordHasher,
    abuseKey: Buffer,
    mailKey: Buffer,
    origin: string,
    mailKeyVersion = "v1",
  ) {
    this.r = r;
    this.hasher = hasher;
    this.abuseKey = abuseKey;
    this.mailKey = mailKey;
    this.mailKeyVersion = mailKeyVersion;
    this.origin = origin;
    this.auth = new AdminService(r, hasher, abuseKey);
  }
  async request(email: unknown, connection: string) {
    const start = performance.now(),
      delay = 250 + randomInt(51);
    const parsed = validateEmail(email);
    if (!parsed) throw new AdminError(422, "invalid");
    this.auth.limit("recovery", connection, 100, 10);
    const within = this.r.bucket(
      this.abuseKey,
      "recovery:email",
      parsed.emailKey,
      3,
    );
    try {
      const n = this.r.clock(),
        id = randomUUID(),
        deliveryId = randomUUID(),
        token = randomToken();
      this.r.transaction(() => {
        const account = this.r.findAccount(parsed.emailKey);
        const eligible = within && account?.authorized;
        const envelope = encryptEnvelope(
          this.mailKey,
          `${id}:${eligible ? account.id : "noop"}:${eligible ? account.credentialVersion : 0}`,
          {
            to: eligible ? account.email : "",
            resetURL: eligible
              ? this.origin + "/admin/restablecer#token=" + token
              : "",
          },
          this.mailKeyVersion,
        );
        if (eligible)
          this.r.db
            .prepare("INSERT INTO admin_resets VALUES(?,?,?,?,?,NULL,NULL)")
            .run(
              digest(token),
              account.id,
              account.credentialVersion,
              n,
              n + RESET,
            );
        this.r.db
          .prepare(
            "INSERT INTO admin_jobs VALUES(?,?,?,?,?,?,NULL,0,'queued',?,?,?)",
          )
          .run(
            id,
            eligible ? account.id : null,
            eligible ? account.credentialVersion : null,
            eligible ? "real" : "noop",
            n,
            n + RESET,
            eligible ? deliveryId : null,
            eligible ? envelope : null,
            n,
          );
      });
    } catch {
      console.warn("admin_recovery_transaction_failed");
    }
    while (performance.now() - start < delay)
      await wait(Math.ceil(delay - (performance.now() - start)));
  }
  async reset(token: unknown, password: unknown, connection: string) {
    this.auth.limit("reset", connection, 100, 30);
    const key = typeof token === "string" ? digest(token) : "invalid";
    if (!this.r.bucket(this.abuseKey, "reset:proof", key, 5))
      throw new AdminError(429, "limited");
    if (!acceptablePassword(password)) throw new AdminError(422, "invalid");
    if (!canonicalToken(token) || !this.r.proof(token))
      throw new AdminError(400, "invalid_reset");
    const hash = await this.hasher.hash(password);
    this.r.transaction(() => {
      const found = this.r.proof(token);
      if (!found) throw new AdminError(400, "invalid_reset");
      const n = this.r.clock();
      this.r.db
        .prepare(
          "UPDATE admin_accounts SET passwordRecord=?,mailboxVerifiedAt=?,credentialVersion=credentialVersion+1,updatedAt=? WHERE id=?",
        )
        .run(JSON.stringify(hash), n, n, found.account.id);
      this.r.db
        .prepare("UPDATE admin_resets SET consumedAt=? WHERE tokenDigest=?")
        .run(n, digest(token));
      this.r.invalidateAccount(found.account.id, n);
    });
  }
}
