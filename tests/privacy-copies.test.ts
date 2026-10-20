import test from "node:test";
import assert from "node:assert/strict";
import { canRetireSuppression } from "../server/privacy/backups.ts";
test("V11 suppression cannot retire until complete current inventory proves affected copies inaccessible", () => {
  const now = 100000,
    m = {
      snapshotSequence: 0,
      restoreUntil: now + 1,
      destroyedAt: null,
    } as any;
  assert(
    !canRetireSuppression(
      1,
      [m],
      { complete: true, verifiedAt: now, horizon: now },
      now,
    ),
  );
  assert(
    !canRetireSuppression(
      1,
      [],
      { complete: false, verifiedAt: now, horizon: now },
      now,
    ),
  );
  assert(
    !canRetireSuppression(
      1,
      [],
      { complete: true, verifiedAt: 0, horizon: now },
      now,
    ),
  );
  assert(
    canRetireSuppression(
      1,
      [{ ...m, destroyedAt: now }],
      { complete: true, verifiedAt: now, horizon: now },
      now,
    ),
  );
});

import { privacyFixture, receive } from "./helpers/privacy-fixtures.ts";
import { sign } from "../server/privacy/deletion-journal.ts";
import { randomUUID } from "node:crypto";
test("journal retirement requires authenticated current complete inventory, keeps signed anchor and next append valid", async () => {
  const f = await privacyFixture();
  try {
    const entry = await f.journal.append({
      jobId: randomUUID(),
      consultationId: randomUUID(),
      intendedAt: f.time(),
      reason: "request",
    });
    const body = {
      complete: true,
      verifiedAt: f.time(),
      horizon: f.time(),
      manifests: [],
    };
    await assert.rejects(() =>
      f.journal.retire(
        entry.sequence,
        { ...body, signature: "forged" },
        f.time(),
      ),
    );
    const anchor = await f.journal.retire(
      entry.sequence,
      { ...body, signature: sign(f.key, body) },
      f.time(),
    );
    assert.deepEqual(await f.journal.currentHead(), anchor);
    assert.equal(f.journal.entries().length, 0);
    const next = await f.journal.append({
      jobId: randomUUID(),
      consultationId: randomUUID(),
      intendedAt: f.time(),
      reason: "expiry",
    });
    assert.equal(next.sequence, 2);
    assert(
      f.journal.verify(
        await f.journal.readRange(1, 2),
        await f.journal.currentHead(),
      ),
    );
  } finally {
    f.cleanup();
  }
});
