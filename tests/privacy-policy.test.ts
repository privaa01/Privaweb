import test from "node:test";
import assert from "node:assert/strict";
import {
  RETENTION,
  HOUR,
  DAY,
  expiresAt,
  dueAt,
  activity,
  visible,
} from "../server/privacy/policy.ts";
const t = Date.parse("2026-10-20T12:00:00Z");
test("V01 exact UTC boundaries and deletion deadlines", () => {
  assert.equal(expiresAt(t), t + RETENTION);
  for (const status of ["Pendiente", "Respondido"]) {
    const c = {
      lifecycle: "active",
      lastActivityAt: new Date(t).toISOString(),
      status,
    };
    assert(visible(c, t + RETENTION - 1));
    assert(!visible(c, t + RETENTION));
    assert(!visible(c, t + RETENTION + 1));
  }
  assert.equal(dueAt(t), t + RETENTION + HOUR);
  assert.equal(dueAt(t, t + 1), t + 1 + DAY);
  assert.equal(dueAt(t, t + RETENTION), t + RETENTION + HOUR);
});
test("V02 only original new acceptance advances; invalid and future activity fail closed", () => {
  assert.equal(
    activity(new Date(t).toISOString(), new Date(t + 3).toISOString(), t + 2),
    new Date(t + 3).toISOString(),
  );
  assert(!visible({ lifecycle: "active", lastActivityAt: "bad" }, t));
  assert(
    !visible(
      { lifecycle: "active", lastActivityAt: new Date(t + 1).toISOString() },
      t,
    ),
  );
  assert.throws(() => dueAt("bad"));
});
