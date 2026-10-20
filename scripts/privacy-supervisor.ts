import { sharedLock, exclusiveRun } from "../server/privacy/maintenance.ts";
import { privatePath } from "../server/privacy/storage.ts";
import { durableWrite } from "../server/privacy/backups.ts";
import { createServer, type Server } from "node:net";
import { chmodSync, existsSync, unlinkSync } from "node:fs";
/** Lifecycle interface: stop must drain requests/close ALL registered DB connections before resolving. */
export interface Participant {
  start: () => Promise<void>;
  stop: () => Promise<void>;
}
export class PrivacySupervisor {
  lock: string;
  participants: Participant[] = [];
  releases: (() => Promise<void>)[] = [];
  busy = false;
  admitting = false;
  constructor(lock: string) {
    privatePath(lock, true);
    this.lock = lock;
  }
  register(p: Participant) {
    if (this.admitting || this.busy)
      throw Error("Cannot register while running");
    this.participants.push(p);
  }
  async start() {
    if (this.busy || this.admitting) throw Error("Supervisor already active");
    try {
      for (const p of this.participants) {
        const release = await sharedLock(this.lock);
        this.releases.push(release);
        await p.start();
      }
      this.admitting = true;
    } catch (e) {
      await this.stop();
      throw e;
    }
  }
  async stop() {
    this.admitting = false;
    for (const p of [...this.participants].reverse()) await p.stop();
    for (const release of this.releases.splice(0)) await release();
  }
  async clean(args: string[]) {
    if (this.busy) throw Error("Maintenance in progress");
    this.busy = true;
    try {
      await this.stop();
      exclusiveRun(this.lock, args);
    } finally {
      this.busy = false;
    }
    await this.start();
  }
  async ipc(path: string, token: string) {
    privatePath(path, true);
    if (token.length < 32 || existsSync(path))
      throw Error("Private IPC configuration invalid");
    const server = createServer((socket) => {
      let input = "";
      socket.setTimeout(5000, () => socket.destroy());
      socket.on("data", (chunk) => {
        input += chunk.toString();
        if (input.length > 4096) {
          socket.destroy();
          return;
        }
        if (input.includes("\n")) {
          try {
            const m = JSON.parse(input.split("\n")[0]);
            if (m.token !== token || m.action !== "status") throw Error();
            socket.end(
              JSON.stringify({
                admitting: this.admitting,
                maintenance: this.busy,
                participants: this.participants.length,
              }) + "\n",
            );
          } catch {
            socket.destroy();
          }
        }
      });
    });
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(path, () => {
        chmodSync(path, 0o600);
        resolve();
      });
    });
    return server;
  }
}
