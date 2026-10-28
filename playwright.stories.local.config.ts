import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/e2e',testMatch:'**/stories-local.spec.ts',
 outputDir:'.test-output/stories-local-artifacts',workers:1,retries:0,
 reporter:[['list'],['json',{outputFile:'.test-output/stories-local-results.json'}]],
 use:{baseURL:process.env.PRIVA_INTEGRATION_BASE_URL??'http://127.0.0.1:4321',trace:'retain-on-failure'},
 projects:[
  {name:'chromium',use:{...devices['Desktop Chrome'],launchOptions:process.env.PRIVA_CHROMIUM_EXECUTABLE?{executablePath:process.env.PRIVA_CHROMIUM_EXECUTABLE}:undefined}},
  {name:'firefox',use:{...devices['Desktop Firefox']}},
  {name:'webkit',use:{...devices['Desktop Safari']}},
 ],
});
