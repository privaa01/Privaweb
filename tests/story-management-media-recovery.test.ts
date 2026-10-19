import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, utimesSync, existsSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  storyFixture,
  create,
  complete,
} from "./fixtures/story-management-service/helpers.ts";
test("cleanup removes only old unreferenced private blobs, keeps current and referenced files", async () => {
  const f = await storyFixture();
  try {
    const a = create(f),
      d = complete(f, a.storyId),
      old = join(f.media.directory, randomUUID()),
      fresh = join(f.media.directory, randomUUID());
    writeFileSync(old, "orphan", { mode: 0o600 });
    writeFileSync(fresh, "current", { mode: 0o600 });
    utimesSync(old, 1, 1);
    utimesSync(join(f.media.directory, d.audioResourceId!), 1, 1);
    f.media.cleanup();
    assert.equal(existsSync(old), false);
    assert.equal(existsSync(fresh), true);
    assert.equal(existsSync(join(f.media.directory, d.audioResourceId!)), true);
  } finally {
    f.cleanup();
  }
});
test("media rejects symlink and permissions before opening public bytes", async () => {
  const f = await storyFixture();
  try {
    const a = create(f),
      d = complete(f, a.storyId);
    const resource = f.repo.resource(d.imageResourceId!);
    const id = randomUUID();
    symlinkSync("/etc/passwd", join(f.media.directory, id));
    assert.throws(() => f.media.verify({ ...resource, storageKey: id }));
    assert.throws(() =>
      f.media.verify({ ...resource, storageKey: "../../etc/passwd" }),
    );
  } finally {
    f.cleanup();
  }
});
