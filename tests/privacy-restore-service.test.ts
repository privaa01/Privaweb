import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { privacyFixture, receive, input } from "./helpers/privacy-fixtures.ts";
import { PrivacyService } from "../server/privacy/service.ts";
import { PrivacyMailWorker } from "../server/privacy/mail-worker.ts";
test("V10 dispatch reserved before deletion may complete but late acceptance cannot recreate erased data", async () => {
  const f = await privacyFixture();
  try {
    const { id } = receive(f),
      s = new PrivacyService(
        f.p,
        f.key,
        f.mailKey,
        "synthetic-confirmation@example.com",
      ),
      mail = new PrivacyMailWorker(s, f.confirmationMail),
      requestId = randomUUID();
    s.create(f.token, { requestId, targets: [{ id, revision: 1 }] });
    await mail.tick();
    const code = f.confirmationMail.payloads[0].text.match(/[A-Z2-7]{16}/)![0];
    f.service.send(f.token, id, input(f, id));
    const send = f.mail.send.bind(f.mail);
    f.mail.send = async (...args) => {
      const accepted = await send(...args);
      s.confirm(f.token, requestId, { code });
      await f.privacyWorker.tick();
      return accepted;
    };
    await f.worker.tick();
    assert.equal(f.mail.calls, 1);
    assert.equal(
      f.p.db.prepare("SELECT count(*) n FROM consultations").get()!.n,
      0,
    );
    assert.equal(
      f.p.db.prepare("SELECT count(*) n FROM reply_responses").get()!.n,
      0,
    );
    assert.equal(
      f.p.db.prepare("SELECT count(*) n FROM reply_operations").get()!.n,
      0,
    );
    assert.equal(await f.worker.tick(), false);
  } finally {
    f.cleanup();
  }
});
