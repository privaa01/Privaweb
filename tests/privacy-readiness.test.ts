import {documents} from '../src/config/documents.ts';
import {bundleHash} from '../src/lib/documents-review.ts';
import test from "node:test";
import assert from "node:assert/strict";
import { privacyIssues, privacyScopes } from "../src/config/privacy.ts";
import { evidenceIssues } from "../server/privacy/readiness.ts";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
test("privacy gates reject null, boolean, fixture, expired and arbitrary evidence", () => {
  assert.equal(privacyIssues().length, 10);
  for (const v of [true, "approved", { kind: "fixture" }])
    assert.equal(
      privacyIssues(Object.fromEntries(privacyScopes.map((k) => [k, v])))
        .length,
      10,
    );
});
test("evidence content, hash, revision and expiry are all bound", () => {
  const dir = mkdtempSync(join(tmpdir(), "priva009-evidence-")),
    now = Date.now(),
    verifiedAt = new Date(now - 1).toISOString(),
    expiresAt = new Date(now + 60000).toISOString(),
    revision = "synthetic-release";
  try {
    const refs: any = {};
    for (const scope of privacyScopes) {
      const path = join(dir, scope + ".json"),
        content = JSON.stringify({
          kind: "production",
          scope,
          revision,
          verifiedAt,
          expiresAt,
          result: "pass",
          synthetic: false,
          ...(scope === "notices" ? {bundleHash:bundleHash(documents)} : {}),
        });
      writeFileSync(path, content);
      refs[scope] = {
        path,
        sha256: createHash("sha256").update(content).digest("hex"),
        kind: "production",
        scope,
        revision,
        verifiedAt,
        expiresAt,
      };
    }
    assert.equal(evidenceIssues(refs, revision, now).length, 0);
    assert.equal(evidenceIssues(refs, "other-release", now).length, 10);
    assert.equal(evidenceIssues(refs, revision, now + 60001).length, 10);
    writeFileSync(refs.policy.path, "changed");
    assert(evidenceIssues(refs, revision, now).includes("privacy:policy"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
