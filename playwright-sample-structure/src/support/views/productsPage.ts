import type { Locator, Page } from '@playwright/test';
import { CartPage } from './cartPage.ts';

export class ProductsPage {
  constructor(readonly page: Page) {}

  async visit(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  get inventoryList(): Locator {
    return this.page.locator('[data-test="inventory-list"]');
  }

  get title(): Locator {
    return this.page.locator('[data-test="title"]');
  }

  get inventoryItems(): Locator {
    return this.page.locator('[data-test="inventory-item"]');
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  get cartLink(): Locator {
    return this.page.locator('[data-test="shopping-cart-link"]');
  }

  get cartBadge(): Locator {
    return this.page.locator('[data-test="shopping-cart-badge"]');
  }

  get sortSelect(): Locator {
    return this.page.locator('[data-test="product-sort-container"]');
  }

  get addToCartButtons(): Locator {
    return this.page.locator('button[data-test^="add-to-cart-"]');
  }

  productItem(productName: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.getByRole('link', { name: productName }),
    });
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.productItem(productName)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async addAllProductsToCart(): Promise<void> {
    while ((await this.addToCartButtons.count()) > 0) {
      await this.addToCartButtons.first().click();
    }
  }

  async openCart(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }
}
