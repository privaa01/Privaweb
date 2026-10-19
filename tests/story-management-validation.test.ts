import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyDraft } from "../src/lib/story-management-contract.ts";
import { validateDraft } from "../src/lib/story-management-validation.ts";
test("incomplete draft allowed; publication needs all approved fields", () => {
  assert.deepEqual(validateDraft({}).title, "");
  assert.throws(() => validateDraft({}, true));
});
test("Unicode code points, whitespace, exact fields and safe text", () => {
  const d = emptyDraft();
  d.title = "😀".repeat(160);
  assert.equal([...validateDraft(d).title].length, 160);
  d.title += "😀";
  assert.throws(() => validateDraft(d));
  d.title = " x\u0000";
  assert.throws(() => validateDraft(d));
  assert.throws(() => validateDraft({ ...emptyDraft(), score: 1 }));
  d.title = "<script>alert(1)</script>";
  assert.equal(validateDraft(d).title, d.title);
});
test("exactly three distinct stable options, text constraints and typed references", () => {
  const d = emptyDraft();
  for (const n of [0, 2, 4])
    assert.throws(() =>
      validateDraft({ ...d, options: Array(n).fill(d.options[0]) }),
    );
  assert.throws(() => validateDraft({ ...d, imageResourceId: "/etc/passwd" }));
  assert.throws(() =>
    validateDraft({
      ...d,
      options: [d.options[0], d.options[0], d.options[2]],
    }),
  );
});
