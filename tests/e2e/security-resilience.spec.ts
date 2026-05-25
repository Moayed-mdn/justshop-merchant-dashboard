import { expect, test } from '@playwright/test';
import {
  createFirstStore,
  login,
  logout,
  resetMockBackend,
  setNextCreatedStoreProvisioning,
  setStoreProvisioning,
} from './utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('protected routes redirect guests to login and preserve the target route', async ({ page }) => {
  await page.goto('/en/stores/101/dashboard');

  await expect(page).toHaveURL(/\/en\/login\?redirect=/);
  expect(decodeURIComponent(page.url())).toContain('/en/stores/101/dashboard');
});

test('logout in one tab synchronizes across the whole browser context', async ({ browser }) => {
  const context = await browser.newContext();
  const primaryPage = await context.newPage();
  const secondaryPage = await context.newPage();

  await login(primaryPage, 'merchant@example.com');
  await expect(primaryPage).toHaveURL(/\/en\/stores\/101\/dashboard$/);

  await secondaryPage.goto('/en/stores/101/dashboard');
  await expect(secondaryPage).toHaveURL(/\/en\/stores\/101\/dashboard$/);

  await logout(primaryPage);

  await expect(primaryPage).toHaveURL(/\/en\/login$/);
  await expect(secondaryPage).toHaveURL(/\/en\/login\?redirect=/);

  await context.close();
});

test('network interruption during provisioning shows an offline recovery message', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await setNextCreatedStoreProvisioning(context.request, 'stuck');
  await login(page, 'nostore@example.com');
  await page.goto('/en/create-store');

  await createFirstStore(page, {
    name: 'Offline Store',
    slug: 'offline-store',
  });

  await expect(page.getByText('Provisioning your store')).toBeVisible();

  await context.setOffline(true);
  await expect(page.getByText('You are offline.')).toBeVisible();

  await context.setOffline(false);
  await setStoreProvisioning(context.request, 201, {
    mode: 'auto-complete',
  });
  await page.getByRole('button', { name: 'Check again' }).click();

  await expect(page).toHaveURL(/\/en\/onboarding$/, { timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Check again' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Refresh bootstrap' })).toBeVisible();
  await context.close();
});
