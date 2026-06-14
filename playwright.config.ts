import { defineConfig, devices } from '@playwright/test';

const isWindowsCi = process.env.CI && process.platform === 'win32';

export default defineConfig({
  testDir: './tests/e2e',
  // Windows GitHub runners occasionally spend >30s closing Chromium contexts.
  // Keep local/Linux timeout tight, but give Windows CI teardown enough headroom.
  timeout: isWindowsCi ? 90_000 : 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  // Windows hosted runners have shown Chromium context teardown stalls under
  // parallel e2e load. Keep test coverage unchanged while avoiding contention.
  workers: isWindowsCi ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'bun run build && bun run preview --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
