import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sandboxArgs, inspect } from "../server/stories/media.ts";
test("sandbox launcher fixes resource bounds, namespace and restricted input", () => {
  const a = sandboxArgs("/tmp/synthetic", "ffprobe", [
    "-show_format",
    "/input",
  ]);
  for (const s of [
    "--as=536870912",
    "--cpu=20:21",
    "--nofile=32",
    "--core=0",
    "--unshare-all",
    "--clearenv",
    "--cap-drop",
    "/input",
  ])
    assert.ok(a.includes(s));
  assert.equal(a.includes("/workspace"), false);
});
test("unavailable sandbox or corrupt input fails closed; no metadata can be accepted", async () => {
  const dir = mkdtempSync(join(tmpdir(), "priva-sandbox-test-"));
  try {
    const p = join(dir, "corrupt");
    writeFileSync(p, Buffer.from("not a media file"), { mode: 0o600 });
    await assert.rejects(() => inspect(p, "audio"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
