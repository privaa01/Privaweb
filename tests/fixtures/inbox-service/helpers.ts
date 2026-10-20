import { fixture, seed } from "../admin-service/helpers.ts";
import { randomBytes, randomUUID } from "node:crypto";
import { join } from "node:path";
import { SqliteContactRepository } from "../../../server/contact/sqlite-repository.ts";
import { AttemptTokens } from "../../../server/contact/attempt-token.ts";
import { randomToken, digest } from "../../../server/admin/sessions.ts";
import { InboxRepository } from "../../../server/inbox/sqlite-repository.ts";
import { ReplyCrypto } from "../../../server/inbox/crypto.ts";
import { InboxService } from "../../../server/inbox/service.ts";
import { ReplyWorker } from "../../../server/inbox/worker.ts";
import { ControlledMail } from "./mail.ts";
export async function inboxFixture(now?: number) {
  const f = fixture();
  if (now !== undefined) f.setTime(now);
  const one = await seed(f),
    two = await seed(f, "two@example.com"),
    token = randomToken(),
    token2 = randomToken();
  f.repository.createSession(
    one.account.id,
    one.account.credentialVersion,
    digest(token),
  );
  f.repository.createSession(
    two.account.id,
    two.account.credentialVersion,
    digest(token2),
  );
  const tokens = new AttemptTokens(randomBytes(32), f.time),
    contact = new SqliteContactRepository(
      join(f.dir, "contact.sqlite"),
      tokens,
    ),
    crypto = new ReplyCrypto(new Map([["v1", randomBytes(32)]])),
    repo = new InboxRepository(
      f.repository,
      join(f.dir, "contact.sqlite"),
      crypto,
      f.csrfKey,
      "synthetic@example.com",
    ),
    service = new InboxService(repo),
    mail = new ControlledMail(f.time),
    worker = new ReplyWorker(repo, mail);
  return {
    ...f,
    crypto,
    one,
    two,
    token,
    token2,
    contact,
    tokens,
    repo,
    service,
    mail,
    worker,
    cleanup: () => {
      repo.close();
      contact.close();
      f.cleanup();
    },
  };
}
export function receive(
  f: Awaited<ReturnType<typeof inboxFixture>>,
  message = "Consulta sintética",
) {
  const a = f.tokens.issue();
  const data = {
    nameOrAlias: "Alias sintético",
    email: "visitor@example.com",
    message,
  };
  const result = f.contact.submit(a, data);
  if (result.result !== "stored") throw Error("Fixture contact failed");
  const id = String(
    f.contact.db
      .prepare("SELECT id FROM consultations ORDER BY rowid DESC LIMIT 1")
      .get()!.id,
  );
  return { id, attempt: a, data };
}
export function input(
  f: Awaited<ReturnType<typeof inboxFixture>>,
  id: string,
  text = "Respuesta sintética",
) {
  const d = f.service.detail(f.token, id);
  return {
    operationId: randomUUID(),
    expectedRevision: d.consultation.revision,
    reviewedRevision: d.consultation.revision,
    text,
    retryOf: null as string | null,
  };
}
