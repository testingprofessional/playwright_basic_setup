import type { Page } from '@playwright/test';

type AppHealthCheckConfig = {
  name: string;
  endpointPath: string;
};

const APP_HEALTH_CHECKS = {
  productsPage: {
    name: 'Products Page',
    endpointPath: '',
  },
} as const satisfies Record<string, AppHealthCheckConfig>;

export type AppHealthKey = keyof typeof APP_HEALTH_CHECKS;

export type AppHealthStatus = {
  available: boolean;
  reason: string;
};

type AppHealthContext = {
  page: Page;
  baseURL: string;
};

const DEFAULT_TIMEOUT = 20_000;

export async function checkAppHealth(
  appKey: AppHealthKey,
  { page, baseURL }: AppHealthContext,
): Promise<AppHealthStatus> {
  const config = APP_HEALTH_CHECKS[appKey];
  const url = new URL(config.endpointPath, baseURL).toString();

  try {
    const response = await page.request.get(url, {
      ignoreHTTPSErrors: true,
      timeout: DEFAULT_TIMEOUT,
    });

    if (!response.ok()) {
      return {
        available: false,
        reason: `${config.name} is not healthy (HTTP ${response.status()})`,
      };
    }

    return { available: true, reason: `${config.name} is healthy` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      available: false,
      reason: `${config.name} health check failed: ${message}`,
    };
  }
}
