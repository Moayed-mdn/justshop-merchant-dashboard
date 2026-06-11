import { type Page } from '@playwright/test';

const PROXY_PREFIX = '/api/proxy?endpoint=/api/v1/merchant/billing';

export async function getSubscription(page: Page) {
  const response = await page.request.get(`${PROXY_PREFIX}/subscription`);
  if (!response.ok()) return null;
  return await response.json();
}

export async function getEntitlements(page: Page) {
  const response = await page.request.get(`${PROXY_PREFIX}/subscription/usage`);
  if (!response.ok()) return null;
  return await response.json();
}

export async function waitForToast(page: Page, text: string) {
  await page.locator(`text=${text}`).waitFor({ timeout: 5000 });
}

export async function waitForNetworkIdle(page: Page) {
  await page.waitForLoadState('networkidle');
}
