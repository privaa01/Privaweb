import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture, seed } from "./fixtures/admin-service/helpers.ts";
import { AdminService } from "../server/admin/service.ts";
import { RecoveryService } from "../server/admin/recovery.ts";
import { digest, PREAUTH } from "../server/admin/sessions.ts";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
test("maintenance purges expired sessions/proofs/contexts/abuse without inheriting Contacto retention", async () => {
  const f = fixture();
  try {
    await seed(f);
    const service = new AdminService(f.repository, f.hasher, f.abuseKey);
    const login = await service.login(
      "one@example.com",
      "synthetic private phrase 2026",
      "a",
    );
    await new RecoveryService(
      f.repository,
      f.hasher,
      f.abuseKey,
      f.mailKey,
      "https://admin.example.test",
    ).request("one@example.com", "a");
    f.repository.db
      .prepare("INSERT INTO admin_preauth VALUES(?,?)")
      .run(digest("synthetic"), f.time() + PREAUTH);
    f.repository.db.exec(
      "CREATE TABLE contact_untouched(message TEXT); INSERT INTO contact_untouched VALUES('synthetic')",
    );
    f.repository.logout(login.token);
    f.setTime(f.time() + 2 * 86400000);
    f.repository.purge();
    for (const table of [
      "admin_sessions",
      "admin_resets",
      "admin_preauth",
      "admin_jobs",
      "admin_abuse",
    ])
      assert.equal(
        f.repository.db.prepare("SELECT count(*) AS n FROM " + table).get()?.n,
        0,
      );
    assert.equal(
      f.repository.db.prepare("SELECT count(*) AS n FROM admin_accounts").get()
        ?.n,
      1,
    );
    assert.equal(
      f.repository.db.prepare("SELECT message FROM contact_untouched").get()
        ?.message,
      "synthetic",
    );
  } finally {
    f.cleanup();
  }
});
test("production entry and publication gate fail closed before opening runtime or seed accounts", () => {
  for (const target of [
    "server/admin/start.ts",
    "scripts/require-admin-publication.mjs",
  ]) {
    const r = spawnSync(
      process.execPath,
      ["--experimental-strip-types", target],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          PRIVA_ADMIN_DATA_DIR:
            "/tmp/priva-admin-must-not-be-created-" + process.pid,
        },
      },
    );
    assert.notEqual(r.status, 0);
    assert.ok((r.stdout + r.stderr).includes("BLOQUEADO 006"));
  }
  assert.equal(
    existsSync("/tmp/priva-admin-must-not-be-created-" + process.pid),
    false,
  );
});
