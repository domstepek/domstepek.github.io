import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";

// Derive __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local so GATE_TEST_PASSCODE is available in test files
// process.loadEnvFile is available in Node 20.12+
try {
  process.loadEnvFile(path.resolve(__dirname, ".env.local"));
} catch {
  // .env.local may not exist in CI — env vars are passed directly
}

export default defineConfig({
  testDir: "tests/e2e",

  // Fail fast in CI; run all tests locally
  forbidOnly: !!process.env.CI,

  // Retry once in CI to guard against flakiness
  retries: process.env.CI ? 1 : 0,

  // Run tests sequentially to avoid session-state collisions between tests
  workers: 1,

  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      // Forward gate env vars to the dev server process
      GATE_HASH: process.env.GATE_HASH ?? "",
      GATE_TEST_PASSCODE: process.env.GATE_TEST_PASSCODE ?? "",
    },
  },
});
