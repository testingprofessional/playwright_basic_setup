import { expect, test as setup } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { users } from '../support/users.ts';
import { LoginPage } from '../support/views/loginPage.ts';

// Een eigen unieke 'VIP-pas' voor de geblokkeerde gebruiker
const authFile = 'playwright/.auth/locked-out-user.json';

setup('authenticate as the locked out user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.visit();
  await loginPage.submitLogin(users.lockedOut.username, users.lockedOut.password);
  
  // Let op: we verwachten hier een foutmelding (de error banner) i.p.v. de inventory pagina!
  await expect(loginPage.errorBanner).toContainText('Sorry, this user has been locked out');

  // Sla de cookies/localStorage van deze specifieke staat op
  mkdirSync(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
