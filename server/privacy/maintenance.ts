import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { existsSync, openSync, closeSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { privatePath } from "./storage.ts";
/** flock holder releases on stdin EOF or process death. Never unlink the shared inode. */
export async function sharedLock(path: string) {
  privatePath(path, true);
  if (!existsSync(path)) {
    try {
      closeSync(openSync(path, "wx", 0o600));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
    }
  }
  privatePath(path);
  const child = spawn(
    "flock",
    [
      "--shared",
      "--timeout",
      "5",
      path,
      process.execPath,
      "-e",
      "console.log('ready');process.stdin.resume();process.stdin.on('end',()=>process.exit(0));",
    ],
    { stdio: ["pipe", "pipe", "ignore"] },
  );
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill();
      reject(Error("Privacy shared lock timeout"));
    }, 6000);
    child.once("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.once("exit", () => {
      clearTimeout(timer);
      reject(Error("Privacy shared lock unavailable"));
    });
    child.stdout!.once("data", () => {
      clearTimeout(timer);
      resolve();
    });
  });
  return async () => {
    if (child.exitCode !== null || child.signalCode !== null) return;
    await new Promise<void>((resolve) => {
      child.once("exit", () => resolve());
      child.stdin!.end();
    });
  };
}
export function exclusiveRun(lock: string, args: string[]) {
  privatePath(lock, true);
  if (!existsSync(lock)) {
    try {
      closeSync(openSync(lock, "wx", 0o600));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
    }
  }
  privatePath(lock);
  const result = spawnSync(
    "flock",
    [
      "--exclusive",
      "--nonblock",
      lock,
      process.execPath,
      "--experimental-strip-types",
      ...args,
    ],
    {
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 30000,
      env: { ...process.env, SQLITE_TMPDIR: undefined },
    },
  );
  if (result.status !== 0 || result.error)
    throw Error("Privacy exclusive maintenance blocked");
  return result.stdout.toString();
}
export type Maintenance = { clean: () => Promise<void> };
