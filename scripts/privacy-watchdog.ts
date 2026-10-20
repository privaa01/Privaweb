import { readFileSync } from "node:fs";
import { privatePath } from "../server/privacy/storage.ts";
import { health } from "../server/privacy/observability.ts";
const path = process.argv[2];
privatePath(path);
function check() {
  try {
    const s = JSON.parse(readFileSync(path, "utf8"));
    if (
      !Number.isFinite(s.lastSuccessAt) ||
      !(s.oldestDueAt === null || Number.isFinite(s.oldestDueAt)) ||
      !health(s.lastSuccessAt, s.oldestDueAt, Date.now()).healthy
    )
      throw Error();
    process.stdout.write("privacy_watchdog_ok\n");
  } catch {
    process.stderr.write("privacy_watchdog_failed\n");
    process.exitCode = 1;
  }
}
check();
if (process.argv[3] === "--watch") setInterval(check, 60000);
