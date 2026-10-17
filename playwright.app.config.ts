import { defineConfig, devices } from '@playwright/test';
const integrated = process.env.PRIVA_TEST_MODE === 'integration';
const baseURL = integrated ? process.env.PRIVA_INTEGRATION_BASE_URL : 'http://127.0.0.1:4325';
if (integrated && !baseURL) throw new Error('BLOQUEADO 004: falta PRIVA_INTEGRATION_BASE_URL real; no usar fixtures.');
export default defineConfig({
 testDir: './tests/e2e', testMatch: integrated ? '**/app-integration.spec.ts' : ['**/app.spec.ts', '**/app-accessibility.spec.ts'],
 outputDir: '.test-output/app-artifacts', fullyParallel: true, workers: 2, timeout: 30000, retries: 0,
 reporter: [['list'], ['json', { outputFile: integrated ? '.test-output/app-integration-results.json' : '.test-output/app-results.json' }]],
 use: { baseURL, trace: 'retain-on-failure' },
 projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: process.env.PRIVA_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PRIVA_CHROMIUM_EXECUTABLE } : undefined } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
 ],
 webServer: integrated ? undefined : { command: 'npm run build:app:contract && python3 -m http.server 4325 --bind 127.0.0.1 --directory .test-output/app', url: baseURL, reuseExistingServer: false, timeout: 120000 },
});
