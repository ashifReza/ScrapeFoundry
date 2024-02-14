// @ts-check
const { defineConfig, devices } = require("@playwright/test");

 

module.exports = defineConfig({
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 700000 * 1000,
  expect: {
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName: "firefox",
    headless: true,
    screenshot: "on",
    trace: "on",
  },
});