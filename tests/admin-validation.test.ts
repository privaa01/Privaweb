import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateEmail,
  validateNewPassword,
  validateLoginPassword,
} from "../src/lib/admin-validation.ts";
test("email trims, validates like Contacto, lowercases only identity", () => {
  assert.deepEqual(validateEmail(" A.B+tag@Example.COM "), {
    email: "A.B+tag@Example.COM",
    emailKey: "a.b+tag@example.com",
  });
  for (const e of [
    "",
    "x@y",
    "a@b..com",
    "a\n@b.co",
    "x".repeat(250) + "@a.co",
  ])
    assert.equal(validateEmail(e), null);
});
test("new password 15–128 codepoints, preserves spaces and Unicode", () => {
  for (const n of [15, 128])
    assert.equal(validateNewPassword("😀".repeat(n)), true);
  for (const n of [14, 129])
    assert.equal(validateNewPassword("😀".repeat(n)), false);
  assert.equal(validateNewPassword("  a long password  "), true);
  assert.equal(validateNewPassword("a".repeat(15) + "\u0000"), false);
  assert.equal(validateNewPassword("a".repeat(15) + "\ud800"), false);
  assert.equal(
    validateNewPassword("abcdefghijklmnop", (p) => p === "abcdefghijklmnop"),
    false,
  );
  assert.equal(validateNewPassword("e\u0301".repeat(8)), true);
});
test("login structure does not impose new-password minimum or query existence", () => {
  assert.equal(validateLoginPassword("old"), true);
  assert.equal(validateLoginPassword(""), false);
  assert.equal(validateLoginPassword("x".repeat(129)), false);
});
test("email maximum counts Unicode codepoints, not UTF-16 code units", () => {
  const valid = "😀".repeat(248) + "@a.com";
  assert.ok(validateEmail(valid));
  assert.equal(validateEmail("😀".repeat(249) + "@a.com"), null);
});
