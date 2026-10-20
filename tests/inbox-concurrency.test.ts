import test from "node:test";
import assert from "node:assert/strict";
import {
  inboxFixture,
  receive,
  input,
} from "./fixtures/inbox-service/helpers.ts";
import { InboxRepository } from "../server/inbox/sqlite-repository.ts";
import { ReplyWorker } from "../server/inbox/worker.ts";
import { join } from "node:path";
test("two repository connections and workers never send one intent twice", async () => {
  const f = await inboxFixture();
  let second: InboxRepository | undefined;
  try {
    second = new InboxRepository(
      f.repository,
      join(f.dir, "contact.sqlite"),
      f.crypto,
      f.csrfKey,
      "synthetic@example.com",
    );
    const { id } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    const other = new ReplyWorker(second, f.mail);
    await Promise.all([f.worker.tick(), other.tick()]);
    assert.equal(f.mail.calls, 1);
    assert.equal(f.service.detail(f.token, id).replies.length, 1);
    assert.equal(f.service.send(f.token, id, i).replay, true);
  } finally {
    second?.close();
    f.cleanup();
  }
});
test("old lease result is fenced, new lease reconciles without resending", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    const first = f.repo.claim(86400000)!;
    const accepted = await f.mail.send(
      {
        ...f.repo.payload(first.operation),
        deliveryId: first.operation.deliveryId,
        payloadDigest: first.operation.payloadHash,
      },
      new AbortController().signal,
    );
    f.setTime(f.time() + 30001);
    const second = f.repo.claim(86400000)!;
    assert.equal(second.kind, "lookup");
    f.repo.settle(first.operation, accepted);
    assert.equal(f.repo.op(i.operationId)!.state, "unknown");
    f.repo.settle(second.operation, accepted);
    assert.equal(f.repo.op(i.operationId)!.state, "accepted");
    assert.equal(f.mail.calls, 1);
  } finally {
    f.cleanup();
  }
});
import { spawn } from "node:child_process";
test("two independent processes register same authenticated intent once", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id),
      payload = {
        directory: f.dir,
        now: f.time(),
        key: f.crypto.keys.get("v1")!.toString("hex"),
        token: f.token,
        consultationId: id,
        input: i,
      };
    const run = () =>
      new Promise<any>((resolve, reject) => {
        const child = spawn(
          process.execPath,
          [
            "--experimental-strip-types",
            "tests/fixtures/inbox-service/writer.ts",
          ],
          { stdio: ["pipe", "pipe", "pipe"] },
        );
        let result = "",
          error = "";
        child.stdout.on("data", (c) => (result += c));
        child.stderr.on("data", (c) => (error += c));
        child.on("error", reject);
        child.on("exit", (code) =>
          code === 0
            ? resolve(JSON.parse(result))
            : reject(Error("Synthetic writer failed: " + error.slice(0, 200))),
        );
        child.stdin.end(JSON.stringify(payload));
      });
    const results = await Promise.all([run(), run()]);
    assert.deepEqual(results.map((r) => r.replay).sort(), [false, true]);
    assert.equal(
      f.repo.db.prepare("SELECT count(*) n FROM reply_operations").get()!.n,
      1,
    );
    await f.worker.tick();
    assert.equal(f.mail.calls, 1);
  } finally {
    f.cleanup();
  }
});
