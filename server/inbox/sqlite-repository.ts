import { DatabaseSync } from "node:sqlite";
import { lstatSync, realpathSync, chmodSync } from "node:fs";
import { isAbsolute, dirname } from "node:path";
import {
  randomUUID,
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import type { SqliteAdminRepository } from "../admin/sqlite-repository.ts";
import { digest } from "../admin/sessions.ts";
import {
  initializeContactSchema,
  removeConsultation,
} from "../contact/schema.ts";
import {
  InboxError,
  type Consultation,
  type ReplyOperation,
  type ReplyInput,
} from "../../src/lib/inbox-contract.ts";
import { ReplyCrypto } from "./crypto.ts";
import type { MailResult, ReplyPayload } from "./mail-adapter.ts";
import { RETENTION } from "./repository.ts";
type Row = Record<string, any>;
export class InboxRepository {
  db: DatabaseSync;
  closed = false;
  admin: SqliteAdminRepository;
  crypto: ReplyCrypto;
  cursorKey: Buffer;
  sender: string;
  subject: string;
  failure?: (stage: string) => void;
  constructor(
    admin: SqliteAdminRepository,
    path: string,
    crypto: ReplyCrypto,
    cursorKey: Buffer,
    sender: string,
    subject = "Respuesta a tu consulta de Priva",
    failure?: (stage: string) => void,
  ) {
    this.admin = admin;
    this.crypto = crypto;
    this.cursorKey = cursorKey;
    this.sender = sender;
    this.subject = subject;
    this.failure = failure;
    if (
      !isAbsolute(path) ||
      /[\r\n]/.test(sender) ||
      !/^\S+@\S+\.\S+$/.test(sender) ||
      /[\r\n]/.test(subject)
    )
      throw Error("Invalid reply configuration");
    for (const f of [dirname(path), path, path + "-wal", path + "-shm"]) {
      let st;
      try {
        st = lstatSync(f);
      } catch (e) {
        if (
          f !== path &&
          f !== dirname(path) &&
          (e as NodeJS.ErrnoException).code === "ENOENT"
        )
          continue;
        throw e;
      }
      if (
        st.isSymbolicLink() ||
        realpathSync(f) !== f ||
        st.mode & 0o077 ||
        (f === dirname(path) ? !st.isDirectory() : !st.isFile())
      )
        throw Error("Unsafe inbox path");
    }
    const mask = process.umask(0o077);
    try {
      this.db = new DatabaseSync(path);
    } finally {
      process.umask(mask);
    }
    try {
      this.db.exec(
        "PRAGMA journal_mode=WAL;PRAGMA synchronous=FULL;PRAGMA foreign_keys=ON;PRAGMA busy_timeout=5000",
      );
      initializeContactSchema(this.db);
      chmodSync(path, 0o600);
      // Fail at composition if any retained payload has lost its key or authentication.
      for (const row of this.db
        .prepare("SELECT * FROM reply_operations WHERE envelope IS NOT NULL")
        .all() as Row[])
        this.payload(row as ReplyOperation);
      for (const row of this.db
        .prepare(
          "SELECT o.*,r.envelope AS retainedEnvelope FROM reply_responses r JOIN reply_operations o ON o.operationId=r.operationId",
        )
        .all() as Row[]) {
        if (row.retainedEnvelope)
          this.crypto.open(
            this.aad(row as ReplyOperation),
            row.retainedEnvelope,
          );
      }
    } catch (error) {
      this.db.close();
      this.closed = true;
      throw error;
    }
  }
  now() {
    return this.admin.clock();
  }
  tx<T>(fn: () => T): T {
    if (fn.constructor.name === "AsyncFunction")
      throw Error("Async inbox transaction forbidden");
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const value = fn();
      if (value && typeof (value as any).then === "function")
        throw Error("Async inbox transaction forbidden");
      this.db.exec("COMMIT");
      return value;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  authorized<T>(
    token: string | undefined,
    fn: (accountId: string) => T,
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
  close() {
    if (!this.closed) {
      this.closed = true;
      this.db.close();
    }
  }
  consultation(id: string): Consultation {
    const c = this.db
      .prepare("SELECT * FROM consultations WHERE id=? AND lifecycle='active'")
      .get(id) as unknown as Consultation | undefined;
    if (
      !c ||
      !Number.isFinite(Date.parse(c.lastActivityAt)) ||
      Date.parse(c.lastActivityAt) + RETENTION <= this.now()
    )
      throw new InboxError(404, "not_found");
    return c;
  }
  op(id: string) {
    return this.db
      .prepare("SELECT * FROM reply_operations WHERE operationId=?")
      .get(id) as unknown as ReplyOperation | undefined;
  }
  aad(
    o: Pick<
      ReplyOperation,
      "operationId" | "consultationId" | "actorAccountId" | "deliveryId"
    >,
  ) {
    return [
      o.operationId,
      o.consultationId,
      o.actorAccountId,
      o.deliveryId,
    ].join(":");
  }
  payload(o: ReplyOperation): ReplyPayload {
    let envelope = o.envelope;
    if (!envelope)
      envelope = (
        this.db
          .prepare("SELECT envelope FROM reply_responses WHERE operationId=?")
          .get(o.operationId) as Row | undefined
      )?.envelope;
    if (!envelope) throw Error("Reply payload unavailable");
    return this.crypto.open(this.aad(o), envelope);
  }
  private cutoff() {
    return new Date(this.now() - RETENTION).toISOString();
  }
  summary() {
    const row = this.db
      .prepare(
        "SELECT count(*) total,coalesce(sum(status='Pendiente'),0) pending,coalesce(sum(status='Respondido'),0) responded FROM consultations WHERE lifecycle='active' AND lastActivityAt>?",
      )
      .get(this.cutoff())!;
    return {
      total: Number(row.total),
      pending: Number(row.pending),
      responded: Number(row.responded),
    };
  }
  cursor(v: unknown) {
    const encoded = Buffer.from(JSON.stringify(v)).toString("base64url");
    return (
      encoded +
      "." +
      createHmac("sha256", this.cursorKey).update(encoded).digest("base64url")
    );
  }
  decode(cursor: unknown): Row | null {
    if (cursor === null) return null;
    if (typeof cursor !== "string" || cursor.length > 2048)
      throw new InboxError(422, "cursor");
    const [text, signature, ...rest] = cursor.split(".");
    const expected = createHmac("sha256", this.cursorKey)
      .update(text)
      .digest("base64url");
    if (
      rest.length ||
      !signature ||
      signature.length !== expected.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    )
      throw new InboxError(422, "cursor");
    try {
      const o = JSON.parse(Buffer.from(text, "base64url").toString());
      if (!o || typeof o !== "object") throw Error();
      return o;
    } catch {
      throw new InboxError(422, "cursor");
    }
  }
  list(status: unknown, cursor: unknown, limit: unknown) {
    if (
      !["Pendiente", "Respondido"].includes(String(status)) ||
      ![25, 50].includes(Number(limit)) ||
      typeof limit !== "number"
    )
      throw new InboxError(422, "validation");
    const last = this.decode(cursor);
    if (
      last &&
      (last.kind !== "list" ||
        last.status !== status ||
        typeof last.date !== "string" ||
        typeof last.id !== "string")
    )
      throw new InboxError(422, "cursor");
    const rows = this.db
      .prepare(
        "SELECT * FROM consultations WHERE lifecycle='active' AND lastActivityAt>? AND status=? AND (? IS NULL OR receivedAt<? OR (receivedAt=? AND id<?)) ORDER BY receivedAt DESC,id DESC LIMIT ?",
      )
      .all(
        this.cutoff(),
        String(status),
        last?.date ?? null,
        last?.date ?? null,
        last?.date ?? null,
        last?.id ?? null,
        Number(limit) + 1,
      ) as Row[];
    const hasMore = rows.length > Number(limit),
      items = rows.slice(0, Number(limit)).map((c) => ({
        id: c.id,
        nameOrAlias: c.nameOrAlias,
        email: c.email,
        messagePreview: [...c.message].slice(0, 160).join(""),
        receivedAt: c.receivedAt,
        status: c.status,
        revision: c.revision,
      })),
      tail = items.at(-1);
    return {
      result: "list",
      items,
      nextCursor:
        hasMore && tail
          ? this.cursor({
              kind: "list",
              status,
              date: tail.receivedAt,
              id: tail.id,
            })
          : null,
      summary: this.summary(),
    };
  }
  history(id: string, cursor: unknown) {
    const c = this.consultation(id),
      last = this.decode(cursor);
    if (last && (last.kind !== "history" || last.consultationId !== id))
      throw new InboxError(422, "cursor");
    if (last && last.revision !== c.revision)
      throw new InboxError(409, "revision_conflict");
    const rows = this.db
      .prepare(
        "SELECT * FROM reply_responses WHERE consultationId=? AND (? IS NULL OR acceptedAt>? OR (acceptedAt=? AND id>?)) ORDER BY acceptedAt,id LIMIT 26",
      )
      .all(
        id,
        last?.date ?? null,
        last?.date ?? null,
        last?.date ?? null,
        last?.id ?? null,
      ) as Row[];
    const replies = rows.slice(0, 25).map((r) => {
        const o = this.op(r.operationId)!;
        return {
          id: r.id,
          text: this.crypto.open<ReplyPayload>(this.aad(o), r.envelope).text,
          acceptedAt: r.acceptedAt,
          authorLabel: "Equipo Priva",
        };
      }),
      tail = replies.at(-1);
    return {
      result: "history",
      revision: c.revision,
      replies,
      nextCursor:
        rows.length > 25 && tail
          ? this.cursor({
              kind: "history",
              consultationId: id,
              revision: c.revision,
              date: tail.acceptedAt,
              id: tail.id,
            })
          : null,
    };
  }
  operation(id: string) {
    const o = this.op(id);
    if (!o) throw new InboxError(404, "not_found");
    const c = this.consultation(o.consultationId);
    return {
      result: "operation",
      operationId: id,
      consultationId: o.consultationId,
      state: o.state,
      revision: c.revision,
      text: this.payload(o).text,
      ...(o.acceptedAt === null
        ? {}
        : {
            acceptedAt: o.acceptedAt,
            responseId: (
              this.db
                .prepare("SELECT id FROM reply_responses WHERE operationId=?")
                .get(id) as Row | undefined
            )?.id,
          }),
    };
  }
  detail(id: string) {
    const consultation = this.consultation(id),
      h = this.history(id, null);
    const o = this.db
      .prepare(
        "SELECT operationId FROM reply_operations WHERE consultationId=? AND state IN('queued','dispatching','unknown')",
      )
      .get(id);
    return {
      result: "detail",
      consultation,
      replies: h.replies,
      nextRepliesCursor: h.nextCursor,
      currentOperation: o ? this.operation(String(o.operationId)) : null,
    };
  }
  enqueue(token: string, id: string, input: ReplyInput, accountId: string) {
    const hash = createHash("sha256")
        .update(
          JSON.stringify([
            id,
            accountId,
            input.operationId,
            input.expectedRevision,
            input.reviewedRevision,
            input.text,
            input.retryOf,
          ]),
        )
        .digest("hex"),
      old = this.op(input.operationId);
    this.consultation(id);
    if (old) {
      if (old.consultationId !== id || old.payloadHash !== hash)
        throw new InboxError(409, "operation_conflict");
      return { replay: true, ...this.operation(old.operationId) };
    }
    const c = this.consultation(id);
    if (
      c.revision !== input.expectedRevision ||
      input.reviewedRevision !== c.revision
    )
      throw new InboxError(409, "revision_conflict");
    if (
      this.db
        .prepare(
          "SELECT 1 FROM reply_operations WHERE consultationId=? AND state IN('queued','dispatching','unknown')",
        )
        .get(id)
    )
      throw new InboxError(409, "unresolved_operation");
    if (input.retryOf) {
      const previous = this.op(input.retryOf);
      if (
        !previous ||
        previous.consultationId !== id ||
        previous.state !== "rejected"
      )
        throw new InboxError(409, "operation_conflict");
    }
    const now = this.now(),
      deliveryId = randomUUID(),
      o = {
        operationId: input.operationId,
        consultationId: id,
        actorAccountId: accountId,
        deliveryId,
      };
    const envelope = this.crypto.seal(this.aad(o), {
      to: c.email,
      from: this.sender,
      subject: this.subject,
      text: input.text,
    });
    this.db
      .prepare(
        "INSERT INTO reply_operations(operationId,consultationId,actorAccountId,sessionDigest,expectedRevision,reviewedRevision,retryOf,payloadHash,deliveryId,envelope,state,createdAt,updatedAt) VALUES(?,?,?,?,?,?,?,?,?,?,'queued',?,?)",
      )
      .run(
        input.operationId,
        id,
        accountId,
        digest(token),
        input.expectedRevision,
        input.reviewedRevision,
        input.retryOf,
        hash,
        deliveryId,
        envelope,
        now,
        now,
      );
    this.db
      .prepare("UPDATE consultations SET revision=revision+1 WHERE id=?")
      .run(id);
    return {
      replay: false,
      result: "registered",
      operationId: input.operationId,
      state: "queued",
      revision: c.revision + 1,
    };
  }
  claim(
    windowMs: number,
  ): { operation: ReplyOperation; kind: "send" | "lookup" } | null {
    return this.admin.transaction(() =>
      this.tx(() => {
        const now = this.now();
        this.db
          .prepare(
            "UPDATE reply_operations SET state='unknown',updatedAt=?,leaseUntil=NULL,nextLookupAt=? WHERE state='dispatching' AND leaseUntil<=?",
          )
          .run(now, now, now);
        const candidates = this.db
          .prepare(
            "SELECT * FROM reply_operations WHERE state IN('queued','unknown') AND nextLookupAt<=? AND (leaseUntil IS NULL OR leaseUntil<=?) ORDER BY createdAt LIMIT 20",
          )
          .all(now, now) as unknown as ReplyOperation[];
        for (const o of candidates) {
          let c;
          try {
            c = this.consultation(o.consultationId);
          } catch {
            removeConsultation(this.db, o.consultationId);
            continue;
          }
          if (o.state === "queued") {
            const auth = this.admin.sessionByDigest(o.sessionDigest);
            if (!auth || auth.account.id !== o.actorAccountId) {
              this.db
                .prepare(
                  "UPDATE reply_operations SET state='canceled',updatedAt=? WHERE operationId=?",
                )
                .run(now, o.operationId);
              this.db
                .prepare(
                  "UPDATE consultations SET revision=revision+1 WHERE id=?",
                )
                .run(c.id);
              continue;
            }
          }
          const kind = o.state === "queued" ? "send" : "lookup";
          this.db
            .prepare(
              "UPDATE reply_operations SET state=?,leaseOwner=?,leaseGeneration=leaseGeneration+1,leaseUntil=?,dispatchStartedAt=coalesce(dispatchStartedAt,?),providerKeyExpiry=coalesce(providerKeyExpiry,?),updatedAt=? WHERE operationId=?",
            )
            .run(
              kind === "send" ? "dispatching" : "unknown",
              randomUUID(),
              now + 30000,
              now,
              now + windowMs,
              now,
              o.operationId,
            );
          return { operation: this.op(o.operationId)!, kind };
        }
        return null;
      }),
    );
  }
  settle(o: ReplyOperation, result: MailResult) {
    this.tx(() => {
      const current = this.op(o.operationId);
      if (
        !current ||
        current.leaseGeneration !== o.leaseGeneration ||
        current.leaseOwner !== o.leaseOwner ||
        !["dispatching", "unknown"].includes(current.state)
      )
        return;
      try {
        this.consultation(o.consultationId);
      } catch {
        removeConsultation(this.db, o.consultationId);
        return;
      }
      this.failure?.("beforeSettlement");
      const now = this.now();
      if (result.state === "accepted") {
        const payload = this.payload(current),
          responseId = randomUUID(),
          envelope = this.crypto.seal(this.aad(o), payload);
        this.db
          .prepare("INSERT INTO reply_responses VALUES(?,?,?,?,?,?)")
          .run(
            responseId,
            o.consultationId,
            o.operationId,
            o.actorAccountId,
            result.acceptedAt,
            envelope,
          );
        this.db
          .prepare(
            "UPDATE reply_operations SET state='accepted',envelope=NULL,acceptedAt=?,proof=?,leaseUntil=NULL,updatedAt=? WHERE operationId=?",
          )
          .run(
            result.acceptedAt,
            this.crypto.seal(this.aad(o), result),
            now,
            o.operationId,
          );
        const c = this.consultation(o.consultationId),
          activity = new Date(
            Math.max(
              Date.parse(c.lastActivityAt),
              Date.parse(c.receivedAt),
              result.acceptedAt,
            ),
          ).toISOString();
        this.db
          .prepare(
            "UPDATE consultations SET status='Respondido',lastActivityAt=?,revision=revision+1 WHERE id=?",
          )
          .run(activity, o.consultationId);
      } else if (result.state === "rejected") {
        this.db
          .prepare(
            "UPDATE reply_operations SET state='rejected',proof=?,rejectionCode='rejected',leaseUntil=NULL,updatedAt=? WHERE operationId=?",
          )
          .run(this.crypto.seal(this.aad(o), result), now, o.operationId);
        this.db
          .prepare("UPDATE consultations SET revision=revision+1 WHERE id=?")
          .run(o.consultationId);
      } else {
        const steps = [2000, 5000, 15000, 30000, 60000];
        this.db
          .prepare(
            "UPDATE reply_operations SET state='unknown',leaseUntil=NULL,nextLookupAt=?,lookupAttempts=lookupAttempts+1,updatedAt=? WHERE operationId=?",
          )
          .run(
            now + steps[Math.min(current.lookupAttempts, 4)],
            now,
            o.operationId,
          );
      }
    });
  }
  revoke(id: string) {
    this.tx(() => removeConsultation(this.db, id));
  }
  purgeExpired() {
    return this.tx(() => {
      const ids = this.db
        .prepare("SELECT id FROM consultations WHERE lastActivityAt<=?")
        .all(this.cutoff());
      for (const r of ids) removeConsultation(this.db, String(r.id));
      return ids.length;
    });
  }
}
