import { cleanupPrivacy } from "./cleanup.ts";
import { randomUUID, createHash, createHmac } from "node:crypto";
import { PrivacyRepository, type Row } from "./repository.ts";
import { ReplyCrypto } from "../inbox/crypto.ts";
import { digest } from "../admin/sessions.ts";
import { challenge, challengeDigest, matches } from "./confirmation.ts";
import { CHALLENGE_TTL, PrivacyError } from "./policy.ts";
import { queueErasure } from "./schema.ts";
export const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function exact(
  value: unknown,
  keys: string[],
): asserts value is Record<string, any> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).sort().join() !== [...keys].sort().join()
  )
    throw new PrivacyError(422, "validation");
}
export class PrivacyService {
  repository: PrivacyRepository;
  challengeKey: Buffer;
  challengeKeys: Map<string, Buffer>;
  crypto: ReplyCrypto;
  currentKey: string;
  sender: string;
  constructor(
    repository: PrivacyRepository,
    challengeKey: Buffer | Map<string, Buffer>,
    mailKey: Buffer | Map<string, Buffer>,
    sender: string,
    currentKey = "v1",
  ) {
    const challenges = Buffer.isBuffer(challengeKey)
        ? new Map([[currentKey, challengeKey]])
        : challengeKey,
      mailKeys = Buffer.isBuffer(mailKey)
        ? new Map([[currentKey, mailKey]])
        : mailKey;
    const current = challenges.get(currentKey);
    if (
      current?.length !== 32 ||
      mailKeys.get(currentKey)?.length !== 32 ||
      current.equals(mailKeys.get(currentKey)!) ||
      /[\r\n]/.test(sender) ||
      !/^\S+@\S+\.\S+$/.test(sender)
    )
      throw Error("Invalid privacy keys/sender");
    this.repository = repository;
    this.challengeKeys = challenges;
    this.challengeKey = current;
    this.crypto = new ReplyCrypto(mailKeys, currentKey);
    this.currentKey = currentKey;
    this.sender = sender;
    for (const q of repository.db
      .prepare(
        "SELECT * FROM privacy_requests WHERE challengeDigest IS NOT NULL",
      )
      .all())
      if (challenges.get(String(q.keyVersion))?.length !== 32)
        throw Error("Missing retained challenge key");
    for (const m of repository.db
      .prepare(
        "SELECT operationId,payloadEncrypted FROM privacy_mail_operations WHERE payloadEncrypted IS NOT NULL",
      )
      .all())
      this.crypto.open(
        "privacy009:" + m.operationId,
        String(m.payloadEncrypted),
      );
  }

  create(token: string | undefined, raw: unknown) {
    exact(raw, ["requestId", "targets"]);
    if (
      typeof raw.requestId !== "string" ||
      !uuid.test(raw.requestId) ||
      !Array.isArray(raw.targets) ||
      raw.targets.length < 1 ||
      raw.targets.length > 50
    )
      throw new PrivacyError(422, "validation");
    const targets = raw.targets
      .map((t: unknown) => {
        exact(t, ["id", "revision"]);
        if (
          typeof t.id !== "string" ||
          !uuid.test(t.id) ||
          !Number.isSafeInteger(t.revision) ||
          t.revision < 1
        )
          throw new PrivacyError(422, "validation");
        return { id: t.id, revision: t.revision };
      })
      .sort((a, b) => a.id.localeCompare(b.id));
    if (new Set(targets.map((t) => t.id)).size !== targets.length)
      throw new PrivacyError(422, "validation");
    const r = this.repository;
    return r.authorized(token, (actor) => {
      const now = r.clock(),
        payloadHash = createHash("sha256")
          .update(JSON.stringify({ actor, targets }))
          .digest("hex"),
        old = r.db
          .prepare("SELECT * FROM privacy_requests WHERE requestId=?")
          .get(raw.requestId) as Row | undefined;
      if (old) {
        if (old.payloadHash !== payloadHash)
          throw new PrivacyError(409, "operation_conflict");
        return this.view(old);
      }
      const cs = targets.map((t) => {
        const c = r.consultation(t.id);
        if (c.revision !== t.revision)
          throw new PrivacyError(409, "revision_conflict");
        return c;
      });
      if (cs.some((c) => c.email !== cs[0].email))
        throw new PrivacyError(422, "scope");
      r.db.prepare("DELETE FROM privacy_abuse WHERE windowEnd<=?").run(now);
      for (const c of cs) {
        const pending = r.db
          .prepare(
            "SELECT 1 FROM privacy_request_targets t JOIN privacy_requests q ON q.requestId=t.requestId WHERE t.consultationId=? AND q.state IN('awaiting_send','awaiting_confirmation') AND q.expiresAt>?",
          )
          .get(c.id, now);
        if (pending) throw new PrivacyError(409, "unresolved_operation");
        const bucket = createHmac("sha256", this.challengeKey)
          .update(actor + ":" + c.id)
          .digest("hex");
        const found = r.db
          .prepare("SELECT count FROM privacy_abuse WHERE bucket=?")
          .get(bucket);
        if (found && Number(found.count) >= 3)
          throw new PrivacyError(429, "rate");
        r.db
          .prepare(
            "INSERT INTO privacy_abuse VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1",
          )
          .run(bucket, now + CHALLENGE_TTL);
      }
      const id = raw.requestId,
        code = challenge(),
        deliveryId = randomUUID(),
        mail = {
          to: cs[0].email,
          from: this.sender,
          subject: "Confirma tu solicitud de eliminación de Priva",
          text:
            "Código de confirmación: " +
            code +
            "\nSolicitud: " +
            id +
            "\nAlcance: " +
            targets.map((t) => t.id).join(", ") +
            "\nVálido durante 30 minutos. Devuélvelo solo por el canal oficial verificado de Priva. No incluyas información sensible.",
        };
      r.db
        .prepare(
          "INSERT INTO privacy_requests(requestId,actorAccountId,createdAt,expiresAt,state,challengeDigest,keyVersion,payloadHash) VALUES(?,?,?,?,'awaiting_send',?,?,?)",
        )
        .run(
          id,
          actor,
          now,
          now + CHALLENGE_TTL,
          challengeDigest(this.challengeKey, id, code),
          this.currentKey,
          payloadHash,
        );
      const insert = r.db.prepare(
        "INSERT INTO privacy_request_targets VALUES(?,?,?)",
      );
      for (const t of targets) insert.run(id, t.id, t.revision);
      r.db
        .prepare(
          "INSERT INTO privacy_mail_operations(operationId,deliveryId,payloadEncrypted,payloadDigest,sessionDigest,state,createdAt) VALUES(?,?,?,?,?,'queued',?)",
        )
        .run(
          id,
          deliveryId,
          this.crypto.seal("privacy009:" + id, mail),
          createHash("sha256").update(JSON.stringify(mail)).digest("hex"),
          digest(token!),
          now,
        );
      return this.view(
        r.db
          .prepare("SELECT * FROM privacy_requests WHERE requestId=?")
          .get(id) as Row,
      );
    });
  }
  view(q: Row) {
    return {
      requestId: q.requestId,
      state: q.state,
      expiresAt: q.expiresAt,
      confirmedAt: q.confirmedAt,
      deadlineAt: q.deadlineAt,
    };
  }
  status(token: string | undefined, id: string) {
    if (!uuid.test(id)) throw new PrivacyError(404, "not_found");
    return this.repository.authorized(
      token,
      () => {
        const q = this.repository.db
          .prepare("SELECT * FROM privacy_requests WHERE requestId=?")
          .get(id) as Row | undefined;
        if (!q) throw new PrivacyError(404, "not_found");
        return this.view(q);
      },
      false,
    );
  }
  confirm(token: string | undefined, id: string, raw: unknown) {
    exact(raw, ["code"]);
    if (!uuid.test(id)) throw new PrivacyError(404, "not_found");
    const r = this.repository;
    const result = r.authorized(token, () => {
      const q = r.db
          .prepare("SELECT * FROM privacy_requests WHERE requestId=?")
          .get(id) as Row | undefined,
        now = r.clock();
      if (!q) throw new PrivacyError(404, "not_found");
      if (q.expiresAt <= now) {
        this.terminate(id, "expired", now);
        return { error: 422, code: "invalid_challenge" };
      }
      if (q.state === "locked") return { error: 429, code: "locked" };
      if (q.state === "awaiting_send")
        return { error: 503, code: "acceptance_unverified" };
      if (q.state !== "awaiting_confirmation" || !q.challengeDigest)
        return { error: 422, code: "invalid_challenge" };
      if (
        !matches(
          this.challengeKeys.get(q.keyVersion)!,
          id,
          raw.code,
          q.challengeDigest,
        )
      ) {
        const n = q.failedAttempts + 1;
        r.db
          .prepare(
            "UPDATE privacy_requests SET failedAttempts=? WHERE requestId=?",
          )
          .run(n, id);
        if (n >= 5) this.terminate(id, "locked", now);
        return { error: n >= 5 ? 429 : 422, code: "invalid_challenge" };
      }
      const targets = r.db
        .prepare(
          "SELECT consultationId FROM privacy_request_targets WHERE requestId=?",
        )
        .all(id);
      let deadline = Infinity;
      for (const t of targets) {
        const job = queueErasure(
          r.db,
          String(t.consultationId),
          now,
          now,
          "request",
        );
        if (job)
          deadline = Math.min(
            deadline,
            Number(
              r.db
                .prepare("SELECT dueAt FROM erasure_jobs WHERE jobId=?")
                .get(job)!.dueAt,
            ),
          );
      }
      r.db
        .prepare(
          "UPDATE privacy_requests SET state='confirmed',confirmedAt=?,deadlineAt=?,challengeDigest=NULL WHERE requestId=?",
        )
        .run(now, Number.isFinite(deadline) ? deadline : now, id);
      r.db
        .prepare(
          "UPDATE privacy_mail_operations SET payloadEncrypted=NULL,proofEncrypted=NULL WHERE operationId=?",
        )
        .run(id);
      return {
        value: this.view(
          r.db
            .prepare("SELECT * FROM privacy_requests WHERE requestId=?")
            .get(id) as Row,
        ),
      };
    });
    if (result.error) throw new PrivacyError(result.error, result.code!);
    return result.value!;
  }
  terminate(id: string, state: "locked" | "expired" | "canceled", now: number) {
    const db = this.repository.db;
    db.prepare(
      "UPDATE privacy_requests SET state=?,challengeDigest=NULL,terminalAt=? WHERE requestId=? AND state NOT IN('confirmed','completed')",
    ).run(state, now, id);
    db.prepare(
      "UPDATE privacy_mail_operations SET payloadEncrypted=NULL,proofEncrypted=NULL,state='canceled',leaseUntil=NULL WHERE operationId=?",
    ).run(id);
  }
  cleanup() {
    const r = this.repository;
    return r.tx(() => cleanupPrivacy(r.db, r.clock()));
  }
}
