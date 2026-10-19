import { openAdminRuntime } from "../server/admin/runtime.ts";
import { StoriesService } from "../server/stories/service.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  storyFixture,
  create,
  complete,
  save,
  publish,
  activate,
} from "./fixtures/story-management-service/helpers.ts";
import { emptyDraft } from "../src/lib/story-management-contract.ts";
import { StoriesRepository } from "../server/stories/sqlite-repository.ts";
test("draft survives reopening repository, stable ID and same-key creation receipt", async () => {
  const f = await storyFixture();
  try {
    const b = { operationId: randomUUID(), working: emptyDraft() };
    const a = f.service.change(f.token, "create", null, b);
    assert.deepEqual(f.service.change(f.token, "create", null, b), a);
    assert.equal(
      new StoriesRepository(f.repository).get(a.storyId).working.title,
      "",
    );
    assert.equal(f.service.list(f.token).stories.length, 1);
    assert.equal(f.service.catalog().stories.length, 0);
    assert.deepEqual(f.repo.receipt(f.token, b.operationId), a);
    assert.throws(() => f.repo.receipt(f.token2, b.operationId));
  } finally {
    f.cleanup();
  }
});
test("atomic authorization, revoked/expired sessions and same permission", async () => {
  const f = await storyFixture();
  try {
    const a = create(f);
    assert.equal(f.service.get(f.token2, a.storyId).id, a.storyId);
    for (const token of [undefined, "invalid"])
      assert.throws(() => f.service.get(token, a.storyId));
    f.repository.setAuthorization(f.one.account.id, false);
    assert.throws(() => save(f, a.storyId, emptyDraft()));
    assert.equal(f.service.get(f.token2, a.storyId).revision, 1);
    f.setTime(f.time() + 3600000);
    assert.throws(() => f.service.get(f.token2, a.storyId));
  } finally {
    f.cleanup();
  }
});
test("revision conflict and reused operation key never overwrite or duplicate", async () => {
  const f = await storyFixture();
  try {
    const a = create(f),
      d = { ...emptyDraft(), title: "A" },
      op = randomUUID();
    save(f, a.storyId, d);
    assert.throws(() =>
      f.service.change(f.token2, "save", a.storyId, {
        operationId: op,
        expectedRevision: 1,
        working: { ...d, title: "B" },
      }),
    );
    const b = { operationId: randomUUID(), working: d };
    f.service.change(f.token, "create", null, b);
    assert.throws(() =>
      f.service.change(f.token, "create", null, {
        ...b,
        working: { ...d, title: "C" },
      }),
    );
    assert.equal(f.service.get(f.token, a.storyId).working.title, "A");
  } finally {
    f.cleanup();
  }
});
test("before-commit rollback and after-commit lost response are distinguishable by receipt", async () => {
  const f = await storyFixture();
  try {
    const b = { operationId: randomUUID(), working: emptyDraft() };
    f.repo.failure = (stage) => {
      if (stage === "beforeCommit") throw Error("injected");
    };
    assert.throws(() => f.service.change(f.token, "create", null, b));
    assert.equal(f.service.list(f.token).stories.length, 0);
    f.repo.failure = (stage) => {
      if (stage === "afterCommit") throw Error("lost");
    };
    assert.throws(() => f.service.change(f.token, "create", null, b));
    f.repo.failure = undefined;
    assert.equal(f.repo.receipt(f.token, b.operationId).result, "confirmed");
    f.service.change(f.token, "create", null, b);
    assert.equal(f.service.list(f.token).stories.length, 1);
  } finally {
    f.cleanup();
  }
});
test("Q1 save keeps public A, publish swaps whole B, activation stays independent", async () => {
  const f = await storyFixture();
  try {
    const a = create(f),
      d = complete(f, a.storyId);
    save(f, a.storyId, d);
    publish(f, a.storyId);
    assert.equal(f.service.catalog().stories.length, 0);
    activate(f, a.storyId);
    const before = f.service.catalog();
    save(f, a.storyId, { ...d, title: "B", transcript: "" });
    assert.deepEqual(f.service.catalog(), before);
    assert.throws(() => publish(f, a.storyId));
    const next = { ...d, title: "B", transcript: "Nueva transcripción" };
    save(f, a.storyId, next);
    publish(f, a.storyId);
    assert.equal(f.service.catalog().stories[0].title, "B");
    assert.equal(
      f.service.catalog().stories[0].transcript,
      "Nueva transcripción",
    );
    assert.equal(f.service.list(f.token).summary.drafts, 0);
    activate(f, a.storyId, false);
    save(f, a.storyId, { ...next, title: "C" });
    activate(f, a.storyId);
    assert.equal(f.service.catalog().stories[0].title, "B");
    activate(f, a.storyId, false);
    publish(f, a.storyId);
    assert.equal(f.service.catalog().stories.length, 0);
    assert.equal(f.service.get(f.token, a.storyId).active, false);
  } finally {
    f.cleanup();
  }
});
test("draft activation and cross-story resource reference rejected; public DTO never leaks private fields", async () => {
  const f = await storyFixture();
  try {
    const a = create(f),
      b = create(f);
    assert.throws(() => activate(f, a.storyId));
    const d = complete(f, a.storyId);
    assert.throws(() => save(f, b.storyId, d));
    save(f, a.storyId, d);
    publish(f, a.storyId);
    activate(f, a.storyId);
    const dto = f.service.catalog().stories[0];
    for (const key of [
      "working",
      "published",
      "revision",
      "pendingChanges",
      "storageKey",
      "email",
    ])
      assert.equal(Object.hasOwn(dto, key), false);
    assert.equal(
      f.repo.publicResource(d.audioResourceId!).id,
      d.audioResourceId,
    );
    activate(f, a.storyId, false);
    assert.throws(() => f.repo.publicResource(d.audioResourceId!));
  } finally {
    f.cleanup();
  }
});
test("missing media blocks publication preserving draft and old publication", async () => {
  const f = await storyFixture();
  try {
    const a = create(f),
      d = complete(f, a.storyId);
    save(f, a.storyId, d);
    f.service.verifyResource = () => {
      throw Error("missing");
    };
    assert.throws(() => publish(f, a.storyId));
    assert.equal(f.service.get(f.token, a.storyId).published, null);
    assert.equal(f.service.get(f.token, a.storyId).working.title, d.title);
  } finally {
    f.cleanup();
  }
});

test("actual close/reopen retains draft, session and durable operation receipt", async () => {
  const f = await storyFixture();
  try {
    const a = create(f, { ...emptyDraft(), title: "Reinicio real" });
    f.repository.close();
    const reopened = openAdminRuntime(f.dir, [], { clock: f.time });
    try {
      const repo = new StoriesRepository(reopened.repository),
        service = new StoriesService(repo);
      assert.equal(
        service.get(f.token, a.storyId).working.title,
        "Reinicio real",
      );
      assert.deepEqual(repo.receipt(f.token, a.operationId), a);
    } finally {
      reopened.repository.close();
    }
  } finally {
    f.cleanup();
  }
});

test("replacement resources stay private until Publish then old exclusive resources cease eligibility", async () => {
  const f = await storyFixture();
  try {
    const a = create(f),
      d = complete(f, a.storyId);
    save(f, a.storyId, d);
    publish(f, a.storyId);
    activate(f, a.storyId);
    const next = { ...complete(f, a.storyId), title: "B" };
    save(f, a.storyId, next);
    assert.equal(
      f.service.catalog().stories[0].audio.src,
      "/media/public/" + d.audioResourceId,
    );
    assert.throws(() => f.repo.publicResource(next.audioResourceId!));
    publish(f, a.storyId);
    assert.equal(
      f.service.catalog().stories[0].audio.src,
      "/media/public/" + next.audioResourceId,
    );
    assert.throws(() => f.repo.publicResource(d.audioResourceId!));
    assert.equal(f.service.get(f.token, a.storyId).active, true);
  } finally {
    f.cleanup();
  }
});
