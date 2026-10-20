import test from "node:test";
import assert from "node:assert/strict";
import {
  inboxFixture,
  receive,
  input,
} from "./fixtures/inbox-service/helpers.ts";
test("filters, pagination and authenticated cursors share real counts", async () => {
  const f = await inboxFixture();
  try {
    for (let n = 0; n < 28; n++) receive(f, "Consulta " + n);
    const page = f.service.list(f.token, {
      status: "Pendiente",
      cursor: null,
      limit: 25,
    });
    assert.equal(page.items.length, 25);
    assert.equal(page.summary.total, 28);
    assert.ok(page.nextCursor);
    const tail = f.service.list(f.token, {
      status: "Pendiente",
      cursor: page.nextCursor,
      limit: 25,
    });
    assert.equal(tail.items.length, 3);
    assert.equal(
      new Set([...page.items, ...tail.items].map((x) => x.id)).size,
      28,
    );
    assert.throws(() =>
      f.service.list(f.token, {
        status: "Respondido",
        cursor: page.nextCursor,
        limit: 25,
      }),
    );
    assert.throws(() =>
      f.service.list(f.token, {
        status: "Pendiente",
        cursor: page.nextCursor + "x",
        limit: 25,
      }),
    );
    assert.equal(
      f.service.list(f.token, { status: "Respondido", cursor: null, limit: 25 })
        .items.length,
      0,
    );
  } finally {
    f.cleanup();
  }
});
test("history survives new authorized session; deletion removes views and receipts", async () => {
  const f = await inboxFixture();
  try {
    const { id, attempt, data } = receive(f),
      i = input(f, id, "<script>literal</script>");
    f.service.send(f.token, id, i);
    await f.worker.tick();
    assert.equal(f.service.detail(f.token2, id).replies[0].text, i.text);
    assert.equal(
      f.service.list(f.token, { status: "Respondido", cursor: null, limit: 25 })
        .summary.responded,
      1,
    );
    f.contact.revoke(id);
    assert.throws(() => f.service.detail(f.token2, id));
    assert.equal(f.service.summary(f.token2).summary.total, 0);
    assert.equal(f.contact.submit(attempt, data).result, "retired");
    assert.equal(
      f.repo.db.prepare("SELECT count(*) n FROM reply_responses").get()!.n,
      0,
    );
  } finally {
    f.cleanup();
  }
});
