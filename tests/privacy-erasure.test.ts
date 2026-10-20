import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { privacyFixture, receive, input } from "./helpers/privacy-fixtures.ts";
import { RETENTION } from "../server/privacy/policy.ts";
async function expired() {
  const f = await privacyFixture();
  const x = receive(f, "UNIQUE_PRIVATE_MARKER_009_" + randomUUID());
  f.setTime(f.time() + RETENTION);
  return { f, x };
}
test("V03/V04 expiry removes tuples, responses, WAL markers but preserves live records", async () => {
  const { f, x } = await expired();
  try {
    const live = receive(f);
    assert.equal(f.repo.summary().total, 1);
    assert.throws(() => f.repo.consultation(x.id));
    await f.privacyWorker.tick();
    assert.equal(
      f.p.db.prepare("SELECT count(*) n FROM consultations").get()!.n,
      1,
    );
    assert(
      f.p.db.prepare("SELECT 1 FROM consultations WHERE id=?").get(live.id),
    );
    for (const path of [f.path, f.path + "-wal"])
      if (existsSync(path))
        assert(!readFileSync(path).includes(Buffer.from(x.data.message)));
    const j = f.p.db.prepare("SELECT * FROM erasure_jobs").get()!;
    assert.equal(j.state, "completed");
    assert(j.physicalVerifiedAt !== null);
    assert.equal(await f.erasure.tick(), false);
  } finally {
    f.cleanup();
  }
});
test("capture failure preserves source refs and retries with original deadline", async () => {
  const { f, x } = await expired();
  try {
    f.copies.fail = true;
    f.p.queueExpired();
    const before = f.p.db.prepare("SELECT * FROM erasure_jobs").get()!;
    assert.equal(await f.erasure.tick(), false);
    assert(f.p.db.prepare("SELECT 1 FROM consultations WHERE id=?").get(x.id));
    assert.equal(
      f.p.db.prepare("SELECT state FROM erasure_jobs").get()!.state,
      "intent",
    );
    f.copies.fail = false;
    f.setTime(f.time() + 5000);
    assert(await f.erasure.tick());
    const after = f.p.db.prepare("SELECT * FROM erasure_jobs").get()!;
    assert.equal(after.dueAt, before.dueAt);
    assert.equal(after.jobId, before.jobId);
    assert.equal((await f.journal.currentHead()).sequence, 1);
  } finally {
    f.cleanup();
  }
});
for (const stage of [
  "afterReplica",
  "afterCapture",
  "afterDelete",
  "afterPhysical",
])
  test(
    "crash " +
      stage +
      " resumes without duplicating journal or changing deadline",
    async () => {
      const { f } = await expired();
      try {
        f.p.queueExpired();
        const j = f.p.db.prepare("SELECT * FROM erasure_jobs").get()!;
        f.erasure.failure = (s) => {
          if (s === stage) throw Error("Synthetic crash");
        };
        assert.equal(await f.erasure.tick(), false);
        f.erasure.failure = undefined;
        f.setTime(f.time() + 5000);
        assert(await f.erasure.tick());
        const final = f.p.db.prepare("SELECT * FROM erasure_jobs").get()!;
        assert.equal(final.state, "completed");
        assert.equal(final.dueAt, j.dueAt);
        assert.equal((await f.journal.currentHead()).sequence, 1);
      } finally {
        f.cleanup();
      }
    },
  );
test("V15 missed deadline remains overdue and is never restarted", async () => {
  const { f } = await expired();
  try {
    f.copies.fail = true;
    await f.privacyWorker.tick();
    const due = Number(
      f.p.db.prepare("SELECT dueAt FROM erasure_jobs").get()!.dueAt,
    );
    f.setTime(due + 1);
    const h = await f.privacyWorker.tick();
    assert(h && !h.healthy);
    assert.equal(
      f.p.db.prepare("SELECT dueAt FROM erasure_jobs").get()!.dueAt,
      due,
    );
  } finally {
    f.cleanup();
  }
});

test("unavailable replica has bounded wait, keeps data inaccessible and does not starve a healthy job", async () => {
  const { f, x } = await expired();
  try {
    const live = receive(f);
    f.contact.revoke(live.id);
    f.p.queueExpired();
    const append = f.journal.append.bind(f.journal);
    f.journal.append = async (entry) =>
      entry.consultationId === x.id
        ? await new Promise(() => {})
        : append(entry);
    f.erasure.timeout = 10;
    await f.privacyWorker.tick();
    assert(f.p.db.prepare("SELECT 1 FROM consultations WHERE id=?").get(x.id));
    assert.equal(
      f.p.db
        .prepare("SELECT lifecycle FROM consultations WHERE id=?")
        .get(x.id)!.lifecycle,
      "deleting",
    );
    assert(
      !f.p.db.prepare("SELECT 1 FROM consultations WHERE id=?").get(live.id),
    );
  } finally {
    f.cleanup();
  }
});
