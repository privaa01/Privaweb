import { defineConfig } from "@playwright/test";
import { projects } from "./playwright.admin.projects";
export default defineConfig({
  testDir: "./tests",
  testMatch: ["privacy-service.spec.ts", "privacy-tracking.spec.ts"],
  workers: 1,
  timeout: 30000,
  projects,
  use: { trace: "off", screenshot: "off", video: "off" },
  outputDir: ".test-output/privacy-service-artifacts",
  reporter: [
    ["list"],
    ["json", { outputFile: ".test-output/privacy-service-results.json" }],
  ],
});
