import {
  storyManagementReadiness,
  storyManagementIssues,
} from "../src/config/story-management.ts";
const issues = storyManagementIssues(storyManagementReadiness);
if (issues.length) {
  console.error("BLOQUEADO 007: " + issues.join("; "));
  process.exitCode = 1;
}
