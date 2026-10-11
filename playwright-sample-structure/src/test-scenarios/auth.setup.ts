import { expect, test as setup } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { users } from '../support/users.ts';
import { LoginPage } from '../support/views/loginPage.ts';

const authFile = 'playwright/.auth/standard-user.json';

setup('authenticate as the standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.visit();
  await loginPage.submitLogin(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory\.html$/);

  mkdirSync(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
