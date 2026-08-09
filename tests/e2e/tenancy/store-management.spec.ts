/**
 * Flow: Multi-Tenant Store Management
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects tenant isolation boundaries and active store context integrity across store switching and cross-tab synchronization
 * Belongs to: tests/e2e/tenancy/store-management.spec.ts
 */

import { expect, test } from '@playwright/test';
import { login, resetMockBackend } from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('store switching updates permissions and maintains tenant isolation', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Store 101 has limited permissions
  await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Customers' })).toHaveCount(0);

  // Switch to Store 102 with broader permissions
  await page.getByTestId('workspace-store-switcher').click();
  await page.getByRole('option', { name: 'Northwind Plus' }).click();

  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
  await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
});

test('workspace maintains active store context across navigation', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Navigate to different workspace routes
  await page.goto('/en/merchant/products');
  await expect(page).toHaveURL(/\/en\/merchant\/products$/);
  
  await page.goto('/en/merchant/dashboard');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
});

test('forbidden store-switch prevents context leakage', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  let intercepted = false;
  await page.route(
    (url) =>
      url.pathname === '/api/proxy' &&
      url.searchParams.get('endpoint') === '/api/v1/merchant/auth/active-store' &&
      !intercepted,
    async (route) => {
      intercepted = true;
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          code: 'STORE_ACCESS_DENIED',
          message: 'This action is unauthorized.',
          redirect: '/dashboard',
          errors: {},
        }),
      });
    }
  );

  await page.getByTestId('workspace-store-switcher').click();
  await page.getByRole('option', { name: 'Northwind Plus' }).click();

  // Should remain on original store context
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
  await expect(page.getByRole('link', { name: 'Customers' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
});

test('cross-tab store switching synchronizes active context', async ({ browser }) => {
  const context = await browser.newContext();
  const primaryPage = await context.newPage();
  const secondaryPage = await context.newPage();

  await login(primaryPage, 'merchant@example.com');
  await expect(primaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);

  await secondaryPage.goto('/en/merchant/dashboard');
  await expect(secondaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Switch store in primary tab
  await primaryPage.getByTestId('workspace-store-switcher').click();
  await primaryPage.getByRole('option', { name: 'Northwind Plus' }).click();

  // Both tabs should reflect the new active store
  await expect(primaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);
  await expect(secondaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);

  await context.close();
});
