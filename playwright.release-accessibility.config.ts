import {defineConfig} from '@playwright/test';
const tag=process.env.PRIVA_RELEASE_REPORT_TAG==='recheck'?'-recheck':'';
export default defineConfig({
 testDir:'./tests/e2e',testMatch:'release-accessibility.spec.ts',workers:2,timeout:180000,
 outputDir:'.test-output/release-accessibility'+tag,
 reporter:[['list'],['json',{outputFile:'.test-output/release-accessibility'+tag+'-results.json'}]],
 use:{baseURL:process.env.PRIVA_RELEASE_BASE_URL??'https://priva-785cb.web.app',navigationTimeout:30000,actionTimeout:10000,trace:'off',video:'off',screenshot:'off',browserName:'chromium',launchOptions:{executablePath:process.env.PRIVA_CHROMIUM_EXECUTABLE}},
});
