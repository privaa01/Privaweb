import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PasswordHasher,
  params,
  acceptablePassword,
} from "../server/admin/password.ts";
test("scrypt salts, strict cost/format, dummy and comparison; event loop remains responsive", async () => {
  const h = new PasswordHasher();
  let tick = false;
  const timer = setTimeout(() => {
    tick = true;
  }, 5);
  const a = await h.hash(" synthetic secret 2026 ");
  clearTimeout(timer);
  assert.ok(tick);
  assert.deepEqual({ N: a.N, r: a.r, p: a.p, maxmem: a.maxmem }, params);
  const b = await h.hash(" synthetic secret 2026 ");
  assert.notEqual(a.salt, b.salt);
  assert.ok(await h.verify(" synthetic secret 2026 ", a));
  assert.ok(!(await h.verify("synthetic secret 2026", a)));
  assert.ok(!(await h.verify("anything", null)));
  assert.ok(!(await h.verify(" synthetic secret 2026 ", { ...a, N: 1024 })));
  assert.ok(!acceptablePassword("123456789012345"));
});
test("two active, eight queued, saturation before identity and bounded concurrency", async () => {
  const h = new PasswordHasher();
  const release: (() => void)[] = [];
  let peak = 0,
    current = 0;
  const jobs = Array.from({ length: 10 }, () =>
    h.run(async () => {
      peak = Math.max(peak, ++current);
      await new Promise<void>((r) => release.push(r));
      current--;
      return true;
    }),
  );
  await assert.rejects(
    h.run(async () => true),
    /unavailable/,
  );
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setImmediate(r));
    release.shift()?.();
  }
  await Promise.all(jobs);
  assert.equal(peak, 2);
  assert.equal(h.active, 0);
});
