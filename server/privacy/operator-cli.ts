import {
  readFileSync,
  lstatSync,
  realpathSync,
  readdirSync,
  readlinkSync,
} from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exclusiveRun, macLockHelper } from "./maintenance.ts";
import { spawnSync } from 'node:child_process';
import { privatePath } from "./storage.ts";
export function underExclusive(lock: string) {
  if(process.platform==='darwin') {
    const fd=Number(process.env.PRIVA_PRIVACY_LOCK_FD);
    if(!Number.isInteger(fd)||fd<3)return false;
    try {
      return spawnSync('/usr/bin/python3',[macLockHelper,'--verify-exclusive',lock],{
        stdio:['ignore','pipe','ignore',fd],
        env:{...process.env,PRIVA_PRIVACY_LOCK_FD:'3'},timeout:3000,
      }).status===0;
    } catch {return false;}
  }
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
