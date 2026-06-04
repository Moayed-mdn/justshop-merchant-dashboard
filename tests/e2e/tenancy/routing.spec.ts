/**
 * Flow: Multi-Tenant Routing
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects tenant-aware routing correctness ensuring URLs resolve to correct tenant context and canonical routes
 * Belongs to: tests/e2e/tenancy/routing.spec.ts
 */

import { expect, test } from '@playwright/test';
import { login, resetMockBackend } from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('legacy store-specific routes redirect to canonical workspace routes', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Access legacy route format
  await page.goto('/en/stores/101/products');

  // Should redirect to canonical workspace route
  await expect(page).toHaveURL(/\/en\/merchant\/products$/);
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});

test('workspace routes maintain active store context', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/dashboard');

  // Navigate through workspace routes
  await page.goto('/en/merchant/products');
  await expect(page).toHaveURL(/\/en\/merchant\/products$/);

  await page.goto('/en/merchant/orders');
  await expect(page).toHaveURL(/\/en\/merchant\/orders$/);

  await page.goto('/en/merchant/dashboard');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // All routes should maintain Store 101 as active context
  await expect(page.getByTestId('workspace-store-switcher')).toContainText('101');
});

test('switching stores updates URL but preserves route path', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/products');

  await expect(page).toHaveURL(/\/en\/merchant\/products$/);

  // Switch to Store 102
  await page.getByTestId('workspace-store-switcher').click();
  await page.getByRole('option', { name: 'Northwind Plus' }).click();

  // Should remain on products page
  await expect(page).toHaveURL(/\/en\/merchant\/products$/);
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});

test('locale switching preserves tenant route structure', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/products');

  await expect(page).toHaveURL(/\/en\/merchant\/products$/);

  // Switch locale to Arabic
  await page.getByTestId('locale-switcher').click();
  await page.getByRole('option', { name: 'العربية' }).click();

  // Should maintain merchant workspace route with new locale
  await expect(page).toHaveURL(/\/ar\/merchant\/products$/);
});

test('invalid store routes redirect to active store workspace', async ({ page }) => {
  await login(page, 'merchant@example.com');
  
  // Try to access non-existent store
  await page.goto('/en/stores/999999/dashboard');

  // Should redirect to merchant workspace
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
});

test('route history preserves tenant context across navigation', async ({ page }) => {
  await login(page, 'merchant@example.com');
  
  await page.goto('/en/merchant/dashboard');
  await page.goto('/en/merchant/products');
  await page.goto('/en/merchant/orders');

  // Navigate back
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/merchant\/products$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Navigate forward
  await page.goForward();
  await expect(page).toHaveURL(/\/en\/merchant\/products$/);
});

test('deep links with redirect param preserve destination after login', async ({ page }) => {
  // Access protected route while logged out
  await page.goto('/en/merchant/products/new');

  // Should redirect to login with redirect param
  await expect(page).toHaveURL(/\/en\/login\?redirect=/);

  // Login
  await page.getByTestId('login-email').fill('merchant@example.com');
  await page.getByTestId('login-password').fill('password123');
  await page.getByTestId('login-submit').click();

  // Should redirect to original destination
  await expect(page).toHaveURL(/\/en\/merchant\/products\/new$/, { timeout: 10000 });
});

test('workspace route without active store redirects to setup', async ({ page }) => {
  await login(page, 'nostore@example.com');

  // Try to access workspace route
  await page.goto('/en/merchant/products');

  // Should redirect to setup/onboarding
  await expect(page).toHaveURL(/\/en\/setup$/);
  await expect(page.getByRole('heading', { name: 'Create your store' })).toBeVisible();
});
