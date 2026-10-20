import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { contactSummary } from "../server/stories/contact-summary.ts";
import {
  inboxFixture,
  receive,
  input,
} from "./fixtures/inbox-service/helpers.ts";
test("007 and008 count same active consultations, never number of responses", async () => {
  const f = await inboxFixture(Date.now());
  try {
    const { id } = receive(f);
    const path = join(f.dir, "contact.sqlite");
    assert.deepEqual(contactSummary(path), { state: "available", total: 1 });
    f.service.send(f.token, id, input(f, id));
    await f.worker.tick();
    assert.equal(f.service.summary(f.token).summary.total, 1);
    assert.deepEqual(contactSummary(path), { state: "available", total: 1 });
    f.contact.revoke(id);
    assert.deepEqual(contactSummary(path), { state: "available", total: 0 });
    assert.deepEqual(contactSummary(undefined), { state: "unavailable" });
  } finally {
    f.cleanup();
  }
});
