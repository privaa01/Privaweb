import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { privacyHarness } from "./helpers/privacy-service-harness.ts";
import { receive } from "./helpers/privacy-fixtures.ts";
test("browser submits scoped request and explicit confirmation to real protected service", async ({
  page,
  context,
}) => {
  const f = await privacyHarness();
  try {
    const { id } = receive(f),
      requestId = randomUUID();
    await context.addCookies([
      {
        name: "__Host-priva_session",
        value: f.token,
        domain: "localhost",
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    await page.goto(f.origin);
    const headers = {
      "x-priva-request": "1",
      "content-type": "application/json",
      "x-csrf-token": f.headers["x-csrf-token"],
    };
    const first = await page.evaluate(
      async ({ requestId, id, headers }) => {
        const res = await fetch("/api/admin/privacidad/solicitudes", {
          method: "POST",
          headers,
          body: JSON.stringify({ requestId, targets: [{ id, revision: 1 }] }),
        });
        return { status: res.status, value: await res.json() };
      },
      { requestId, id, headers },
    );
    expect(first.status).toBe(202);
    await f.mailWorker.tick();
    const code = f.confirmationMail.payloads[0].text.match(/[A-Z2-7]{16}/)![0];
    expect(JSON.stringify(first.value)).not.toContain(code);
    const confirmed = await page.evaluate(
      async ({ requestId, code, headers }) => {
        const res = await fetch(
          "/api/admin/privacidad/solicitudes/" + requestId + "/confirmar",
          { method: "POST", headers, body: JSON.stringify({ code }) },
        );
        return { status: res.status, value: await res.json() };
      },
      { requestId, code, headers },
    );
    expect(confirmed.status).toBe(200);
    expect(confirmed.value.deadlineAt).toBe(f.time() + 86400000);
    await f.privacyWorker.tick();
    expect(
      f.p.db.prepare("SELECT count(*) n FROM consultations").get()!.n,
    ).toBe(0);
  } finally {
    await f.stop();
  }
});
test("browser cross-origin/unauthenticated operation cannot confirm", async ({
  page,
}) => {
  const f = await privacyHarness();
  try {
    await page.goto(f.origin);
    const status = await page.evaluate(async () => {
      const res = await fetch("/api/admin/privacidad/solicitudes", {
        method: "POST",
        headers: { "x-priva-request": "1", "content-type": "application/json" },
        body: "{}",
      });
      return res.status;
    });
    expect(status).toBe(401);
  } finally {
    await f.stop();
  }
});
