import { expect } from '@playwright/test';
import test from '../lib/baseTest.ts';

test.describe('Cart', () => {
  test('authenticated user can add every product to the cart', async ({
    productsPage,
  }) => {
    await test.step('Open the products page', async () => {
      await productsPage.visit();
    });

    await test.step('Verify the products page is loaded', async () => {
      await expect(
        productsPage.title,
        'Expected the products page title to be "Products" after login.',
      ).toHaveText('Products');
      await expect(
        productsPage.inventoryList,
        'Expected the inventory list to be visible before counting products.',
      ).toBeVisible();
    });

    const productCount: number =
      await test.step('Count the available products', async () => {
        return productsPage.getProductCount();
      });

    await test.step('Add all products to the cart', async () => {
      await productsPage.addAllProductsToCart();
    });

    await test.step('Verify the cart badge', async () => {
      await expect(
        productsPage.cartBadge,
        `Expected the cart badge to show ${productCount} added products.`,
      ).toHaveText(String(productCount));
    });

    const cartPage = await test.step('Open the cart', async () =>
      productsPage.openCart());

    await test.step('Verify the cart contents', async () => {
      await expect(
        cartPage.title,
        'Expected the cart page title to be "Your Cart".',
      ).toHaveText('Your Cart');
      await expect(
        cartPage.cartItems,
        `Expected the cart to contain all ${productCount} products.`,
      ).toHaveCount(productCount);
    });
  });
});
