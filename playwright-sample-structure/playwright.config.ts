import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test-scenarios',
  fullyParallel: true, // Run tests in parallel

  reporter: [['html'], ['list'], ['junit', { outputFile: 'results.xml' }]],

  use: {
    baseURL: 'https://www.saucedemo.com/',
    trace: 'on-first-retry', // Best debugging feature: captures trace on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup-standard',
      testMatch: '**/auth.setup.ts',
    },
    {
      name: 'setup-locked-out',
      testMatch: '**/locked-out.setup.ts',
    },
    {
      name: 'chromium-standard',
      testMatch: '**/*.e2e.ts',
      testIgnore: '**/*locked-out*',
      dependencies: ['setup-standard'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/standard-user.json',
      },
    },

    // Project voor tests die een geblokkeerde status vereisen
    {
      name: 'chromium-locked-out',
      testMatch: '**/*locked-out*.e2e.ts', // Runt alleen bestanden met 'locked-out' in de naam
      dependencies: ['setup-locked-out'], // Wacht op de locked-out inlog
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/locked-out-user.json', // Laadt de locked-out VIP-pas!
      },
    },
  ],
});
