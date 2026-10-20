import test from "node:test";
import assert from "node:assert/strict";
import { statSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import {
  inboxFixture,
  receive,
  input,
} from "./fixtures/inbox-service/helpers.ts";
import { InboxRepository } from "../server/inbox/sqlite-repository.ts";
import { ReplyCrypto } from "../server/inbox/crypto.ts";
test("private files reject aliases and missing keys for retained encrypted replies", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f);
    f.service.send(f.token, id, input(f, id));
    await f.worker.tick();
    const path = join(f.dir, "contact.sqlite");
    assert.equal(statSync(path).mode & 0o077, 0);
    assert.equal(statSync(f.dir).mode & 0o077, 0);
    const alias = join(f.dir, "alias.sqlite");
    symlinkSync(path, alias);
    assert.throws(
      () =>
        new InboxRepository(
          f.repository,
          alias,
          f.crypto,
          f.csrfKey,
          "synthetic@example.com",
        ),
    );
    assert.throws(
      () =>
        new InboxRepository(
          f.repository,
          path,
          new ReplyCrypto(new Map([["v2", randomBytes(32)]]), "v2"),
          f.csrfKey,
          "synthetic@example.com",
        ),
    );
  } finally {
    f.cleanup();
  }
});
test("unverified provider proof cannot create accepted response", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    f.mail.verify = () => false;
    await f.worker.tick();
    assert.equal(f.repo.op(i.operationId)!.state, "unknown");
    assert.equal(f.service.detail(f.token, id).replies.length, 0);
    assert.equal(f.repo.consultation(id).status, "Pendiente");
  } finally {
    f.cleanup();
  }
});
test("semantic replay is independent of JSON key ordering and extra destinations rejected", async () => {
  const f = await inboxFixture();
  try {
    const { id } = receive(f),
      i = input(f, id);
    f.service.send(f.token, id, i);
    assert.equal(
      f.service.send(f.token, id, {
        retryOf: i.retryOf,
        text: i.text,
        reviewedRevision: i.reviewedRevision,
        expectedRevision: i.expectedRevision,
        operationId: i.operationId,
      }).replay,
      true,
    );
    assert.throws(() =>
      f.service.send(f.token, id, { ...i, to: "other@example.com" }),
    );
    assert.equal(f.mail.calls, 0);
  } finally {
    f.cleanup();
  }
});
