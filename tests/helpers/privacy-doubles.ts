import { createHmac } from "node:crypto";
import { FileJournal, sign } from "../../server/privacy/deletion-journal.ts";
import type { CopiesAdapter, Capture } from "../../server/privacy/copies.ts";
import { durableWrite } from "../../server/privacy/backups.ts";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
export { ControlledMail } from "../fixtures/inbox-service/mail.ts";
export class ControlledCopies implements CopiesAdapter {
  dir: string;
  key: Buffer;
  fail = false;
  mode: "completed" | "pending" | "failed" = "completed";
  constructor(dir: string, key: Buffer) {
    this.dir = dir;
    this.key = key;
  }
  async capture(
    jobId: string,
    refs: readonly { deliveryId: string; namespace: string }[],
  ) {
    if (this.fail) throw Error("Synthetic capture unavailable");
    const path = join(this.dir, jobId + ".capture");
    if (existsSync(path))
      return JSON.parse(readFileSync(path, "utf8")) as Capture;
    const c = {
      jobId,
      handles: refs.length,
      receipt: sign(this.key, { jobId, refs }),
    };
    durableWrite(path, c);
    return c;
  }
  verify(c: Capture, jobId: string) {
    const path = join(this.dir, jobId + ".capture");
    return (
      existsSync(path) &&
      JSON.stringify(JSON.parse(readFileSync(path, "utf8"))) ===
        JSON.stringify(c) &&
      c.jobId === jobId
    );
  }
  async erase(_jobId: string) {
    return this.mode;
  }
  async status(_jobId: string) {
    return this.mode;
  }
}
