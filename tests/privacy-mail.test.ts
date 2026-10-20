import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { privacyFixture, receive } from "./helpers/privacy-fixtures.ts";
import { PrivacyService } from "../server/privacy/service.ts";
import { PrivacyMailWorker } from "../server/privacy/mail-worker.ts";
for (const mode of ["accepted", "rejected", "lost", "unknown"] as const)
  test("V08 confirmation mail " + mode + " never resends unknown", async () => {
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
      f.confirmationMail.mode = mode;
      s.create(f.token, { requestId, targets: [{ id, revision: 1 }] });
      await w.tick();
      if (mode === "lost" || mode === "unknown") {
        f.setTime(f.time() + 2000);
        await w.tick();
        assert.equal(f.confirmationMail.calls, 1);
        assert.equal(f.confirmationMail.lookups, 1);
      }
      assert.equal(
        s.status(f.token, requestId).state,
        mode === "rejected"
          ? "canceled"
          : mode === "unknown"
            ? "awaiting_send"
            : "awaiting_confirmation",
      );
      assert.equal(
        f.p.db.prepare("SELECT lastActivityAt FROM consultations").get()!
          .lastActivityAt,
        f.p.db.prepare("SELECT receivedAt FROM consultations").get()!
          .receivedAt,
      );
    } finally {
      f.cleanup();
    }
  });
test("expired code clears encrypted payload and cannot be revived by late delivery", async () => {
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
    f.confirmationMail.mode = "lost";
    await w.tick();
    f.setTime(f.time() + 1800000);
    await w.tick();
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
    assert.equal(f.confirmationMail.calls, 1);
    assert.equal(
      f.p.db.prepare("SELECT state FROM privacy_requests").get()!.state,
      "expired",
    );
    assert.throws(
      () => s.status(f.token, requestId),
      (e) => (e as any).status === 401,
    );
  } finally {
    f.cleanup();
  }
});
test("revocation before reservation cancels send; no original session bearer persisted", async () => {
  const f = await privacyFixture();
  try {
    const { id } = receive(f),
      s = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      ),
      w = new PrivacyMailWorker(s, f.confirmationMail);
    s.create(f.token, {
      requestId: randomUUID(),
      targets: [{ id, revision: 1 }],
    });
    f.repository.logout(f.token);
    await w.tick();
    assert.equal(f.confirmationMail.calls, 0);
    assert.equal(
      f.p.db.prepare("SELECT state FROM privacy_requests").get()!.state,
      "canceled",
    );
    assert(
      !JSON.stringify(
        f.p.db.prepare("SELECT * FROM privacy_mail_operations").all(),
      ).includes(f.token),
    );
  } finally {
    f.cleanup();
  }
});

test("forged proof, future acceptance or network timeout cannot enable confirmation", async () => {
  for (const mode of ["proof", "future", "timeout"]) {
    const f = await privacyFixture();
    try {
      const { id } = receive(f),
        s = new PrivacyService(
          f.p,
          f.key,
          f.mailKey,
          "synthetic-confirmation@example.com",
        ),
        requestId = randomUUID();
      s.create(f.token, { requestId, targets: [{ id, revision: 1 }] });
      const original = f.confirmationMail.send.bind(f.confirmationMail);
      f.confirmationMail.send = async (...args) => {
        if (mode === "timeout") return await new Promise(() => {});
        const result = await original(...args);
        if (result.state === "accepted")
          return {
            ...result,
            ...(mode === "proof"
              ? { evidence: "forged" }
              : { acceptedAt: f.time() + 600000 }),
          };
        return result;
      };
      const worker = new PrivacyMailWorker(s, f.confirmationMail, 10);
      await worker.tick();
      assert.equal(s.status(f.token, requestId).state, "awaiting_send");
      assert.equal(
        f.p.db.prepare("SELECT state FROM privacy_mail_operations").get()!
          .state,
        "unknown",
      );
    } finally {
      f.cleanup();
    }
  }
});

test("independent privacy worker purges expired codes even without confirmation mail worker", async () => {
  const f = await privacyFixture();
  try {
    const { id } = receive(f),
      s = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      );
    s.create(f.token, {
      requestId: randomUUID(),
      targets: [{ id, revision: 1 }],
    });
    f.setTime(f.time() + 1800000);
    await f.privacyWorker.tick();
    assert.equal(
      f.p.db.prepare("SELECT challengeDigest FROM privacy_requests").get()!
        .challengeDigest,
      null,
    );
    assert.equal(
      f.p.db
        .prepare("SELECT payloadEncrypted FROM privacy_mail_operations")
        .get()!.payloadEncrypted,
      null,
    );
    f.setTime(f.time() + 86400001);
    await f.privacyWorker.tick();
    assert.equal(
      f.p.db.prepare("SELECT count(*) n FROM privacy_requests").get()!.n,
      0,
    );
  } finally {
    f.cleanup();
  }
});
