import { defineConfig, devices } from '@playwright/test';

const appPort = Number(process.env.PLAYWRIGHT_APP_PORT ?? 3000);
const mockBackendPort = Number(process.env.PLAYWRIGHT_MOCK_API_PORT ?? 4100);
const appBaseUrl = `http://127.0.0.1:${appPort}`;
const mockApiBaseUrl = `http://127.0.0.1:${mockBackendPort}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html'], ['list']] : 'list',
  use: {
    baseURL: appBaseUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: [
    {
      command: 'npm run e2e:mock-backend',
      url: `${mockApiBaseUrl}/__test/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        MOCK_BACKEND_PORT: String(mockBackendPort),
      },
    },
    {
      command: `npm run dev -- --hostname 127.0.0.1 --port ${appPort}`,
      url: `${appBaseUrl}/en/login`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_API_URL: mockApiBaseUrl,
      },
    },
  ],
});
