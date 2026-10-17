import {defineConfig,devices} from '@playwright/test';
const tag=process.env.PRIVA_CONTACT_REPORT_TAG==='browser-smoke'?'-browser-smoke':'';
const integration=process.env.PRIVA_TEST_MODE==='integration';
const baseURL=integration?process.env.PRIVA_INTEGRATION_BASE_URL:'http://127.0.0.1:4326';
if(!baseURL)throw new Error('BLOQUEADO 005: falta PRIVA_INTEGRATION_BASE_URL real.');
export const projects=[{name:'chromium',use:{...devices['Desktop Chrome'],launchOptions:process.env.PRIVA_CHROMIUM_EXECUTABLE?{executablePath:process.env.PRIVA_CHROMIUM_EXECUTABLE}:undefined}},{name:'firefox',use:{...devices['Desktop Firefox']}},{name:'webkit',use:{...devices['Desktop Safari']}}];
export default defineConfig({testDir:'./tests/e2e',testMatch:integration?'**/contact-integration.spec.ts':['**/contact.spec.ts','**/contact-accessibility.spec.ts'],outputDir:'.test-output/contact-artifacts'+tag,workers:2,timeout:30000,retries:0,reporter:[['list'],['json',{outputFile:integration?'.test-output/contact-integration-results.json':`.test-output/contact${tag}-results.json`}]],use:{baseURL,trace:'retain-on-failure'},projects,webServer:integration?undefined:{command:'npm run build:contact:contract && python3 -m http.server 4326 --bind 127.0.0.1 --directory .test-output/contact',url:baseURL+'/contacto.html',reuseExistingServer:false,timeout:120000}});
