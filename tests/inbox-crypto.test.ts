import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { ReplyCrypto } from "../server/inbox/crypto.ts";
test("reply envelopes authenticate payload, key version and operation binding", () => {
  const c = new ReplyCrypto(new Map([["v1", randomBytes(32)]])),
    sealed = c.seal("operation:consultation:actor:delivery", {
      text: "private synthetic",
    });
  assert.deepEqual(c.open("operation:consultation:actor:delivery", sealed), {
    text: "private synthetic",
  });
  assert.throws(() => c.open("another-operation", sealed));
  const v = JSON.parse(sealed);
  v.data = Buffer.from("tampered").toString("base64");
  assert.throws(() =>
    c.open("operation:consultation:actor:delivery", JSON.stringify(v)),
  );
  assert.throws(() =>
    new ReplyCrypto(new Map([["v2", randomBytes(32)]]), "v2").open(
      "operation:consultation:actor:delivery",
      sealed,
    ),
  );
});
