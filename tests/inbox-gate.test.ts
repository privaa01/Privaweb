import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { inboxIssues, inboxReadiness } from "../src/config/inbox.ts";
test("delivery guard rejects unqualified configuration without approving references", () => {
  assert.equal(inboxIssues().length, 7);
  assert.ok(Object.values(inboxReadiness).every((x) => x === null));
  const result = spawnSync(
    process.execPath,
    ["scripts/require-inbox-publication.mjs"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /BLOQUEADO 008/);
});
