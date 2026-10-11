import { expect } from '@playwright/test';
import test from '../lib/baseTest.ts';

test.describe('Products page', () => {
  test('authenticated user can view products and open the cart', async ({
    productsPage,
  }) => {
    await test.step('Open the products page', async () => {
      await productsPage.visit();
    });

    await test.step('Verify the Products page title', async () => {
      await expect(productsPage.title).toHaveText('Products');
    });

    await test.step('Open the cart', async () => {
      await productsPage.openCart();
    });

    await test.step('Verify the cart is open', async () => {
      await expect(productsPage.page).toHaveURL(/cart\.html$/);
    });
  });
});
