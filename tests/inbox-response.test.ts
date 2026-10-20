import test from "node:test";
import assert from "node:assert/strict";
import {
  inboxFixture,
  receive,
  input,
} from "./fixtures/inbox-service/helpers.ts";
test("accepted reply is durable, private and linked to stored recipient; Q1 adds history", async () => {
  const f = await inboxFixture();
  try {
    const { id, attempt, data } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    assert.equal(
      f.service.detail(f.token, id).consultation.status,
      "Pendiente",
    );
    assert.equal(f.service.send(f.token, id, i).replay, true);
    await f.worker.tick();
    assert.equal(f.mail.calls, 1);
    assert.equal(f.mail.payloads[0].to, data.email);
    let d = f.service.detail(f.token, id);
    assert.equal(d.consultation.status, "Respondido");
    assert.equal(d.replies[0].text, i.text);
    assert.equal(f.contact.submit(attempt, data).result, "stored");
    assert.equal(f.service.send(f.token, id, i).replay, true);
    f.setTime(f.time() + 1000);
    f.service.send(f.token, id, input(f, id, "Adicional"));
    await f.worker.tick();
    d = f.service.detail(f.token, id);
    assert.equal(d.replies.length, 2);
    assert.equal(f.service.summary(f.token).summary.total, 1);
    assert.equal(f.service.detail(f.token2, id).replies.length, 2);
    assert.throws(() => f.service.detail(undefined, id));
  } finally {
    f.cleanup();
  }
});
test("stale revisions, operation conflicts and unresolved operation block second send", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    assert.throws(() => f.service.send(f.token, id, { ...i, text: "other" }));
    assert.throws(() =>
      f.service.send(f.token2, id, {
        ...input(f, id),
        expectedRevision: i.expectedRevision,
        reviewedRevision: i.reviewedRevision,
      }),
    );
    assert.throws(() => f.service.send(f.token, id, input(f, id)));
    assert.equal(f.mail.calls, 0);
  } finally {
    f.cleanup();
  }
});
import { InboxRepository } from "../server/inbox/sqlite-repository.ts";
import { InboxService } from "../server/inbox/service.ts";
import { join } from "node:path";
test("accepted history decrypts after closing and reopening SQLite repository", async () => {
  const f = await inboxFixture();
  let reopened: InboxRepository | undefined;
  try {
    const { id } = receive(f);
    f.service.send(f.token, id, input(f, id, "Respuesta durable"));
    await f.worker.tick();
    f.repo.close();
    reopened = new InboxRepository(
      f.repository,
      join(f.dir, "contact.sqlite"),
      f.crypto,
      f.csrfKey,
      "synthetic@example.com",
    );
    assert.equal(
      new InboxService(reopened).detail(f.token2, id).replies[0].text,
      "Respuesta durable",
    );
  } finally {
    reopened?.close();
    f.cleanup();
  }
});
