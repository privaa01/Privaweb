import { defineConfig, devices } from '@playwright/test';
const integrated = process.env.PRIVA_TEST_MODE === 'integration';
const baseURL = integrated ? process.env.PRIVA_INTEGRATION_BASE_URL : 'http://127.0.0.1:4324';
if (integrated && !baseURL) throw new Error('BLOQUEADO 003: falta PRIVA_INTEGRATION_BASE_URL real; no usar fixtures.');
export default defineConfig({
 testDir: './tests/e2e', testMatch: integrated ? '**/stories-integration.spec.ts' : ['**/stories.spec.ts', '**/stories-accessibility.spec.ts'],
 outputDir: '.test-output/stories-artifacts', fullyParallel: true, workers: 2, timeout: 30000, retries: 0,
 reporter: [['list'], ['json', { outputFile: integrated ? '.test-output/stories-integration-results.json' : '.test-output/stories-results.json' }]],
 use: { baseURL, trace: 'retain-on-failure' },
 projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: process.env.PRIVA_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PRIVA_CHROMIUM_EXECUTABLE } : undefined } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
 ],
 webServer: integrated ? undefined : { command: 'npm run build:stories:contract && python3 tests/fixtures/stories/serve.py', url: baseURL, reuseExistingServer: false, timeout: 120000 },
});
