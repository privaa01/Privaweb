// Private subprocess control used only by tests; stdin/out are never HTTP endpoints.
import { openAdminRuntime } from "../../../server/admin/runtime.ts";
import { provision } from "../../../server/admin/provision.ts";
import { RecoveryService } from "../../../server/admin/recovery.ts";
import { SqliteAdminRepository } from "../../../server/admin/sqlite-repository.ts";
import { readFileSync } from "node:fs";
const chunks: Buffer[] = [];
for await (const c of process.stdin) chunks.push(Buffer.from(c));
const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
const r = openAdminRuntime(
  input.directory,
  [],
  input.now === undefined ? {} : { clock: () => input.now },
);
try {
  let out: unknown = { ok: true };
  if (input.action === "proof")
    out = { valid: !!r.repository.proof(input.token) };
  else if (input.action === "restart")
    process.kill(
      Number(readFileSync(input.directory + "/supervisor.pid", "utf8")),
      "SIGUSR2",
    );
  else if (input.action === "clear-abuse")
    r.repository.db.prepare("DELETE FROM admin_abuse").run();
  else if (input.action === "create")
    provision(r.repository, "crear", input.email);
  else if (input.action === "logout") r.repository.logout(input.token);
  else if (input.action === "authorize")
    provision(
      r.repository,
      input.enabled ? "habilitar" : "deshabilitar",
      input.email,
    );
  else if (input.action === "private-write")
    r.repository.withAuthorizedTransaction(input.token, (db) =>
      db.prepare("UPDATE private_test SET value=value+1").run(),
    );
  else if (input.action === "reset")
    await new RecoveryService(
      r.repository,
      r.hasher,
      r.abuseKey,
      r.mailKey,
      input.origin,
    ).reset(input.token, input.password, "private-process");
  else if (input.action === "session")
    out = { authorized: !!r.repository.session(input.token) };
  else if (input.action === "inbox") {
    const rows = JSON.parse(
      readFileSync(input.directory + "/inbox.json", "utf8"),
    );
    out =
      rows.filter((m: { to: string }) => m.to === input.email).at(-1) ?? null;
  } else if (input.action === "expire") {
    r.repository.db
      .prepare(
        "UPDATE admin_sessions SET idleExpiresAt=? WHERE accountId=(SELECT id FROM admin_accounts WHERE emailKey=?)",
      )
      .run(Date.now() - 1, input.email);
  } else throw Error("Unknown private action");
  process.stdout.write(JSON.stringify(out));
} catch {
  process.stdout.write(JSON.stringify({ ok: false }));
  process.exitCode = 1;
} finally {
  r.repository.close();
}
