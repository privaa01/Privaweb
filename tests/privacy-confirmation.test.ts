import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { privacyFixture, receive } from "./helpers/privacy-fixtures.ts";
import { PrivacyService } from "../server/privacy/service.ts";
import { PrivacyMailWorker } from "../server/privacy/mail-worker.ts";
test("V05/V06 code scope, one use, explicit confirmation and 24h deadline", async () => {
  const f = await privacyFixture();
  try {
    const { id } = receive(f),
      service = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      ),
      worker = new PrivacyMailWorker(service, f.confirmationMail),
      requestId = randomUUID();
    service.create(f.token, { requestId, targets: [{ id, revision: 1 }] });
    await worker.tick();
    const code = f.confirmationMail.payloads[0].text.match(/[A-Z2-7]{16}/)![0];
    const result = service.confirm(f.token, requestId, { code });
    assert.equal(result.deadlineAt, f.time() + 86400000);
    assert.equal(
      f.p.db.prepare("SELECT lifecycle FROM consultations WHERE id=?").get(id)!
        .lifecycle,
      "deleting",
    );
    assert.throws(() => service.confirm(f.token, requestId, { code }));
    assert(!JSON.stringify(service.status(f.token, requestId)).includes(code));
    await f.privacyWorker.tick();
    assert.equal(
      f.p.db.prepare("SELECT count(*) n FROM consultations").get()!.n,
      0,
    );
  } finally {
    f.cleanup();
  }
});

test("wrong attempts commit, fifth locks; no tampered scopes or target destinations", async () => {
  const f = await privacyFixture();
  try {
    const { id } = receive(f),
      s = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      ),
      w = new PrivacyMailWorker(s, f.confirmationMail),
      requestId = randomUUID();
    s.create(f.token, { requestId, targets: [{ id, revision: 1 }] });
    await w.tick();
    for (let n = 1; n <= 5; n++) {
      assert.throws(() =>
        s.confirm(f.token, requestId, { code: "AAAAAAAAAAAAAAAA" }),
      );
      assert.equal(
        f.p.db.prepare("SELECT failedAttempts FROM privacy_requests").get()!
          .failedAttempts,
        n,
      );
    }
    assert.equal(s.status(f.token, requestId).state, "locked");
    assert.equal(
      f.p.db.prepare("SELECT challengeDigest FROM privacy_requests").get()!
        .challengeDigest,
      null,
    );
    assert(f.p.db.prepare("SELECT 1 FROM consultations WHERE id=?").get(id));
    assert.throws(() =>
      s.create(f.token, {
        requestId: randomUUID(),
        targets: [{ id, revision: 1 }],
        email: "attacker@example.com",
      }),
    );
  } finally {
    f.cleanup();
  }
});
test("lost HTTP retry uses same scope, no duplicate code or quota, and unknown cannot confirm", async () => {
  const f = await privacyFixture();
  try {
    const { id } = receive(f),
      s = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      ),
      requestId = randomUUID(),
      body = { requestId, targets: [{ id, revision: 1 }] };
    assert.deepEqual(s.create(f.token, body), s.create(f.token, body));
    assert.equal(
      f.p.db.prepare("SELECT count(*) n FROM privacy_mail_operations").get()!.n,
      1,
    );
    assert.throws(
      () => s.confirm(f.token, requestId, { code: "AAAAAAAAAAAAAAAA" }),
      (e) => (e as any).status === 503,
    );
    assert.equal(
      f.p.db.prepare("SELECT failedAttempts FROM privacy_requests").get()!
        .failedAttempts,
      0,
    );
    assert.throws(
      () =>
        s.create(f.token, { requestId: randomUUID(), targets: body.targets }),
      (e) => (e as any).status === 409,
    );
  } finally {
    f.cleanup();
  }
});

test("retained keys are required and rotation can confirm an older valid challenge", async () => {
  const f = await privacyFixture();
  try {
    const { id } = receive(f),
      s = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      ),
      w = new PrivacyMailWorker(s, f.confirmationMail),
      requestId = randomUUID();
    s.create(f.token, { requestId, targets: [{ id, revision: 1 }] });
    await w.tick();
    const code = f.confirmationMail.payloads[0].text.match(/[A-Z2-7]{16}/)![0];
    const { randomBytes } = await import("node:crypto");
    assert.throws(
      () =>
        new PrivacyService(
          f.p,
          new Map([["v2", randomBytes(32)]]),
          new Map([["v2", randomBytes(32)]]),
          "synthetic@example.com",
          "v2",
        ),
    );
    const rotated = new PrivacyService(
      f.p,
      new Map([
        ["v1", f.key],
        ["v2", randomBytes(32)],
      ]),
      new Map([
        ["v1", f.mailKey],
        ["v2", randomBytes(32)],
      ]),
      "synthetic@example.com",
      "v2",
    );
    assert.equal(
      rotated.confirm(f.token, requestId, { code }).state,
      "confirmed",
    );
  } finally {
    f.cleanup();
  }
});
