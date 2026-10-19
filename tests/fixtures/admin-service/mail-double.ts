import { writeFileSync, readFileSync, existsSync } from "node:fs";
import type { MailAdapter } from "../../../server/admin/repository.ts";
// Private synthetic inbox outside the web root. Not a production mail adapter.
export function mailDouble(path: string): MailAdapter {
  return {
    idempotent: true,
    async send(input, signal) {
      if (signal.aborted) return "unknown";
      const rows = existsSync(path)
        ? (JSON.parse(readFileSync(path, "utf8")) as {
            deliveryId: string;
            to: string;
            resetURL: string;
          }[])
        : [];
      if (!rows.some((r) => r.deliveryId === input.deliveryId))
        rows.push(input);
      writeFileSync(path, JSON.stringify(rows), { mode: 0o600 });
      return "accepted";
    },
  };
}
