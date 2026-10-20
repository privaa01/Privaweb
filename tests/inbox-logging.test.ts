import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { createInboxHandler } from "../server/inbox/http.ts";
import { SESSION_COOKIE } from "../server/admin/sessions.ts";
import { inboxFixture, receive } from "./fixtures/inbox-service/helpers.ts";
test("logs contain allowlisted event, code and duration only", async () => {
  const f = await inboxFixture();
  let server: ReturnType<typeof createServer> | undefined;
  try {
    receive(f);
    const entries: unknown[] = [];
    let origin = "";
    server = createServer((req, res) => {
      void createInboxHandler({
        service: f.service,
        origin,
        csrfKey: f.csrfKey,
        log: (e) => entries.push(e),
      })(req, res);
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    origin = "http://127.0.0.1:" + (server.address() as any).port;
    await fetch(origin + "/api/admin/contacto/resumen", {
      headers: {
        "X-Priva-Request": "1",
        Cookie: SESSION_COOKIE + "=" + f.token,
      },
    });
    assert.deepEqual(Object.keys(entries[0] as object).sort(), [
      "code",
      "duration",
      "event",
    ]);
    const text = JSON.stringify(entries);
    assert.ok(
      !text.includes(f.token) &&
        !text.includes("visitor@example.com") &&
        !text.includes("Alias sintético"),
    );
  } finally {
    if (server) await new Promise<void>((r) => server!.close(() => r()));
    f.cleanup();
  }
});
