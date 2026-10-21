import { defineConfig, devices } from '@playwright/test';
const integrated = process.env.PRIVA_TEST_MODE === 'integration';
const baseURL = integrated ? process.env.PRIVA_INTEGRATION_BASE_URL : 'http://127.0.0.1:4322';
if (integrated && !baseURL) throw new Error('BLOQUEADO T021/T027: falta PRIVA_INTEGRATION_BASE_URL real; no se usarán fixtures.');
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: integrated ? '**/navigation-integration.spec.ts' : ['**/navigation.spec.ts', '**/navigation-accessibility.spec.ts', '**/navigation-brand.spec.ts'],
  fullyParallel: true, workers: 2, retries: 0, timeout: 30000,
  reporter: [['list'], ['json', { outputFile: integrated ? '.test-output/integration-results.json' : '.test-output/contract-results.json' }]],
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [ { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: process.env.PRIVA_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PRIVA_CHROMIUM_EXECUTABLE } : undefined } }, { name: 'firefox', use: { ...devices['Desktop Firefox'] } }, { name: 'webkit', use: { ...devices['Desktop Safari'] } } ],
  webServer: integrated ? undefined : { command: 'npm run build:contract && python3 tests/fixtures/navigation/serve.py', url: baseURL, reuseExistingServer: false, timeout: 120000 },
});
