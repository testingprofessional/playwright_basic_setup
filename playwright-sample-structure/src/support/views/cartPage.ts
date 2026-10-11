import type { Locator, Page } from '@playwright/test';

export class CartPage {
  constructor(readonly page: Page) {}

  async visit(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  get title(): Locator {
    return this.page.locator('[data-test="title"]');
  }

  get cartItems(): Locator {
    return this.page.locator('[data-test="inventory-item"]');
  }

  get continueShoppingButton(): Locator {
    return this.page.locator('[data-test="continue-shopping"]');
  }

  get checkoutButton(): Locator {
    return this.page.locator('[data-test="checkout"]');
  }
}
