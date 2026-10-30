import {defineConfig,devices} from '@playwright/test';
const published=process.env.PRIVA_NAVIGATION_TARGET==='published';
const baseURL=published?process.env.PRIVA_INTEGRATION_BASE_URL:'http://127.0.0.1:4340';
if(!baseURL)throw Error('Falta la URL publicada para verificar navegación demo.');
const chrome={name:'chromium',use:{...devices['Desktop Chrome'],launchOptions:process.env.PRIVA_CHROMIUM_EXECUTABLE?{executablePath:process.env.PRIVA_CHROMIUM_EXECUTABLE}:undefined}};
export default defineConfig({testDir:'./tests/e2e',testMatch:'navigation-demo.spec.ts',grep:published?/Demo publicada/:/Demo matriz/,
 projects:published?[chrome,{name:'firefox',use:devices['Desktop Firefox']},{name:'webkit',use:devices['Desktop Safari']}]:[chrome],
 fullyParallel:!published,workers:2,timeout:180000,retries:0,outputDir:published?'.test-output/navigation-demo-published-artifacts':'.test-output/navigation-demo-matrix-artifacts',
 reporter:[['list'],['json',{outputFile:published?'.test-output/navigation-demo-published.json':'.test-output/navigation-demo-matrix.json'}]],
 use:{baseURL,trace:'off',video:'off',screenshot:'off'},
 webServer:published?undefined:{command:'node scripts/build-demo.mjs && python3 scripts/serve-navigation-demo.py',url:baseURL,timeout:120000,reuseExistingServer:false},
});
