import {defineConfig} from '@playwright/test';
import {projects} from './playwright.contact.config';
export default defineConfig({
 testDir:'./tests/e2e',testMatch:'**/contact-development.spec.ts',workers:1,timeout:30000,retries:0,
 outputDir:'.test-output/contact-development-artifacts',
 reporter:[['list'],['json',{outputFile:'.test-output/contact-development-results.json'}]],
 use:{baseURL:process.env.PRIVA_CONTACT_TEST_ORIGIN??'http://127.0.0.1:4321',trace:'retain-on-failure'},
 projects:projects.map(project=>({...project,...(project.name!=='chromium'?{grepInvert:/MVP matriz/}:{})})),
});
