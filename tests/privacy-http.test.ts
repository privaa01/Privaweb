import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { privacyHarness } from "./helpers/privacy-service-harness.ts";
import { receive } from "./helpers/privacy-fixtures.ts";
test("V12 HTTP rejects direct anonymous, revoked, cross-origin/CSRF and oversize requests", async () => {
  const f = await privacyHarness();
  try {
    const url = f.origin + "/api/admin/privacidad/solicitudes/" + randomUUID();
    let response = await fetch(url, { headers: { "x-priva-request": "1" } });
    assert.equal(response.status, 401);
    response = await fetch(url, {
      headers: { ...f.headers, origin: "https://attacker.invalid" },
    });
    assert.equal(response.status, 403);
    response = await fetch(f.origin + "/api/admin/privacidad/solicitudes", {
      method: "POST",
      headers: { ...f.headers, "x-csrf-token": "invalid" },
      body: "{}",
    });
    assert.equal(response.status, 403);
    response = await fetch(f.origin + "/api/admin/privacidad/solicitudes", {
      method: "POST",
      headers: f.headers,
      body: JSON.stringify({ payload: "x".repeat(17000) }),
    });
    assert.equal(response.status, 413);
    f.repository.logout(f.token);
    response = await fetch(url, { headers: f.headers });
    assert.equal(response.status, 401);
  } finally {
    await f.stop();
  }
});
test("V05–V08 real HTTP create/recover/confirm returns no code and logs contain no PII", async () => {
  const f = await privacyHarness();
  try {
    const { id } = receive(f),
      requestId = randomUUID(),
      url = f.origin + "/api/admin/privacidad/solicitudes",
      body = JSON.stringify({ requestId, targets: [{ id, revision: 1 }] });
    const first = await fetch(url, {
      method: "POST",
      headers: f.headers,
      body,
    });
    assert.equal(first.status, 202);
    const result = await first.json();
    const replay = await fetch(url, {
      method: "POST",
      headers: f.headers,
      body,
    });
    assert.deepEqual(await replay.json(), result);
    await f.mailWorker.tick();
    const code = f.confirmationMail.payloads[0].text.match(/[A-Z2-7]{16}/)![0];
    assert(!JSON.stringify(result).includes(code));
    const response = await fetch(url + "/" + requestId + "/confirmar", {
      method: "POST",
      headers: f.headers,
      body: JSON.stringify({ code }),
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(((await response.json()) as any).state, "confirmed");
    const second = await fetch(url + "/" + requestId + "/confirmar", {
      method: "POST",
      headers: f.headers,
      body: JSON.stringify({ code }),
    });
    assert.equal(second.status, 422);
    assert(!JSON.stringify(f.events).includes(code));
    assert(!JSON.stringify(f.events).includes(f.token));
    assert(!JSON.stringify(f.events).includes("visitor@example.com"));
  } finally {
    await f.stop();
  }
});

test("lost response after contact commit recovers requestId without duplicated outbox", async () => {
  const f = await privacyHarness();
  try {
    const { id } = receive(f),
      requestId = randomUUID(),
      url = f.origin + "/api/admin/privacidad/solicitudes",
      body = JSON.stringify({ requestId, targets: [{ id, revision: 1 }] });
    f.p.failure = () => {
      f.p.failure = undefined;
      throw Error("Synthetic failure after commit");
    };
    const first = await fetch(url, {
      method: "POST",
      headers: f.headers,
      body,
    });
    assert.equal(first.status, 503);
    const retry = await fetch(url, {
      method: "POST",
      headers: f.headers,
      body,
    });
    assert.equal(retry.status, 202);
    assert.equal(
      f.p.db.prepare("SELECT count(*) n FROM privacy_mail_operations").get()!.n,
      1,
    );
    await f.mailWorker.tick();
    assert.equal(f.confirmationMail.calls, 1);
  } finally {
    await f.stop();
  }
});
