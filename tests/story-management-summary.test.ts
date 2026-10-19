import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { chmodSync } from "node:fs";
import { join } from "node:path";
import { contactSummary } from "../server/stories/contact-summary.ts";
import {
  storyFixture,
  create,
  complete,
  save,
  publish,
  activate,
} from "./fixtures/story-management-service/helpers.ts";
test("global counts published pending work once, real contact total/unavailable never fabricated zero", async () => {
  const f = await storyFixture();
  try {
    const path = join(f.dir, "contact.sqlite");
    const db = new DatabaseSync(path);
    chmodSync(path, 0o600);
    db.exec(
      "CREATE TABLE consultations(id TEXT PRIMARY KEY,status TEXT); INSERT INTO consultations VALUES('one','Pendiente')",
    );
    f.service.contactCount = () => contactSummary(path);
    const a = create(f),
      d = complete(f, a.storyId);
    create(f);
    save(f, a.storyId, d);
    publish(f, a.storyId);
    activate(f, a.storyId);
    save(f, a.storyId, { ...d, title: "Nueva revisión" });
    assert.deepEqual(f.service.list(f.token).summary, {
      active: 1,
      drafts: 1,
      contact: { state: "available", total: 1 },
    });
    db.exec("UPDATE consultations SET status='Respondido'");
    assert.equal(contactSummary(path).state, "available");
    assert.deepEqual(contactSummary(path), { state: "available", total: 1 });
    db.exec("DELETE FROM consultations");
    assert.deepEqual(contactSummary(path), { state: "available", total: 0 });
    db.close();
    assert.deepEqual(contactSummary(undefined), { state: "unavailable" });
    assert.deepEqual(contactSummary("/missing"), { state: "unavailable" });
  } finally {
    f.cleanup();
  }
});

test("actual 005 signed submission/dedup/removal feeds authorized 007 HTTP aggregate without contact data", async () => {
  const { SqliteContactRepository } =
    await import("../server/contact/sqlite-repository.ts");
  const { AttemptTokens } = await import("../server/contact/attempt-token.ts");
  const { createServer } = await import("node:http");
  const { createStoriesHandler } = await import("../server/stories/http.ts");
  const { SESSION_COOKIE } = await import("../server/admin/sessions.ts");
  const f = await storyFixture(),
    path = join(f.dir, "contact-real.sqlite"),
    tokens = new AttemptTokens(f.abuseKey, f.time),
    contact = new SqliteContactRepository(path, tokens, { clock: f.time });
  f.service.contactCount = () => contactSummary(path);
  const handler = createStoriesHandler({
      service: f.service,
      media: f.media,
      origin: "https://admin.example.test",
      csrfKey: f.csrfKey,
    }),
    server = createServer(async (q, r) => {
      if (!(await handler(q, r))) {
        r.writeHead(404);
        r.end();
      }
    });
  await new Promise<void>((yes) => server.listen(0, "127.0.0.1", yes));
  try {
    const base =
      "http://127.0.0.1:" + (server.address() as { port: number }).port;
    const query = async () => {
      const r = await fetch(base + "/api/admin/historias", {
        headers: {
          "X-Priva-Request": "1",
          Cookie: `${SESSION_COOKIE}=${f.token}`,
        },
      });
      assert.equal(r.status, 200);
      const text = await r.text();
      assert.equal(text.includes("private-contact@example.test"), false);
      assert.equal(text.includes("mensaje privado sintético"), false);
      return JSON.parse(text).summary.contact;
    };
    assert.deepEqual(await query(), { state: "available", total: 0 });
    const attempt = tokens.issue(),
      input = {
        nameOrAlias: "Alias sintético",
        email: "private-contact@example.test",
        message: "mensaje privado sintético",
      };
    assert.equal(contact.submit(attempt, input).result, "stored");
    assert.equal(contact.submit(attempt, input).result, "stored");
    assert.deepEqual(await query(), { state: "available", total: 1 });
    const id = contact.db.prepare("SELECT id FROM consultations").get()!
      .id as string;
    contact.revoke(id);
    assert.deepEqual(await query(), { state: "available", total: 0 });
    f.service.contactCount = () => contactSummary("/missing");
    assert.deepEqual(await query(), { state: "unavailable" });
  } finally {
    server.closeAllConnections();
    await new Promise<void>((yes) => server.close(() => yes()));
    contact.close();
    f.cleanup();
  }
});
