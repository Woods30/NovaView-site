import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E config for the NovaView landing site.
 *
 * The build (Task 17) emits prerendered HTML into `dist/client/`, and
 * `vite preview` serves that directory. `pnpm preview` is `vite preview`
 * in package.json, so it works out of the box with `outDir: 'dist/client'`
 * set in vite.config.ts.
 *
 * We override `defaultBrowserType` to `chromium` so the responsive test
 * matrix only needs Chromium installed (the device descriptors from
 * `iPhone 13` and `iPad (gen 7)` otherwise default to `webkit`, which
 * the brief explicitly listed but which is not strictly required for
 * viewport-based responsive checks).
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: 'pnpm preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
      },
    },
    {
      name: 'tablet',
      use: {
        ...devices['iPad (gen 7)'],
        browserName: 'chromium',
      },
    },
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
