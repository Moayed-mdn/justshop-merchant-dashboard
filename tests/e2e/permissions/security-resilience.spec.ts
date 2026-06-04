/**
 * Flow: Authorization and Security Resilience
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects authorization boundaries, cross-tab session synchronization, and network resilience during critical operations
 * Belongs to: tests/e2e/permissions/security-resilience.spec.ts
 */

import { expect, test } from '@playwright/test';
import {
  createFirstStore,
  login,
  logout,
  resetMockBackend,
  setNextCreatedStoreProvisioning,
  setStoreProvisioning,
} from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('protected routes redirect unauthenticated users to login with redirect preservation', async ({ page }) => {
  await page.goto('/en/stores/101/dashboard');

  await expect(page).toHaveURL(/\/en\/login\?redirect=/);
  expect(decodeURIComponent(page.url())).toContain('/en/stores/101/dashboard');
});

test('cross-tab logout synchronizes session termination', async ({ browser }) => {
  const context = await browser.newContext();
  const primaryPage = await context.newPage();
  const secondaryPage = await context.newPage();

  await login(primaryPage, 'merchant@example.com');
  await expect(primaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);

  await secondaryPage.goto('/en/merchant/dashboard');
  await expect(secondaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);

  await logout(primaryPage);

  await expect(primaryPage).toHaveURL(/\/en\/login$/);
  await expect(secondaryPage).toHaveURL(/\/en\/login\?redirect=/);

  await context.close();
});

test('network interruption during provisioning shows offline recovery UI', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await setNextCreatedStoreProvisioning(context.request, 'stuck');
  await login(page, 'nostore@example.com');
  await page.goto('/en/setup');

  await createFirstStore(page, {
    name: 'Offline Store',
    slug: 'offline-store',
  });

  await expect(page.getByRole('heading', { name: 'Setting up Offline Store...' })).toBeVisible();

  await context.setOffline(true);
  await expect(page.getByText('You are offline.')).toBeVisible();

  await context.setOffline(false);
  await setStoreProvisioning(context.request, 201, {
    mode: 'auto-complete',
  });
  await page.getByRole('button', { name: 'Check again' }).click();

  await expect(page).toHaveURL(/\/en\/setup$/, { timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Check again' })).toBeVisible();
  
  await context.close();
});
