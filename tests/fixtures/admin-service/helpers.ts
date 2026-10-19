import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openAdminRuntime } from "../../../server/admin/runtime.ts";
export function fixture() {
  const dir = mkdtempSync(join(tmpdir(), "priva-admin-"));
  let now = 10000000;
  const r = openAdminRuntime(dir, [], { clock: () => now });
  return {
    ...r,
    dir,
    setTime: (v: number) => {
      now = v;
    },
    time: () => now,
    cleanup: () => {
      r.repository.close();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
const password = "synthetic private phrase 2026";
export async function seed(
  f: ReturnType<typeof fixture>,
  email = "one@example.com",
) {
  const a = f.repository.createAccount(email);
  const record = await f.hasher.hash(password);
  f.repository.db
    .prepare(
      "UPDATE admin_accounts SET passwordRecord=?,mailboxVerifiedAt=? WHERE id=?",
    )
    .run(JSON.stringify(record), f.time(), a.id);
  return { account: f.repository.accountById(a.id)!, password };
}
