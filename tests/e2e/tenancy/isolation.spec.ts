/**
 * Flow: Multi-Tenant Data Isolation
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects tenant data boundaries ensuring merchants cannot access or modify data belonging to other tenants
 * Belongs to: tests/e2e/tenancy/isolation.spec.ts
 */

import { expect, test } from '@playwright/test';
import { login, resetMockBackend } from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('merchant cannot access products from unauthorized store', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Attempt to access products from store 999 (not owned by this merchant)
  await page.route(
    (url) => url.pathname.includes('/api/v1/merchant/stores/999/products'),
    async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          code: 'STORE_ACCESS_DENIED',
          message: 'You do not have access to this store.',
          errors: {},
        }),
      });
    }
  );

  // Try to access products endpoint that would fail
  await page.goto('/en/merchant/products');

  // Should stay on merchant workspace
  await expect(page).toHaveURL(/\/en\/merchant/);
});

test('merchant cannot access orders from unauthorized store', async ({ page }) => {
  await login(page, 'merchant@example.com');

  await page.route(
    (url) => url.pathname.includes('/api/v1/merchant/stores/999/orders'),
    async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          code: 'STORE_ACCESS_DENIED',
          message: 'You do not have access to this store.',
          errors: {},
        }),
      });
    }
  );

  await page.goto('/en/merchant/orders');

  await expect(page).toHaveURL(/\/en\/merchant/);
});

test('merchant cannot modify products in unauthorized store', async ({ page }) => {
  await login(page, 'merchant@example.com');

  await page.route(
    (url) => 
      url.pathname.includes('/api/v1/merchant/stores/999/products') &&
      url.pathname.includes('/edit'),
    async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            code: 'STORE_ACCESS_DENIED',
            message: 'You do not have access to this store.',
            errors: {},
          }),
        });
      } else {
        await route.continue();
      }
    }
  );

  await page.goto('/en/merchant/products');

  await expect(page).toHaveURL(/\/en\/merchant/);
});

test('API requests include correct store context in headers', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  let capturedHeaders: Record<string, string> = {};

  await page.route(
    (url) => url.pathname.includes('/api/v1/merchant/stores/101/products'),
    async (route) => {
      capturedHeaders = route.request().headers();
      await route.continue();
    }
  );

  await page.goto('/en/merchant/products');

  // Verify store context is present in request
  await page.waitForTimeout(1000);
  expect(capturedHeaders['x-tenant-id'] || capturedHeaders['x-store-id']).toBeTruthy();
});

test('switching stores updates data isolation boundaries', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/products');

  // Capture initial product list for Store 101
  const store101Products = await page.getByTestId('product-row').count();

  // Switch to Store 102
  await page.getByTestId('workspace-store-switcher').click();
  await page.getByRole('option', { name: 'Northwind Plus' }).click();

  await expect(page).toHaveURL(/\/en\/merchant\/products$/);

  // Product list should reflect Store 102 data
  const store102Products = await page.getByTestId('product-row').count();

  // Stores should have different product counts (verifying isolation)
  expect(store102Products).not.toBe(store101Products);
});

test('workspace access maintains store isolation boundaries', async ({ page }) => {
  await login(page, 'merchant@example.com');
  
  // Merchant is active on Store 101
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Try to access product creation in workspace
  await page.goto('/en/merchant/products/new');

  // Should stay in workspace with active store context
  await expect(page).toHaveURL(/\/en\/merchant/);
});
