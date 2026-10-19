import { test } from "node:test";
import assert from "node:assert/strict";
import { adminContent } from "../src/content/admin.ts";
import { adminReadiness } from "../src/config/admin.ts";
import { adminPublicationIssues } from "../src/lib/admin-publication.ts";
test("publication blocks missing copy/assets/operation, fixtures and stale copy review", () => {
  assert.ok(adminPublicationIssues(adminContent, adminReadiness).length >= 10);
  const ready = {
    ...adminReadiness,
    reviewedContent: { ...adminContent },
    officialBrand: "/brand/synthetic.svg",
    references: Object.fromEntries(
      Object.keys(adminReadiness.references).map((k) => [
        k,
        "synthetic reviewed ref",
      ]),
    ),
  };
  assert.deepEqual(adminPublicationIssues(adminContent, ready), []);
  assert.ok(
    adminPublicationIssues({ ...adminContent, testOnly: true }, ready).length >
      0,
  );
  assert.ok(
    adminPublicationIssues({ ...adminContent, welcome: "changed" }, ready)
      .length > 0,
  );
  assert.ok(
    adminPublicationIssues(adminContent, { ...ready, testOnly: true }).length >
      0,
  );
});
