import {defineConfig} from '@playwright/test';
import {projects} from './playwright.contact.config';
const baseURL=process.env.PRIVA_DEMO_URL;
if(!baseURL)throw Error('Falta PRIVA_DEMO_URL real; no usar fixtures.');
export default defineConfig({testDir:'./tests/e2e',testMatch:'**/contact-demo.spec.ts',projects,workers:2,fullyParallel:true,timeout:30000,retries:0,
 outputDir:'.test-output/contact-demo-artifacts',reporter:[['list'],['json',{outputFile:'.test-output/contact-demo-results.json'}]],
 use:{baseURL,trace:'off',screenshot:'off',video:'off'}});
