import { defineConfig } from "@playwright/test";
import { projects } from "./playwright.admin.projects";
process.env.PLAYWRIGHT_NO_COPY_PROMPT = "1";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "inbox-mock.spec.ts",
  outputDir: ".test-output/inbox-ui-artifacts",
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: ".test-output/inbox-ui-results.json" }],
  ],
  use: {
    baseURL: "http://localhost:4332",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects,
  webServer: {
    command:
      "npm run build:inbox:contract && python3 -m http.server 4332 --bind 127.0.0.1 --directory .test-output/inbox-ui",
    url: "http://localhost:4332/contacto",
    reuseExistingServer: false,
  },
});
