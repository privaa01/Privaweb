import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { privacyFixture, receive } from "./helpers/privacy-fixtures.ts";
import { PrivacyService } from "../server/privacy/service.ts";
import { PrivacyMailWorker } from "../server/privacy/mail-worker.ts";
test("authorization and scope reject unknown users, mixed recipients, duplicates and injected objects", async () => {
  const f = await privacyFixture();
  try {
    const a = receive(f),
      b = receive(f),
      s = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      );
    assert.throws(() =>
      s.create(undefined, {
        requestId: randomUUID(),
        targets: [{ id: a.id, revision: 1 }],
      }),
    );
    f.p.db
      .prepare("UPDATE consultations SET email=? WHERE id=?")
      .run("other@example.com", b.id);
    assert.throws(() =>
      s.create(f.token, {
        requestId: randomUUID(),
        targets: [
          { id: a.id, revision: 1 },
          { id: b.id, revision: 1 },
        ],
      }),
    );
    assert.throws(() =>
      s.create(f.token, {
        requestId: randomUUID(),
        targets: [
          { id: a.id, revision: 1 },
          { id: a.id, revision: 1 },
        ],
      }),
    );
    assert.throws(() =>
      s.create(f.token, {
        requestId: randomUUID(),
        targets: [{ id: a.id, revision: 1, code: "<script>" }],
      }),
    );
    assert.equal(
      f.p.db.prepare("SELECT count(*) n FROM privacy_requests").get()!.n,
      0,
    );
  } finally {
    f.cleanup();
  }
});
test("deleting conversation retires original receipt and purges linked confirmation payloads", async () => {
  const f = await privacyFixture();
  try {
    const x = receive(f),
      s = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      ),
      w = new PrivacyMailWorker(s, f.confirmationMail),
      requestId = randomUUID();
    s.create(f.token, { requestId, targets: [{ id: x.id, revision: 1 }] });
    await w.tick();
    f.contact.revoke(x.id);
    assert.equal(f.contact.submit(x.attempt, x.data).result, "retired");
    await f.privacyWorker.tick();
    assert.equal(
      f.p.db
        .prepare("SELECT payloadEncrypted FROM privacy_mail_operations")
        .get()!.payloadEncrypted,
      null,
    );
    assert.equal(
      f.p.db.prepare("SELECT challengeDigest FROM privacy_requests").get()!
        .challengeDigest,
      null,
    );
    assert.equal(s.status(f.token, requestId).state, "canceled");
  } finally {
    f.cleanup();
  }
});
test("new confirmation cannot extend earlier retention deadline or modify stored activity", async () => {
  const f = await privacyFixture();
  try {
    const { x } = { x: receive(f) },
      s = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      ),
      w = new PrivacyMailWorker(s, f.confirmationMail),
      requestId = randomUUID();
    const date = new Date(f.time() - 90 * 86400000 + 60000).toISOString();
    f.p.db
      .prepare(
        "UPDATE consultations SET receivedAt=?,lastActivityAt=? WHERE id=?",
      )
      .run(date, date, x.id);
    s.create(f.token, { requestId, targets: [{ id: x.id, revision: 1 }] });
    await w.tick();
    const code = f.confirmationMail.payloads[0].text.match(/[A-Z2-7]{16}/)![0];
    const result = s.confirm(f.token, requestId, { code });
    assert.equal(result.deadlineAt, f.time() + 60000 + 3600000);
    assert.equal(
      f.p.db.prepare("SELECT lastActivityAt FROM consultations").get()!
        .lastActivityAt,
      date,
    );
  } finally {
    f.cleanup();
  }
});
