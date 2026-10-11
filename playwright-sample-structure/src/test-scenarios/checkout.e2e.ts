import { expect } from '@playwright/test';
import test from '../lib/baseTest.ts';

test.describe('Checkout', () => {
  test('authenticated user add every product to the cart', async ({
    productsPage,
    checkoutPage
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

    await test.step('Proceed to checkout', async () => {
      await cartPage.checkoutButton.click();
      await expect(
        checkoutPage.title,
        'Expected the checkout page title to be "Checkout: Your Information".',
      ).toHaveText('Checkout: Your Information');
    });

    await test.step('Fill in checkout information', async () => {
      await checkoutPage.firstName.fill('John');
      await checkoutPage.lastName.fill('Doe');
      await checkoutPage.postalCode.fill('12345');
      await checkoutPage.continueButton.click();

      await expect(
        checkoutPage.title,
        'Expected the checkout page title to be "Checkout: Overview".',
      ).toHaveText('Checkout: Overview');
    });

    await test.step('Finish checkout', async () => {
      await checkoutPage.finishButton.click();
      await expect(
        checkoutPage.title,
        'Expected the checkout page title to be "Checkout: Complete!".',
      ).toHaveText('Checkout: Complete!');
      await expect(checkoutPage.page.locator('.complete-header')).toHaveText('Thank you for your order!');
    });
  });
});
