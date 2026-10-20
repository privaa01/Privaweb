import {
  readFileSync,
  lstatSync,
  realpathSync,
  readdirSync,
  readlinkSync,
} from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exclusiveRun } from "./maintenance.ts";
import { privatePath } from "./storage.ts";
export function underExclusive(lock: string) {
  for (const fd of readdirSync("/proc/self/fd")) {
    try {
      if (
        readlinkSync("/proc/self/fd/" + fd) === lock &&
        /FLOCK.*WRITE/.test(readFileSync("/proc/self/fdinfo/" + fd, "utf8"))
      )
        return true;
    } catch {}
  }
  return false;
}
export function exclusiveCli(lock: string, script: string, args: string[]) {
  if (process.argv.includes("--locked")) {
    if (!underExclusive(lock))
      throw Error("Inherited exclusive flock required");
    return true;
  }
  exclusiveRun(lock, [script, ...args, "--locked"]);
  return false;
}
export function operatorConfig(path: string) {
  privatePath(path);
  const c = JSON.parse(readFileSync(path, "utf8"));
  if (!c || typeof c.module !== "string")
    throw Error("Private operator configuration required");
  return c;
}
