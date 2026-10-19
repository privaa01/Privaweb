// Prevent Playwright failure snapshots from persisting entered secrets. Traces/video/screenshots are also off.
process.env.PLAYWRIGHT_NO_COPY_PROMPT = "1";
import { defineConfig } from "@playwright/test";
import { projects } from "./playwright.admin.projects";
const tag = ["browser-smoke", "session"].includes(
  process.env.PRIVA_ADMIN_REPORT_TAG ?? "",
)
  ? "-" + process.env.PRIVA_ADMIN_REPORT_TAG
  : "";
const integration = process.env.PRIVA_TEST_MODE === "integration";
const baseURL = integration
  ? process.env.PRIVA_INTEGRATION_BASE_URL
  : "http://localhost:4328";
if (!baseURL)
  throw new Error("BLOQUEADO 006: falta PRIVA_INTEGRATION_BASE_URL real");
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: integration
    ? "**/admin-integration.spec.ts"
    : [
        "**/admin-access.spec.ts",
        "**/admin-session.spec.ts",
        "**/admin-recovery.spec.ts",
        "**/admin-accessibility.spec.ts",
      ],
  outputDir: ".test-output/admin-artifacts" + tag,
  workers: 1,
  timeout: 30000,
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: integration
          ? ".test-output/admin-integration-results.json"
          : `.test-output/admin${tag}-results.json`,
      },
    ],
  ],
  use: { baseURL, trace: "off", screenshot: "off", video: "off" },
  projects,
  webServer: integration
    ? undefined
    : {
        command:
          "npm run build:admin:contract && python3 tests/fixtures/admin/serve.py",
        url: baseURL + "/admin/login",
        reuseExistingServer: false,
        timeout: 120000,
      },
});
