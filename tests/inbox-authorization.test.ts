import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { digest } from "../server/admin/sessions.ts";
import {
  inboxFixture,
  receive,
  input,
} from "./fixtures/inbox-service/helpers.ts";
test("auth lock excludes another process revocation until contact commit", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f);
    const code = `import {DatabaseSync} from 'node:sqlite';const db=new DatabaseSync(process.argv[1]);db.exec('PRAGMA busy_timeout=10');try{db.prepare('UPDATE admin_sessions SET revokedAt=1 WHERE tokenDigest=?').run(process.argv[2]);process.stdout.write('revoked')}catch{process.stdout.write('blocked')}finally{db.close()}`;
    const run = () =>
      spawnSync(
        process.execPath,
        ["--input-type=module", "-e", code, f.repository.path, digest(f.token)],
        { encoding: "utf8" },
      );
    f.repo.authorized(f.token, () => {
      assert.equal(run().stdout, "blocked");
      f.repo.consultation(id);
    });
    assert.equal(run().stdout, "revoked");
    assert.throws(() => f.service.detail(f.token, id));
  } finally {
    f.cleanup();
  }
});
test("commit uncertainty recovers same intent without duplicated write or send", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.repo.failure = (s) => {
      if (s === "afterContactCommit")
        throw Error("synthetic post-commit failure");
    };
    assert.throws(() => f.service.send(f.token, id, i));
    f.repo.failure = undefined;
    assert.equal(f.service.send(f.token, id, i).replay, true);
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
test("transaction rejects async effects and unauthorized/expired reads", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f);
    assert.throws(() => f.repo.tx(() => Promise.resolve(1)));
    assert.throws(() => f.service.detail(undefined, id));
    assert.throws(() => f.service.detail("bad", id));
    f.setTime(f.time() + 31 * 60000);
    assert.throws(() => f.service.detail(f.token, id));
  } finally {
    f.cleanup();
  }
});
