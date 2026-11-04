import { defineConfig } from '@playwright/test';

// Read-only checks against the already published demonstration, not production qualification.
export default defineConfig({
  testDir:'./tests/e2e',testMatch:'documents-demo.spec.ts',workers:1,timeout:120000,
  outputDir:'.test-output/documents-demo-artifacts',
  reporter:[['list'],['json',{outputFile:'.test-output/documents-demo-results.json'}]],
  use:{baseURL:process.env.PRIVA_DOCUMENTS_DEMO_BASE_URL??'https://priva-785cb.web.app',trace:'off',video:'off',screenshot:'off',
    browserName:'chromium',launchOptions:{executablePath:process.env.PRIVA_CHROMIUM_EXECUTABLE}},
});
