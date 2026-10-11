import { expect } from '@playwright/test';
import test from '../lib/baseTest.ts';

test.describe('Locked-out User Restrictions', () => {

  test('should not be able to bypass restriction by navigating directly to inventory', async ({
    productsPage,
    loginPage,
  }) => {
    await test.step('Try to force navigate to the secure products page', async () => {
      // De geblokkeerde gebruiker probeert direct de geheime URL te openen
      await productsPage.visit(); 
    });

    await test.step('There should be info for user about locked-out status', async () => {
      await expect(loginPage.errorBanner).toBeVisible();
      await expect(loginPage.errorBanner).toContainText(
        'You can only access',
      );
    });
  });
});
