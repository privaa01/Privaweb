import test from "node:test";
import assert from "node:assert/strict";
import {
  inboxFixture,
  receive,
  input,
} from "./fixtures/inbox-service/helpers.ts";
import { ReplyWorker } from "../server/inbox/worker.ts";
test("lost acceptance reconciles via lookup without resend, even after session revoked", async () => {
  const f = await inboxFixture();
  try {
    f.mail.mode = "lost";
    const { id } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    await f.worker.tick();
    assert.equal(f.repo.op(i.operationId)!.state, "unknown");
    assert.equal(
      f.service.detail(f.token, id).consultation.status,
      "Pendiente",
    );
    f.repository.logout(f.token);
    f.setTime(f.time() + 2001);
    await new ReplyWorker(f.repo, f.mail).tick();
    assert.equal(f.repo.op(i.operationId)!.state, "accepted");
    assert.equal(f.mail.calls, 1);
    assert.equal(f.mail.lookups, 1);
    assert.equal(f.service.detail(f.token2, id).replies.length, 1);
  } finally {
    f.cleanup();
  }
});
test("post-provider commit failure uses expired lease lookup instead of resend", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    f.repo.failure = (s) => {
      if (s === "beforeSettlement") throw Error("synthetic disk failure");
    };
    await assert.rejects(f.worker.tick());
    assert.equal(f.mail.calls, 1);
    f.repo.failure = undefined;
    f.setTime(f.time() + 30001);
    await f.worker.tick();
    assert.equal(f.repo.op(i.operationId)!.state, "accepted");
    assert.equal(f.mail.calls, 1);
  } finally {
    f.cleanup();
  }
});
test("rejected first reply and failed additional reply preserve correct state", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.mail.mode = "rejected";
    f.service.send(f.token, id, i);
    await f.worker.tick();
    assert.equal(
      f.service.detail(f.token, id).consultation.status,
      "Pendiente",
    );
    f.mail.mode = "accepted";
    f.service.send(f.token, id, { ...input(f, id), retryOf: i.operationId });
    await f.worker.tick();
    const activity = f.service.detail(f.token, id).consultation.lastActivityAt;
    f.mail.mode = "rejected";
    f.service.send(f.token, id, input(f, id, "Adicional fallida"));
    await f.worker.tick();
    assert.equal(
      f.service.detail(f.token, id).consultation.status,
      "Respondido",
    );
    assert.equal(
      f.service.detail(f.token, id).consultation.lastActivityAt,
      activity,
    );
  } finally {
    f.cleanup();
  }
});
test("unknown stays blocked past dedup window; no not-found rejection", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.mail.mode = "unknown";
    f.service.send(f.token, id, i);
    await f.worker.tick();
    f.setTime(f.time() + 2 * 86400000);
    await f.worker.tick();
    assert.equal(f.repo.op(i.operationId)!.state, "unknown");
    assert.equal(f.mail.calls, 1);
    assert.throws(() =>
      f.repo.authorized(f.token, () =>
        f.repo.enqueue(f.token, id, input(f, id), f.one.account.id),
      ),
    );
  } finally {
    f.cleanup();
  }
});
test("revocation before dispatch cancels instead of sending", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    f.repository.logout(f.token);
    await f.worker.tick();
    assert.equal(f.repo.op(i.operationId)!.state, "canceled");
    assert.equal(f.mail.calls, 0);
  } finally {
    f.cleanup();
  }
});
