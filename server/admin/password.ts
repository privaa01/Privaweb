import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { AdminError } from "../../src/lib/admin-contract.ts";
import { validateNewPassword } from "../../src/lib/admin-validation.ts";
export interface PasswordRecord {
  version: "scrypt-v1";
  salt: string;
  hash: string;
  N: 131072;
  r: 8;
  p: 1;
  maxmem: 201326592;
}
export const params = { N: 131072, r: 8, p: 1, maxmem: 201326592 } as const;
export function validRecord(raw: unknown): raw is PasswordRecord {
  const r = raw as PasswordRecord | null;
  return (
    !!r &&
    r.version === "scrypt-v1" &&
    r.N === params.N &&
    r.r === 8 &&
    r.p === 1 &&
    r.maxmem === params.maxmem &&
    typeof r.salt === "string" &&
    typeof r.hash === "string" &&
    Buffer.from(r.salt, "base64url").length === 16 &&
    Buffer.from(r.salt, "base64url").toString("base64url") === r.salt &&
    Buffer.from(r.hash, "base64url").length === 64 &&
    Buffer.from(r.hash, "base64url").toString("base64url") === r.hash
  );
}
const denied = new Set(
  readFileSync(new URL("./password-denylist.txt", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#")),
);
export function acceptablePassword(p: unknown): p is string {
  return validateNewPassword(p, (v) => denied.has(v));
}
export class PasswordHasher {
  active = 0;
  private waiting: (() => void)[] = [];
  get saturated() {
    return this.active >= 2 && this.waiting.length >= 8;
  }
  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.active >= 2) {
      if (this.waiting.length >= 8) throw new AdminError(503, "unavailable");
      await new Promise<void>((r) => this.waiting.push(r));
    } else this.active++;
    try {
      return await fn();
    } finally {
      const next = this.waiting.shift();
      if (next) next();
      else this.active--;
    }
  }
  async derive(password: string, salt: Buffer): Promise<Buffer> {
    return this.run(
      () =>
        new Promise((res, rej) =>
          scrypt(password, salt, 64, params, (err, key) =>
            err ? rej(err) : res(key),
          ),
        ),
    );
  }
  async hash(password: string): Promise<PasswordRecord> {
    const salt = randomBytes(16);
    const hash = await this.derive(password, salt);
    return {
      version: "scrypt-v1",
      salt: salt.toString("base64url"),
      hash: hash.toString("base64url"),
      ...params,
    };
  }
  async verify(password: string, record: unknown): Promise<boolean> {
    const valid = validRecord(record);
    const salt = valid
      ? Buffer.from(record.salt, "base64url")
      : Buffer.alloc(16, 17);
    const expected = valid
      ? Buffer.from(record.hash, "base64url")
      : Buffer.alloc(64);
    const actual = await this.derive(password, salt);
    return timingSafeEqual(actual, expected) && valid;
  }
}
