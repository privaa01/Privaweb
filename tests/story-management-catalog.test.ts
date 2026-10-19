import { test } from "node:test";
import assert from "node:assert/strict";
import { fixtureCatalog } from "./fixtures/stories/src/content.ts";
import { parseCatalog } from "../src/lib/stories-contract.ts";
test("editorial question supported without changing initial literal or relaxing DTO shape", () => {
  const p = { baseURL: "https://priva.test", mediaOrigins: [] };
  const c = structuredClone(fixtureCatalog);
  assert.equal(c.stories[0].question, "¿QUÉ ERROR SE COMETIÓ?");
  c.stories[0].question = "¿Qué riesgo identificarías?";
  assert.equal(parseCatalog(c, p).stories[0].question, c.stories[0].question);
  c.stories[0].question = "  ";
  assert.throws(() => parseCatalog(c, p));
});
