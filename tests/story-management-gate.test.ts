import { test } from "node:test";
import assert from "node:assert/strict";
import {
  storyManagementReadiness,
  storyManagementIssues,
} from "../src/config/story-management.ts";
test("delivery gate rejects real pending operation and fixtures", () => {
  assert.ok(storyManagementIssues(storyManagementReadiness).length >= 9);
  assert.ok(
    storyManagementIssues({
      ...storyManagementReadiness,
      testOnly: true,
    }).includes("fixture no publicable"),
  );
});
