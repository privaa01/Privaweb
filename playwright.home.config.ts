import { defineConfig, devices } from '@playwright/test';
const integrated = process.env.PRIVA_TEST_MODE === 'integration';
const baseURL = integrated ? process.env.PRIVA_INTEGRATION_BASE_URL : 'http://127.0.0.1:4323';
if (integrated && !baseURL) throw new Error('BLOQUEADO 002: falta PRIVA_INTEGRATION_BASE_URL real; no usar fixtures.');
export default defineConfig({
 testDir: './tests/e2e', testMatch: integrated ? '**/home-integration.spec.ts' : ['**/home.spec.ts', '**/home-accessibility.spec.ts'],
 outputDir: '.test-output/home-artifacts', fullyParallel: true, workers: 2, timeout: 30000, retries: 0,
 reporter: [['list'], ['json', { outputFile: integrated ? '.test-output/home-integration-results.json' : '.test-output/home-results.json' }]],
 use: { baseURL, trace: 'retain-on-failure' },
 projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: process.env.PRIVA_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PRIVA_CHROMIUM_EXECUTABLE } : undefined } },
  { name: 'firefox', grepInvert: /matriz Inicio/, use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', grepInvert: /matriz Inicio/, use: { ...devices['Desktop Safari'] } },
 ],
 webServer: integrated ? undefined : { command: 'npm run build:home:contract && python3 -m http.server 4323 --bind 127.0.0.1 --directory .test-output/home', url: baseURL, reuseExistingServer: false, timeout: 120000 },
});
