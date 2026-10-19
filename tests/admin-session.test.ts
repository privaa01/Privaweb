import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture } from "./fixtures/admin-service/helpers.ts";
import { AdminService } from "../server/admin/service.ts";
import {
  IDLE,
  ABSOLUTE,
  digest,
  randomToken,
} from "../server/admin/sessions.ts";
const password = "synthetic private phrase 2026";
import { seed } from "./fixtures/admin-service/helpers.ts";
test("real login, invalid/unknown same rejection, rotation, inactivity not renewed by checking", async () => {
  const f = fixture();
  try {
    await seed(f);
    const s = new AdminService(f.repository, f.hasher, f.abuseKey);
    for (const email of ["one@example.com", "absent@example.com"])
      await assert.rejects(
        s.login(email, "wrong", "conn"),
        /invalid_credentials/,
      );
    const first = await s.login("ONE@example.com", password, "conn");
    assert.equal(first.account.email, "one@example.com");
    const created = f.time();
    f.setTime(created + IDLE - 1);
    assert.ok(f.repository.session(first.token));
    f.setTime(created + IDLE);
    assert.equal(f.repository.session(first.token), null);
    f.setTime(created);
    const second = await s.login(
      "one@example.com",
      password,
      "other",
      first.token,
    );
    assert.notEqual(second.token, first.token);
    assert.equal(f.repository.session(first.token), null);
    assert.ok(f.repository.session(second.token));
    assert.equal(second.session.absoluteExpiresAt, created + ABSOLUTE);
    f.repository.logout(second.token);
    assert.equal(f.repository.session(second.token), null);
    f.repository.logout(second.token);
  } finally {
    f.cleanup();
  }
});
test("credential version and authorization rechecked after async hash", async () => {
  const f = fixture();
  try {
    const { account } = await seed(f);
    const original = f.hasher.verify.bind(f.hasher);
    f.hasher.verify = async (p, r) => {
      const ok = await original(p, r);
      f.repository.setAuthorization(account.id, false);
      return ok;
    };
    const s = new AdminService(f.repository, f.hasher, f.abuseKey);
    await assert.rejects(
      s.login(account.email, password, "conn"),
      /invalid_credentials/,
    );
    assert.equal(
      f.repository.db.prepare("SELECT count(*) AS n FROM admin_sessions").get()
        ?.n,
      0,
    );
  } finally {
    f.cleanup();
  }
});
test("same permission for two accounts; logout only current session, never expired or revoked authorize", async () => {
  const f = fixture();
  try {
    const a = await seed(f);
    await seed(f, "two@example.com");
    const s = new AdminService(f.repository, f.hasher, f.abuseKey);
    const x = await s.login(a.account.email, password, "a");
    const y = await s.login(a.account.email, password, "b");
    const z = await s.login("two@example.com", password, "c");
    assert.equal(x.account.permission, z.account.permission);
    f.repository.logout(x.token);
    assert.equal(f.repository.session(x.token), null);
    assert.ok(f.repository.session(y.token));
    f.repository.db
      .prepare(
        "UPDATE admin_sessions SET credentialVersion=99 WHERE tokenDigest=?",
      )
      .run(digest(y.token));
    assert.equal(f.repository.session(y.token), null);
    assert.equal(f.repository.session(randomToken()), null);
  } finally {
    f.cleanup();
  }
});
test("user operation extends idle only to absolute expiry; context/session reads do not extend", async () => {
  const f = fixture();
  try {
    await seed(f);
    const s = new AdminService(f.repository, f.hasher, f.abuseKey);
    const login = await s.login("one@example.com", password, "a");
    const start = f.time();
    for (let n = 1; n < 17; n++) {
      f.setTime(start + n * (IDLE - 1));
      f.repository.withAuthorizedTransaction(login.token, () => null);
    }
    const before = f.repository.session(login.token)!.session;
    assert.equal(before.absoluteExpiresAt, start + ABSOLUTE);
    assert.equal(before.idleExpiresAt, before.absoluteExpiresAt);
    f.setTime(before.idleExpiresAt);
    assert.equal(f.repository.session(login.token), null);
  } finally {
    f.cleanup();
  }
});
test("uniform login abuse for known/unknown emails, no permanent account lock and no raw identities in counters", async () => {
  const f = fixture();
  try {
    await seed(f);
    const s = new AdminService(f.repository, f.hasher, f.abuseKey);
    for (const email of ["one@example.com", "missing@example.com"]) {
      for (let i = 0; i < 5; i++)
        await assert.rejects(
          s.login(email, "wrong", "a"),
          /invalid_credentials/,
        );
      await assert.rejects(s.login(email, password, "a"), /limited/);
    }
    const rows = JSON.stringify(
      f.repository.db.prepare("SELECT * FROM admin_abuse").all(),
    );
    assert.ok(
      !rows.includes("one@example.com") &&
        !rows.includes("missing@example.com"),
    );
    f.setTime(f.time() + 900000);
    assert.ok(await s.login("one@example.com", password, "a"));
  } finally {
    f.cleanup();
  }
});
