import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  rmSync,
  statSync,
  mkdirSync,
  chmodSync,
  writeFileSync,
  existsSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openAdminRuntime } from "../server/admin/runtime.ts";
import { randomToken, digest } from "../server/admin/sessions.ts";
import { fixture } from "./fixtures/admin-service/helpers.ts";
test("private SQLite persists restrictions, pragmas and 0600 files across restart", () => {
  const f = fixture();
  try {
    const a = f.repository.createAccount("One+tag@Example.COM");
    assert.equal(a.emailKey, "one+tag@example.com");
    assert.equal(a.permission, "administrador");
    assert.equal(a.passwordRecord, null);
    assert.throws(() => f.repository.createAccount("ONE+tag@example.com"));
    assert.equal(
      f.repository.db.prepare("PRAGMA synchronous").get()?.synchronous,
      2,
    );
    assert.equal(
      f.repository.db.prepare("PRAGMA foreign_keys").get()?.foreign_keys,
      1,
    );
    assert.equal(
      f.repository.db.prepare("PRAGMA journal_mode").get()?.journal_mode,
      "wal",
    );
    assert.equal(statSync(join(f.dir, "admin.sqlite")).mode & 0o777, 0o600);
    f.repository.close();
    const r = openAdminRuntime(f.dir, [], { clock: f.time });
    assert.equal(r.repository.findAccount(a.emailKey)?.id, a.id);
    r.repository.close();
  } finally {
    rmSync(f.dir, { recursive: true, force: true });
  }
});
test("static roots, symlink directories and publicly readable directories rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "priva-path-"));
  try {
    assert.throws(() => openAdminRuntime(dir, [dir]));
    const link = dir + "-link";
    symlinkSync(dir, link);
    try {
      assert.throws(() => openAdminRuntime(link, []));
    } finally {
      rmSync(link);
    }
    const pub = join(dir, "public");
    mkdirSync(pub, { mode: 0o755 });
    chmodSync(pub, 0o755);
    assert.throws(() => openAdminRuntime(pub, []));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("authorization guards before operation, revocation durable and rollback atomic", () => {
  const f = fixture();
  try {
    const a = f.repository.createAccount("one@example.com");
    const t = randomToken();
    f.repository.db
      .prepare(
        "UPDATE admin_accounts SET passwordRecord=?,mailboxVerifiedAt=? WHERE id=?",
      )
      .run(
        JSON.stringify({
          version: "scrypt-v1",
          salt: Buffer.alloc(16).toString("base64url"),
          hash: Buffer.alloc(64).toString("base64url"),
          N: 131072,
          r: 8,
          p: 1,
          maxmem: 201326592,
        }),
        f.time(),
        a.id,
      );
    f.repository.createSession(a.id, 1, digest(t));
    f.repository.db.exec(
      "CREATE TABLE private_test(value INTEGER); INSERT INTO private_test VALUES(0)",
    );
    let invoked = false;
    assert.throws(() =>
      f.repository.withAuthorizedTransaction(randomToken(), () => {
        invoked = true;
      }),
    );
    assert.equal(invoked, false);
    assert.equal(
      f.repository.withAuthorizedTransaction(t, (db, account) => {
        db.prepare("UPDATE private_test SET value=1").run();
        return account.permission;
      }),
      "administrador",
    );
    assert.throws(() =>
      f.repository.withAuthorizedTransaction(t, (db) => {
        db.prepare("UPDATE private_test SET value=99").run();
        throw Error("rollback");
      }),
    );
    assert.equal(
      f.repository.db.prepare("SELECT value FROM private_test").get()?.value,
      1,
    );
    f.repository.setAuthorization(a.id, false);
    assert.throws(() =>
      f.repository.withAuthorizedTransaction(t, () => {
        invoked = true;
      }),
    );
  } finally {
    f.cleanup();
  }
});
import { spawn } from "node:child_process";
export async function childOperation(input: unknown) {
  return new Promise<{
    ok: boolean;
  }>((res, rej) => {
    const child = spawn(
      process.execPath,
      ["--experimental-strip-types", "tests/fixtures/admin-service/writer.ts"],
      { stdio: ["pipe", "pipe", "pipe"] },
    );
    let out = "";
    child.stdout.on("data", (v) => {
      out += v;
    });
    child.on("error", rej);
    child.on("close", () => {
      try {
        res(JSON.parse(out));
      } catch {
        rej(Error("Private process failed"));
      }
    });
    child.stdin.end(JSON.stringify(input));
  });
}
test("independent processes serialize logout and private writes, later replay cannot mutate", async () => {
  const f = fixture();
  try {
    const a = f.repository.createAccount("race@example.com");
    const record = {
      version: "scrypt-v1",
      salt: Buffer.alloc(16).toString("base64url"),
      hash: Buffer.alloc(64).toString("base64url"),
      N: 131072,
      r: 8,
      p: 1,
      maxmem: 201326592,
    };
    f.repository.db
      .prepare(
        "UPDATE admin_accounts SET passwordRecord=?,mailboxVerifiedAt=? WHERE id=?",
      )
      .run(JSON.stringify(record), f.time(), a.id);
    const token = randomToken();
    f.repository.createSession(a.id, 1, digest(token));
    f.repository.db.exec(
      "CREATE TABLE private_test(value INTEGER); INSERT INTO private_test VALUES(0)",
    );
    const base = { directory: f.dir, token, now: f.time() };
    const results = await Promise.all([
      childOperation({ ...base, action: "private-write" }),
      childOperation({ ...base, action: "logout" }),
    ]);
    assert.equal(results[1].ok, true);
    const saved = f.repository.db
      .prepare("SELECT value FROM private_test")
      .get()!.value;
    assert.ok(saved === 0 || saved === 1);
    assert.equal(
      (await childOperation({ ...base, action: "private-write" })).ok,
      false,
    );
    assert.equal(
      f.repository.db.prepare("SELECT value FROM private_test").get()!.value,
      saved,
    );
  } finally {
    f.cleanup();
  }
});
test("unsafe database symlinks including dangling targets rejected before opening SQLite", () => {
  for (const dangling of [false, true]) {
    const dir = mkdtempSync(join(tmpdir(), "priva-file-"));
    let runtime: ReturnType<typeof openAdminRuntime> | undefined;
    try {
      const target = join(dir, "target");
      if (!dangling) writeFileSync(target, "", { mode: 0o600 });
      symlinkSync(target, join(dir, "admin.sqlite"));
      assert.throws(() => {
        runtime = openAdminRuntime(dir, []);
      });
      if (dangling) assert.equal(existsSync(target), false);
    } finally {
      runtime?.repository.close();
      rmSync(dir, { recursive: true, force: true });
    }
  }
});
test("async private callbacks rejected before scheduling work outside authorization transaction", async () => {
  const f = fixture();
  try {
    let ran = false;
    const invalid = async () => {
      await Promise.resolve();
      ran = true;
    };
    assert.throws(
      () => f.repository.transaction(invalid),
      /Async transaction forbidden/,
    );
    if (false) {
      // @ts-expect-error asynchronous callbacks are not a supported private-operation contract
      f.repository.withAuthorizedTransaction(undefined, invalid);
    }
    assert.throws(
      () =>
        f.repository.withAuthorizedTransaction(
          undefined,
          invalid as unknown as () => void,
        ),
      /Async transaction forbidden/,
    );
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(ran, false);
  } finally {
    f.cleanup();
  }
});
