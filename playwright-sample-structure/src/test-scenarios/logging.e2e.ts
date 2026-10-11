import { expect } from '@playwright/test';
import { users } from '../support/users.ts';
import test from '../lib/baseTest.ts';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login protection for invalid cases', () => {
  test('user cannot log in with invalid credentials @regression', async ({
    loginPage,
  }) => {
    await test.step('Login with invalid credentials', async () => {
      await loginPage.visit();

      await loginPage.submitLogin(
        users.invalid.username,
        users.invalid.password,
      );
    });

    await test.step('There should be info for user about invalid credentials', async () => {
      await expect(loginPage.errorBanner).toBeVisible();
      await expect(loginPage.errorBanner).toContainText(
        'Username and password do not match any user in this service',
      );
    });
  });

  test('locked user cannot log in @regression', async ({ loginPage }) => {
    await test.step('Login with locked out credentials', async () => {
      await loginPage.visit();

      await loginPage.submitLogin(
        users.lockedOut.username,
        users.lockedOut.password,
      );
    });
    await test.step('There should be info for user about Lock', async () => {
      await expect(loginPage.errorBanner).toContainText(
        'Sorry, this user has been locked out',
      );
    });
  });
});

test.describe('Successful login', () => {
  test('standard user is redirected to the products page', async ({
    loginPage,
    productsPage,
  }) => {
    await test.step('Log in as the standard user', async () => {
      await loginPage.visit();
      await loginPage.submitLogin(
        users.standard.username,
        users.standard.password,
      );
    });

    await test.step('Verify the products page is displayed', async () => {
      await expect(
        productsPage.title,
        'Expected a successful login to display the Products page.',
      ).toHaveText('Products');
    });
  });
});
