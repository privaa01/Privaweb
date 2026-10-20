import test from "node:test";
import assert from "node:assert/strict";
import {
  inboxFixture,
  receive,
  input,
} from "./fixtures/inbox-service/helpers.ts";
test("read, rejection and replay do not extend activity; restore sweep removes expired records", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    const initial = f.repo.consultation(id).lastActivityAt;
    f.setTime(f.time() + 1000);
    f.mail.mode = "rejected";
    f.service.send(f.token, id, i);
    await f.worker.tick();
    assert.equal(f.repo.consultation(id).lastActivityAt, initial);
    f.service.send(f.token, id, i);
    assert.equal(f.repo.consultation(id).lastActivityAt, initial);
    f.setTime(f.time() + 90 * 86400000);
    assert.equal(f.repo.purgeExpired(), 1);
    assert.equal(
      f.repo.db.prepare("SELECT count(*) n FROM reply_operations").get()!.n,
      0,
    );
  } finally {
    f.cleanup();
  }
});
test("deletion during external call never recreates consultation or retained payload", async () => {
  const f = await inboxFixture();
  try {
    const { id, attempt, data } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    const send = f.mail.send.bind(f.mail);
    f.mail.send = async (...args) => {
      const result = await send(...args);
      f.contact.revoke(id);
      return result;
    };
    await f.worker.tick();
    assert.equal(f.mail.calls, 1);
    assert.equal(f.contact.submit(attempt, data).result, "retired");
    assert.equal(f.repo.op(i.operationId), undefined);
    assert.equal(
      f.repo.db.prepare("SELECT count(*) n FROM reply_responses").get()!.n,
      0,
    );
    assert.equal(
      f.repo.db.prepare("SELECT count(*) n FROM consultations").get()!.n,
      0,
    );
  } finally {
    f.cleanup();
  }
});
test("new acceptance extends activity only once using actual acceptance time", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.setTime(f.time() + 3000);
    f.service.send(f.token, id, i);
    await f.worker.tick();
    const date = f.repo.consultation(id).lastActivityAt;
    assert.equal(Date.parse(date), f.time());
    f.setTime(f.time() + 3000);
    f.service.send(f.token, id, i);
    assert.equal(f.repo.consultation(id).lastActivityAt, date);
  } finally {
    f.cleanup();
  }
});
