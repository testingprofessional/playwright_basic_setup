import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  constructor(readonly page: Page) {}

  async visit(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  get title(): Locator {
    return this.page.locator('[data-test="title"]');
  }

  get firstName(): Locator {
    return this.page.locator('[data-test="firstName"]');
  }

   get lastName(): Locator {
    return this.page.locator('[data-test="lastName"]');
  }

   get postalCode(): Locator {
    return this.page.locator('[data-test="postalCode"]');
  }

  get continueButton(): Locator {
    return this.page.locator('[data-test="continue"]');
  }

  get finishButton(): Locator {
    return this.page.locator('[data-test="finish"]');
  }
}
