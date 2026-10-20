import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { sharedLock, exclusiveRun } from "../server/privacy/maintenance.ts";
import { PrivacySupervisor } from "../scripts/privacy-supervisor.ts";
test("external shared holder blocks exclusive cleanup until drained; never steal inode", async () => {
  const dir = mkdtempSync(join(tmpdir(), "priva009-flock-")),
    lock = join(dir, "maintenance.lock");
  try {
    const release = await sharedLock(lock);
    assert.throws(() => exclusiveRun(lock, ["-e", "process.exit(0)"]));
    await release();
    assert.equal(
      exclusiveRun(lock, ["-e", 'process.stdout.write("exclusive")']),
      "exclusive",
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("supervisor drains every participant and reopens after exclusive child", async () => {
  const dir = mkdtempSync(join(tmpdir(), "priva009-supervisor-")),
    lock = join(dir, "maintenance.lock"),
    calls: string[] = [],
    s = new PrivacySupervisor(lock);
  try {
    s.register({
      start: async () => {
        calls.push("start");
      },
      stop: async () => {
        calls.push("stop");
      },
    });
    await s.start();
    assert.throws(() => exclusiveRun(lock, ["-e", "process.exit(0)"]));
    await s.clean(["-e", "process.exit(0)"]);
    assert.deepEqual(calls, ["start", "stop", "start"]);
    assert(s.admitting);
  } finally {
    await s.stop();
    rmSync(dir, { recursive: true, force: true });
  }
});
