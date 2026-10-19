// Synthetic process supervisor only. No production entry imports this fixture.
import { createServer } from "node:http";
import { spawn, type ChildProcess } from "node:child_process";
import { rmSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { openAdminRuntime } from "../../../server/admin/runtime.ts";
import { AdminService } from "../../../server/admin/service.ts";
import { createAdminHandler } from "../../../server/admin/http.ts";
import { RecoveryService } from "../../../server/admin/recovery.ts";
import { MailWorker } from "../../../server/admin/mail-worker.ts";
import { mailDouble } from "./mail-double.ts";
const directory = resolve(".test-output/admin-service-data");
const roots = [
  resolve("public"),
  resolve("dist"),
  resolve(".private-build/admin"),
];
if (!process.argv.includes("--fixture-child")) {
  rmSync(directory, { recursive: true, force: true });
  mkdirSync(directory, { mode: 0o700, recursive: true });
  const seed = openAdminRuntime(directory, roots);
  for (const email of ["one@example.com", "two@example.com"]) {
    const a = seed.repository.createAccount(email);
    const hash = await seed.hasher.hash("synthetic private phrase 2026");
    seed.repository.db
      .prepare(
        "UPDATE admin_accounts SET passwordRecord=?,mailboxVerifiedAt=? WHERE id=?",
      )
      .run(JSON.stringify(hash), Date.now(), a.id);
  }
  seed.repository.close();
  writeFileSync(resolve(directory, "supervisor.pid"), String(process.pid), {
    mode: 0o600,
  });
  let stopping = false,
    restarting = false;
  let child: ChildProcess;
  const launch = () => {
    child = spawn(
      process.execPath,
      ["--experimental-strip-types", process.argv[1], "--fixture-child"],
      { stdio: "inherit" },
    );
    child.on("exit", () => {
      if (!restarting && !stopping) process.exitCode = 1;
    });
  };
  launch();
  process.on("SIGUSR2", () => {
    if (stopping || restarting) return;
    restarting = true;
    child.once("exit", () => {
      if (!stopping) launch();
      restarting = false;
    });
    child.kill("SIGTERM");
  });
  const stop = () => {
    stopping = true;
    child.kill("SIGTERM");
  };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
} else {
  const runtime = openAdminRuntime(directory, roots);
  const recovery = new RecoveryService(
    runtime.repository,
    runtime.hasher,
    runtime.abuseKey,
    runtime.mailKey,
    "http://localhost:4329",
  );
  const worker = new MailWorker(
    runtime.repository,
    new Map([["v1", runtime.mailKey]]),
    mailDouble(resolve(directory, "inbox.json")),
  );
  let work: Promise<void> | undefined;
  const timer = setInterval(() => {
    if (!work)
      work = (async () => {
        await worker.tick();
        runtime.repository.purge();
      })().finally(() => {
        work = undefined;
      });
  }, 200);
  const service = new AdminService(
    runtime.repository,
    runtime.hasher,
    runtime.abuseKey,
  );
  const server = createServer(
    createAdminHandler({
      ...runtime,
      service,
      recovery,
      origin: "http://localhost:4329",
      viewsRoot: resolve(".private-build/admin"),
    }),
  );
  server.requestTimeout = 30000;
  server.headersTimeout = 30000;
  server.listen(4329, "127.0.0.1");
  function stop() {
    clearInterval(timer);
    server.close(async () => {
      await work;
      runtime.repository.close();
      process.exit(0);
    });
  }
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}
