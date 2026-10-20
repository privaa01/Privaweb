import { defineConfig } from "@playwright/test";
import { projects } from "./playwright.admin.projects";
process.env.PLAYWRIGHT_NO_COPY_PROMPT = "1";
const integration = process.env.PRIVA_TEST_MODE === "integration";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "inbox-*.spec.ts",
  testIgnore: "inbox-mock.spec.ts",
  outputDir: integration
    ? ".test-output/inbox-integration-artifacts"
    : ".test-output/inbox-service-artifacts",
  workers: 1,
  timeout: 60000,
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: integration
          ? ".test-output/inbox-integration-results.json"
          : ".test-output/inbox-service-results.json",
      },
    ],
  ],
  use: {
    baseURL: "http://localhost:4333",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects,
  webServer: {
    command:
      "npm run build:admin:views:local && node --experimental-strip-types tests/fixtures/inbox-service/serve.ts",
    url: "http://localhost:4333/admin/login",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
