import {
  mkdirSync,
  lstatSync,
  realpathSync,
  existsSync,
  openSync,
  writeFileSync,
  closeSync,
  readFileSync,
} from "node:fs";
import { resolve, relative, isAbsolute, join, dirname } from "node:path";
import { randomBytes } from "node:crypto";
import { SqliteAdminRepository } from "./sqlite-repository.ts";
import { PasswordHasher } from "./password.ts";
import type { Clock } from "./repository.ts";
export function loadKey(path: string) {
  if (!existsSync(path)) {
    try {
      const fd = openSync(path, "wx", 0o600);
      try {
        writeFileSync(fd, randomBytes(32));
      } finally {
        closeSync(fd);
      }
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
    }
  }
  const s = lstatSync(path);
  if (
    s.isSymbolicLink() ||
    !s.isFile() ||
    (s.mode & 0o077) !== 0 ||
    realpathSync(path) !== path
  )
    throw Error("Unsafe key file");
  const key = readFileSync(path);
  if (key.length !== 32) throw Error("Invalid key");
  return key;
}
export function openAdminRuntime(
  directory: string,
  staticRoots: string[],
  options: {
    clock?: Clock;
  } = {},
) {
  if (Number(process.versions.node.split(".")[0]) < 24)
    throw Error("Administrative service requires Node 24+");
  const path = resolve(directory);
  for (const root of [...staticRoots, resolve(".git")]) {
    const rel = relative(resolve(root), path);
    if (rel === "" || (!rel.startsWith("..") && !isAbsolute(rel)))
      throw Error("Private directory under static root");
  }
  mkdirSync(path, { recursive: true, mode: 0o700 });
  const st = lstatSync(path);
  if (
    st.isSymbolicLink() ||
    realpathSync(path) !== path ||
    (st.mode & 0o077) !== 0
  )
    throw Error("Unsafe private directory");
  const csrfKey = loadKey(join(path, "admin-csrf.key")),
    abuseKey = loadKey(join(path, "admin-abuse.key")),
    mailKey = loadKey(join(path, "admin-mail-v1.key"));
  const repository = new SqliteAdminRepository(
    join(path, "admin.sqlite"),
    options.clock,
  );
  return {
    repository,
    hasher: new PasswordHasher(),
    csrfKey,
    abuseKey,
    mailKey,
  };
}
