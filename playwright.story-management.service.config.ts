process.env.PLAYWRIGHT_NO_COPY_PROMPT = "1";
import { defineConfig } from "@playwright/test";
import { projects } from "./playwright.admin.projects";
if (process.env.PRIVA_TEST_MODE === "integration")
  throw Error(
    "Integración productiva007 no calificada: configurar entorno y materiales reales; no usar fixtures.",
  );
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/story-management-*.spec.ts",
  outputDir: ".test-output/story-management-artifacts",
  workers: 1,
  timeout: 60000,
  reporter: [
    ["list"],
    [
      "json",
      { outputFile: ".test-output/story-management-service-results.json" },
    ],
  ],
  use: {
    baseURL: "http://localhost:4331",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects,
  webServer: {
    command:
      "npm run build:admin:views:local && npm run build:stories:contract && node --experimental-strip-types tests/fixtures/story-management-service/serve.ts",
    url: "http://localhost:4331/admin/login",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
