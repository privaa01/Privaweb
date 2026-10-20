import test from "node:test";
import assert from "node:assert/strict";
import { replyText } from "../src/lib/inbox-validation.ts";
for (const v of [
  "",
  "   ",
  "a".repeat(5001),
  "bad\0text",
  "bad\u0001text",
  "\ud800",
  "\udc00",
])
  test("rejects invalid reply " + JSON.stringify(v.slice(0, 12)), () =>
    assert.throws(() => replyText(v)),
  );
test("Unicode points, whitespace and CRLF boundaries", () => {
  assert.equal(replyText(" 🙂\r\n \tword "), "🙂\n \tword");
  assert.equal([...replyText("🙂".repeat(5000))].length, 5000);
  assert.equal(replyText("a"), "a");
});
