import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/test-results.json' }]
  ],
  use: {
    // Collect trace when retrying a failed test
    trace: 'on-first-retry',
    // Set headers that apply to all requests if any (like accept or user-agent)
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
});
