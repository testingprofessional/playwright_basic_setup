import { Page, test as baseTest } from '@playwright/test';
import { LoginPage } from '../support/views/loginPage.ts';
import { ProductsPage } from '../support/views/productsPage.ts';
import { AppHealthKey, checkAppHealth } from './appHealth.ts';

export type TestOptions = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
};

async function ensureAppHealthOrSkip(
  appKey: AppHealthKey,
  page: Page,
  baseURL: string | undefined,
): Promise<void> {
  const resolvedBaseURL = getRequiredBaseURL(baseURL);
  const healthStatus = await checkAppHealth(appKey, {
    page,
    baseURL: resolvedBaseURL,
  });
  if (!healthStatus.available) {
    baseTest.skip(true, healthStatus.reason);
  }
}

function getRequiredBaseURL(baseURL: string | undefined): string {
  if (!baseURL) {
    throw new Error('baseURL is required');
  }
  return baseURL;
}

const test = baseTest.extend<TestOptions>({
  loginPage: async ({ page, baseURL }, use) => {
    getRequiredBaseURL(baseURL);
    await use(new LoginPage(page));
  },
  productsPage: async ({ page, baseURL }, use) => {
    await ensureAppHealthOrSkip('productsPage', page, baseURL);
    await use(new ProductsPage(page));
  },
});

export default test;
