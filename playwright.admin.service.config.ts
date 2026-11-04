// Prevent Playwright failure snapshots from persisting entered secrets. Traces/video/screenshots are also off.
process.env.PLAYWRIGHT_NO_COPY_PROMPT = "1";
import { defineConfig } from "@playwright/test";
import { projects } from "./playwright.admin.projects";
const hasCert=Boolean(process.env.PRIVA_ADMIN_TEST_TLS_CERT),hasKey=Boolean(process.env.PRIVA_ADMIN_TEST_TLS_KEY);
if(hasCert!==hasKey)throw Error("TLS fixture requires both certificate and private key paths.");
const baseURL=`${hasCert?"https":"http"}://localhost:4329`;
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/admin-service.spec.ts",
  outputDir: ".test-output/admin-service-artifacts",
  workers: 1,
  timeout: 60000,
  reporter: [
    ["list"],
    ["json", { outputFile: ".test-output/admin-service-results.json" }],
  ],
  use: {
    baseURL,
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects,
  webServer: {
    command:
      "npm run build:admin:views:local && node --experimental-strip-types tests/fixtures/admin-service/serve.ts",
    url: baseURL+"/admin/login",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
