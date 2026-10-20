import { canRetireSuppression, type Manifest } from "./backups.ts";
import { DatabaseSync } from "node:sqlite";
import { createHmac, timingSafeEqual } from "node:crypto";
import { privatePath, secureConnection, checkpoint } from "./storage.ts";
export type Entry = {
  jobId: string;
  consultationId: string;
  intendedAt: number;
  reason: string;
};
export type SignedEntry = Entry & {
  sequence: number;
  previousDigest: string;
  signature: string;
  keyVersion: string;
};
export type Head = { sequence: number; digest: string };
export interface DeletionJournal {
  append(entry: Entry): Promise<SignedEntry>;
  currentHead(): Promise<Head>;
  readRange(from: number, to: number): Promise<SignedEntry[]>;
  verify(entries: SignedEntry[], head: Head): boolean;
}
export function sign(key: Buffer, value: unknown) {
  return createHmac("sha256", key).update(JSON.stringify(value)).digest("hex");
}
export function signatureEqual(a: string, b: string) {
  return (
    /^[a-f0-9]{64}$/.test(a) &&
    /^[a-f0-9]{64}$/.test(b) &&
    timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"))
  );
}
/** Local durable reference replica. Independence/currentness of its volume must be qualified externally. */
export class FileJournal implements DeletionJournal {
  db: DatabaseSync;
  path: string;
  key: Buffer;
  keys: Map<string, Buffer>;
  version: string;
  private signatureCache = new Map<string, string>();
  constructor(
    path: string,
    supplied: Buffer | Map<string, Buffer>,
    version = "v1",
  ) {
    const keys = Buffer.isBuffer(supplied)
        ? new Map([[version, supplied]])
        : supplied,
      key = keys.get(version);
    if (key?.length !== 32) throw Error("Journal key required");
    privatePath(path, true);
    this.key = key;
    this.keys = keys;
    this.version = version;
    this.path = path;
    const mask = process.umask(0o077);
    try {
      this.db = new DatabaseSync(path);
    } finally {
      process.umask(mask);
    }
    secureConnection(this.db);
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS entries(sequence INTEGER PRIMARY KEY,jobId TEXT NOT NULL UNIQUE,value TEXT NOT NULL);CREATE TABLE IF NOT EXISTS journal_anchor(singleton INTEGER PRIMARY KEY CHECK(singleton=1),value TEXT NOT NULL)",
    );
  }
  close() {
    this.db.close();
  }
  async append(entry: Entry) {
    if (
      !/^[0-9a-f-]{36}$/.test(entry.jobId) ||
      !/^[0-9a-f-]{36}$/.test(entry.consultationId) ||
      !["expiry", "request", "restore"].includes(entry.reason) ||
      !Number.isSafeInteger(entry.intendedAt)
    )
      throw Error("Invalid suppression entry");
    const value: Entry = {
      jobId: entry.jobId,
      consultationId: entry.consultationId,
      intendedAt: entry.intendedAt,
      reason: entry.reason,
    };
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const old = this.db
        .prepare("SELECT value FROM entries WHERE jobId=?")
        .get(value.jobId);
      if (old) {
        const e = JSON.parse(String(old.value)) as SignedEntry;
        if (
          e.consultationId !== value.consultationId ||
          e.intendedAt !== value.intendedAt ||
          e.reason !== value.reason
        )
          throw Error("Journal conflict");
        this.db.exec("COMMIT");
        return e;
      }
      const all = this.entries();
      const last = all.at(-1),
        anchor = this.anchor();
      if (
        !this.verify(all, {
          sequence: last?.sequence ?? anchor.sequence,
          digest: last?.signature ?? anchor.digest,
        })
      )
        throw Error("Journal corrupt");
      const unsigned = {
        ...value,
        keyVersion: this.version,
        sequence: (last?.sequence ?? anchor.sequence) + 1,
        previousDigest: last?.signature ?? anchor.digest,
      };
      const signed = { ...unsigned, signature: sign(this.key, unsigned) };
      this.db
        .prepare("INSERT INTO entries VALUES(?,?,?)")
        .run(signed.sequence, signed.jobId, JSON.stringify(signed));
      this.db.exec("COMMIT");
      return signed;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  entries() {
    return this.db
      .prepare("SELECT value FROM entries ORDER BY sequence")
      .all()
      .map((x) => JSON.parse(String(x.value)) as SignedEntry);
  }
  async currentHead() {
    const all = this.entries(),
      last = all.at(-1),
      anchor = this.anchor(),
      head = {
        sequence: last?.sequence ?? anchor.sequence,
        digest: last?.signature ?? anchor.digest,
      };
    if (!this.verify(all, head)) throw Error("Journal corrupt");
    return head;
  }
  async readRange(from: number, to: number) {
    return this.entries().filter((e) => e.sequence >= from && e.sequence <= to);
  }
  verify(entries: SignedEntry[], head: Head) {
    const anchor = this.anchor();
    let previous = anchor.digest,
      sequence = anchor.sequence;
    try {
      for (const e of entries) {
        const { signature, ...body } = e;
        const encoded = JSON.stringify(body);
        const verified =
          this.keys.has(e.keyVersion) &&
          (this.signatureCache.get(signature) === encoded ||
            signatureEqual(
              signature,
              sign(this.keys.get(e.keyVersion)!, body),
            ));
        if (
          e.sequence !== sequence + 1 ||
          e.previousDigest !== previous ||
          !verified
        )
          return false;
        this.signatureCache.set(signature, encoded);
        previous = signature;
        sequence = e.sequence;
      }
      return sequence === head.sequence && previous === head.digest;
    } catch {
      return false;
    }
  }
  anchor(): Head {
    const row = this.db
      .prepare("SELECT value FROM journal_anchor WHERE singleton=1")
      .get();
    if (!row) return { sequence: 0, digest: "0".repeat(64) };
    const { signature, ...head } = JSON.parse(String(row.value));
    if (
      !this.keys.has(head.keyVersion) ||
      !signatureEqual(signature, sign(this.keys.get(head.keyVersion)!, head))
    )
      throw Error("Invalid journal anchor");
    return { sequence: head.sequence, digest: head.digest };
  }
  async retire(
    sequence: number,
    proof: {
      complete: boolean;
      verifiedAt: number;
      horizon: number;
      manifests: Manifest[];
      signature: string;
    },
    now: number,
  ) {
    const { signature, ...body } = proof;
    if (
      !signatureEqual(signature, sign(this.key, body)) ||
      !canRetireSuppression(sequence, proof.manifests, proof, now)
    )
      throw Error("Backup retirement unverified");
    for (const manifest of proof.manifests) {
      const { signature, ...m } = manifest;
      if (!signatureEqual(signature, sign(this.key, m)))
        throw Error("Unverified backup manifest");
    }
    await this.currentHead();
    const entry = this.entries().find((e) => e.sequence === sequence);
    if (!entry) throw Error("Unknown retirement boundary");
    const head = { sequence, digest: entry.signature };
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db
        .prepare(
          "INSERT INTO journal_anchor VALUES(1,?) ON CONFLICT(singleton) DO UPDATE SET value=excluded.value",
        )
        .run(
          JSON.stringify({
            ...head,
            keyVersion: this.version,
            signature: sign(this.key, { ...head, keyVersion: this.version }),
          }),
        );
      this.db.prepare("DELETE FROM entries WHERE sequence<=?").run(sequence);
      this.db.exec("COMMIT");
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
    this.signatureCache.clear();
    checkpoint(this.db, this.path);
    return head;
  }
}
