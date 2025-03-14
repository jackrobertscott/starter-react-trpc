import {defineConfig, devices} from "@playwright/test"
import {resolve} from "path"

const THIS_DIR = new URL(".", import.meta.url).pathname

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.test.ts",

  /* Global setup for all tests */
  globalSetup: resolve(THIS_DIR, "./src/test-global-setup.ts"),
  globalTeardown: resolve(THIS_DIR, "./src/test-global-teardown.ts"),

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {...devices["Desktop Chrome"]},
    },
    // {
    //   name: "firefox",
    //   use: {...devices["Desktop Firefox"]},
    // },
    // {
    //   name: "webkit",
    //   use: {...devices["Desktop Safari"]},
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      port: 3000,
      command: "cd ../browser && npm run dev",
      // url: "http://localhost:3000",
      reuseExistingServer: true,
    },
    {
      port: 4000,
      command: "cd ../server && npm run dev",
      // url: "http://localhost:4000",
      reuseExistingServer: true,
    },
  ],
})
