import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture, seed } from "./fixtures/admin-service/helpers.ts";
import {
  RecoveryService,
  encryptEnvelope,
  decryptEnvelope,
} from "../server/admin/recovery.ts";
import { MailWorker } from "../server/admin/mail-worker.ts";
import { AdminService } from "../server/admin/service.ts";
import { RESET, digest } from "../server/admin/sessions.ts";
import { randomBytes } from "node:crypto";
test("encrypted outbox authenticates AAD/key/tampering, does not persist plaintext", () => {
  const key = randomBytes(32);
  const value = {
    to: "one@example.com",
    resetURL: "https://example.test/admin/restablecer#token=synthetic",
  };
  const enc = encryptEnvelope(key, "job:account:1", value);
  assert.ok(!enc.includes("one@example.com"));
  assert.deepEqual(
    decryptEnvelope(new Map([["v1", key]]), "job:account:1", enc),
    value,
  );
  assert.throws(() => decryptEnvelope(new Map([["v1", key]]), "other", enc));
  assert.throws(() =>
    decryptEnvelope(new Map([["v1", randomBytes(32)]]), "job:account:1", enc),
  );
});
test("uniform recovery, actual worker double, single atomic reset revokes old credentials/sessions/proofs", async () => {
  const f = fixture();
  try {
    const { account, password } = await seed(f);
    const auth = new AdminService(f.repository, f.hasher, f.abuseKey);
    const login = await auth.login(account.email, password, "a");
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    );
    for (const email of [account.email, "absent@example.com"])
      await recovery.request(email, "conn");
    const rows = f.repository.db.prepare("SELECT * FROM admin_jobs").all();
    assert.equal(rows.length, 2);
    assert.equal(rows.filter((r) => r.kind === "noop").length, 1);
    const real = rows.find((r) => r.kind === "real")!;
    assert.ok(!String(real.envelope).includes(account.email));
    let delivered = "";
    const worker = new MailWorker(f.repository, new Map([["v1", f.mailKey]]), {
      idempotent: true,
      send: async (input) => {
        delivered = input.resetURL;
        return "accepted";
      },
    });
    await worker.tick();
    assert.ok(delivered);
    const token = new URLSearchParams(new URL(delivered).hash.slice(1)).get(
      "token",
    )!;
    assert.ok(f.repository.proof(token));
    assert.equal(f.repository.job(real.id as string)?.envelope, null);
    await recovery.request(account.email, "b");
    const next = "new synthetic password 2026";
    await recovery.reset(token, next, "conn");
    assert.equal(f.repository.session(login.token), null);
    assert.equal(f.repository.proof(token), null);
    await assert.rejects(recovery.reset(token, next, "conn"), /invalid_reset/);
    await assert.rejects(
      auth.login(account.email, password, "c"),
      /invalid_credentials/,
    );
    assert.ok(await auth.login(account.email, next, "c"));
    assert.equal(
      f.repository.db
        .prepare(
          "SELECT count(*) AS n FROM admin_resets WHERE consumedAt IS NULL AND invalidatedAt IS NULL",
        )
        .get()?.n,
      0,
    );
  } finally {
    f.cleanup();
  }
});
test("expiry equality, concurrent reset only one success, no automatic session, other account unaffected", async () => {
  const f = fixture();
  try {
    const a = await seed(f),
      b = await seed(f, "two@example.com");
    const auth = new AdminService(f.repository, f.hasher, f.abuseKey);
    const other = await auth.login(b.account.email, b.password, "b");
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    );
    await recovery.request(a.account.email, "a");
    const row = f.repository.db
      .prepare("SELECT * FROM admin_jobs WHERE kind='real'")
      .get()!;
    const env = decryptEnvelope(
      new Map([["v1", f.mailKey]]),
      `${row.id}:${row.accountId}:${row.credentialVersion}`,
      row.envelope as string,
    );
    const token = new URLSearchParams(new URL(env.resetURL).hash.slice(1)).get(
      "token",
    )!;
    const at = f.time();
    f.setTime(at + RESET);
    assert.equal(f.repository.proof(token), null);
    f.setTime(at);
    const settled = await Promise.allSettled([
      recovery.reset(token, "new synthetic phrase 2026", "x"),
      recovery.reset(token, "another synthetic phrase 2026", "y"),
    ]);
    assert.equal(settled.filter((r) => r.status === "fulfilled").length, 1);
    assert.ok(f.repository.session(other.token));
    assert.equal(
      f.repository.db.prepare("SELECT count(*) AS n FROM admin_sessions").get()
        ?.n,
      1,
    );
  } finally {
    f.cleanup();
  }
});
test("ambiguous non-idempotent delivery is terminal; rejected jobs retry, never extend token expiry", async () => {
  const f = fixture();
  try {
    await seed(f);
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    );
    await recovery.request("one@example.com", "a");
    let calls = 0;
    const worker = new MailWorker(f.repository, new Map([["v1", f.mailKey]]), {
      idempotent: false,
      send: async () => {
        calls++;
        return "unknown";
      },
    });
    await worker.tick();
    await worker.tick();
    assert.equal(calls, 1);
    const row = f.repository.db
      .prepare("SELECT * FROM admin_jobs WHERE kind='real'")
      .get()!;
    assert.equal(row.state, "failed");
    assert.equal(row.envelope, null);
  } finally {
    f.cleanup();
  }
});
import { provision } from "../server/admin/provision.ts";
import { spawn } from "node:child_process";
test("restricted provision creates pending account, activation by proof, disable/re-enable invalidate versions", async () => {
  const f = fixture();
  try {
    provision(f.repository, "crear", "new@example.com");
    const a = f.repository.findAccount("new@example.com")!;
    assert.equal(a.passwordRecord, null);
    assert.equal(a.mailboxVerifiedAt, null);
    const auth = new AdminService(f.repository, f.hasher, f.abuseKey);
    await assert.rejects(
      auth.login(a.email, "synthetic private phrase 2026", "a"),
      /invalid_credentials/,
    );
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    );
    await recovery.request(a.email, "a");
    const job = f.repository.db
      .prepare("SELECT * FROM admin_jobs WHERE kind='real'")
      .get()!;
    const payload = decryptEnvelope(
      new Map([["v1", f.mailKey]]),
      `${job.id}:${job.accountId}:${job.credentialVersion}`,
      job.envelope as string,
    );
    const proof = new URLSearchParams(
      new URL(payload.resetURL).hash.slice(1),
    ).get("token")!;
    await recovery.reset(proof, "synthetic private phrase 2026", "a");
    assert.ok(f.repository.findAccount(a.emailKey)?.mailboxVerifiedAt);
    provision(f.repository, "deshabilitar", a.email);
    provision(f.repository, "habilitar", a.email);
    const next = f.repository.findAccount(a.emailKey)!;
    assert.equal(next.authorized, true);
    assert.equal(next.passwordRecord, null);
    assert.equal(next.mailboxVerifiedAt, null);
    assert.equal(next.credentialVersion, 4);
    assert.equal(f.repository.proof(proof), null);
  } finally {
    f.cleanup();
  }
});
test("two independent reset processes commit exactly one credential change", async () => {
  const f = fixture();
  try {
    await seed(f);
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    );
    await recovery.request("one@example.com", "a");
    const j = f.repository.db
      .prepare("SELECT * FROM admin_jobs WHERE kind='real'")
      .get()!;
    const payload = decryptEnvelope(
      new Map([["v1", f.mailKey]]),
      `${j.id}:${j.accountId}:${j.credentialVersion}`,
      j.envelope as string,
    );
    const token = new URLSearchParams(
      new URL(payload.resetURL).hash.slice(1),
    ).get("token")!;
    const run = (password: string) =>
      new Promise<boolean>((res, rej) => {
        const child = spawn(process.execPath, [
          "--experimental-strip-types",
          "tests/fixtures/admin-service/writer.ts",
        ]);
        child.on("error", rej);
        child.on("close", (code) => res(code === 0));
        child.stdin.end(
          JSON.stringify({
            directory: f.dir,
            action: "reset",
            token,
            password,
            origin: "https://admin.example.test",
            now: f.time(),
          }),
        );
      });
    const results = await Promise.all([
      run("first new synthetic phrase 2026"),
      run("second new synthetic phrase 2026"),
    ]);
    assert.equal(results.filter(Boolean).length, 1);
    assert.equal(
      f.repository.findAccount("one@example.com")!.credentialVersion,
      2,
    );
  } finally {
    f.cleanup();
  }
});
test("worker retry bounds/leases/expiry, version invalidation and accept-unknown dedup contract", async () => {
  const f = fixture();
  try {
    await seed(f);
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    );
    await recovery.request("one@example.com", "a");
    let count = 0;
    const w = new MailWorker(f.repository, new Map([["v1", f.mailKey]]), {
      idempotent: true,
      send: async () => {
        count++;
        return "rejected";
      },
    });
    const issued = f.time();
    await w.tick();
    assert.equal(count, 1);
    await w.tick();
    assert.equal(count, 1);
    f.setTime(issued + 30000);
    await w.tick();
    assert.equal(count, 2);
    f.setTime(issued + 150000);
    await w.tick();
    assert.equal(count, 3);
    const row = f.repository.db
      .prepare("SELECT * FROM admin_jobs WHERE kind='real'")
      .get()!;
    assert.equal(row.state, "failed");
    assert.equal(row.envelope, null);
    assert.equal(row.expiresAt, issued + RESET);
  } finally {
    f.cleanup();
  }
});
test("versioned envelope keys permit bounded overlap and reject retired keys/corrupt ciphertext", () => {
  const old = randomBytes(32),
    next = randomBytes(32),
    value = {
      to: "synthetic@example.com",
      resetURL: "https://admin.example.test/admin/restablecer#token=synthetic",
    };
  const first = encryptEnvelope(old, "job:account:1", value, "v1"),
    second = encryptEnvelope(next, "job2:account:1", value, "v2");
  const overlap = new Map([
    ["v1", old],
    ["v2", next],
  ]);
  assert.deepEqual(decryptEnvelope(overlap, "job:account:1", first), value);
  assert.deepEqual(decryptEnvelope(overlap, "job2:account:1", second), value);
  assert.throws(() =>
    decryptEnvelope(new Map([["v2", next]]), "job:account:1", first),
  );
  const damaged = JSON.parse(second);
  damaged.ciphertext = Buffer.alloc(40).toString("base64url");
  assert.throws(() =>
    decryptEnvelope(overlap, "job2:account:1", JSON.stringify(damaged)),
  );
});
test("selective transaction failure remains conditional success; identity throttle never reveals existence", async () => {
  const f = fixture();
  try {
    await seed(f);
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    );
    const original = f.repository.findAccount.bind(f.repository);
    f.repository.findAccount = () => {
      throw Error("Private selective failure");
    };
    await recovery.request("one@example.com", "a");
    f.repository.findAccount = original;
    assert.equal(
      f.repository.db.prepare("SELECT count(*) AS n FROM admin_jobs").get()?.n,
      0,
    );
    for (let i = 0; i < 4; i++)
      await recovery.request("missing@example.com", "b");
    assert.equal(
      f.repository.db.prepare("SELECT count(*) AS n FROM admin_resets").get()
        ?.n,
      0,
    );
    const raw = JSON.stringify(
      f.repository.db.prepare("SELECT * FROM admin_abuse").all(),
    );
    assert.ok(!raw.includes("missing@example.com"));
  } finally {
    f.cleanup();
  }
});
test("mail in flight after reset never restores proof or overwrites invalidated job", async () => {
  const f = fixture();
  try {
    await seed(f);
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    );
    await recovery.request("one@example.com", "a");
    let delivered = "";
    let finish!: () => void;
    let entered!: () => void;
    const ready = new Promise<void>((r) => {
      entered = r;
    });
    const done = new Promise<void>((r) => {
      finish = r;
    });
    const worker = new MailWorker(f.repository, new Map([["v1", f.mailKey]]), {
      idempotent: true,
      send: async (input) => {
        delivered = input.resetURL;
        entered();
        await done;
        return "accepted";
      },
    });
    const sending = worker.tick();
    await ready;
    const token = new URLSearchParams(new URL(delivered).hash.slice(1)).get(
      "token",
    )!;
    await recovery.reset(token, "a new synthetic phrase 2026", "a");
    finish();
    await sending;
    assert.equal(f.repository.proof(token), null);
    const row = f.repository.db
      .prepare("SELECT * FROM admin_jobs WHERE kind='real'")
      .get()!;
    assert.equal(row.state, "expired");
    assert.equal(row.envelope, null);
  } finally {
    f.cleanup();
  }
});
test("worker drops retired keys once envelopes expire, keeps only current version without extending TTL", async () => {
  const f = fixture();
  try {
    await seed(f);
    const old = randomBytes(32),
      next = randomBytes(32);
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      old,
      "https://admin.example.test",
      "v1",
    );
    await recovery.request("one@example.com", "a");
    const keys = new Map([
      ["v1", old],
      ["v2", next],
    ]);
    const worker = new MailWorker(
      f.repository,
      keys,
      { idempotent: true, send: async () => "rejected" },
      "v2",
    );
    await worker.tick();
    assert.equal(keys.has("v1"), true);
    f.setTime(f.time() + RESET);
    await worker.tick();
    assert.equal(keys.has("v1"), false);
    assert.equal(keys.has("v2"), true);
  } finally {
    f.cleanup();
  }
});
test("reset failure before commit rolls back password/version/proof/session changes together", async () => {
  const f = fixture();
  try {
    const a = await seed(f);
    const auth = new AdminService(f.repository, f.hasher, f.abuseKey);
    const access = await auth.login(a.account.email, a.password, "a");
    const recovery = new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    );
    await recovery.request(a.account.email, "a");
    const job = f.repository.db
      .prepare("SELECT * FROM admin_jobs WHERE kind='real'")
      .get()!;
    const payload = decryptEnvelope(
      new Map([["v1", f.mailKey]]),
      `${job.id}:${job.accountId}:${job.credentialVersion}`,
      job.envelope as string,
    );
    const token = new URLSearchParams(
      new URL(payload.resetURL).hash.slice(1),
    ).get("token")!;
    f.repository.db.exec(
      "CREATE TRIGGER reject_password BEFORE UPDATE OF passwordRecord ON admin_accounts BEGIN SELECT RAISE(ABORT,'synthetic'); END",
    );
    await assert.rejects(
      recovery.reset(token, "new synthetic phrase 2026", "a"),
    );
    assert.ok(f.repository.session(access.token));
    assert.ok(f.repository.proof(token));
    assert.equal(f.repository.accountById(a.account.id)!.credentialVersion, 1);
    f.repository.db.exec("DROP TRIGGER reject_password");
    await recovery.reset(token, "new synthetic phrase 2026", "a");
    assert.equal(f.repository.session(access.token), null);
    assert.equal(f.repository.proof(token), null);
  } finally {
    f.cleanup();
  }
});
