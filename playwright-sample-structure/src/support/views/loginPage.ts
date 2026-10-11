import { Locator, Page } from '@playwright/test';

export class LoginPage {
  constructor(readonly page: Page) {}

  async visit(): Promise<void> {
    await this.page.goto('/');
  }

  get usernameInput(): Locator {
    return this.page.locator('[data-test="username"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('[data-test="password"]');
  }

  get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  get errorBanner(): Locator {
    return this.page.locator('[data-test="error"]');
  }

  async submitLogin(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
