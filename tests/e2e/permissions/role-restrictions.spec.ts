/**
 * Flow: Role-Based Access Control
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects critical permission boundaries ensuring users can only access features and data allowed by their role
 * Belongs to: tests/e2e/permissions/role-restrictions.spec.ts
 */

import { expect, test } from '@playwright/test';
import { login, resetMockBackend } from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('admin role can access all management features', async ({ page }) => {
  await login(page, 'merchant@example.com');
  
  // Switch to store with admin permissions
  await page.getByTestId('workspace-store-switcher').click();
  await page.getByRole('option', { name: 'Northwind Plus' }).click();

  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Verify all admin features are accessible
  await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Categories' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Brands' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Tags' })).toBeVisible();
});

test('limited role restricts access to management features', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Store 101 has limited permissions
  await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
  
  // These features should not be visible
  await expect(page.getByRole('link', { name: 'Customers' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Users' })).toHaveCount(0);
});

test('role without product.create cannot access product creation', async ({ page }) => {
  await login(page, 'merchant@example.com');

  // Intercept product creation route for role without permission
  await page.route(
    (url) => url.pathname.includes('/api/v1/merchant/stores/101/products/create'),
    async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          code: 'PERMISSION_DENIED',
          message: 'You do not have permission to create products.',
          errors: {},
        }),
      });
    }
  );

  await page.goto('/en/merchant/products/new');

  // Should show permission error or redirect
  await expect(page.getByText(/permission denied|not authorized/i)).toBeVisible();
});

test('role without order.manage cannot update order status', async ({ page }) => {
  await login(page, 'merchant@example.com');

  await page.route(
    (url) => 
      url.pathname.includes('/api/v1/merchant/stores/101/orders') &&
      url.pathname.includes('/status'),
    async (route) => {
      if (route.request().method() === 'PUT' || route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            code: 'PERMISSION_DENIED',
            message: 'You do not have permission to modify orders.',
            errors: {},
          }),
        });
      } else {
        await route.continue();
      }
    }
  );

  await page.goto('/en/merchant/orders');
  await page.getByTestId('order-row').first().click();

  await page.getByTestId('order-status-select').click();
  await page.getByRole('option', { name: 'Processing' }).click();
  await page.getByTestId('order-status-update').click();

  await expect(page.getByText(/permission denied|not authorized/i)).toBeVisible();
});

test('role without user.view cannot access user management', async ({ page }) => {
  await login(page, 'merchant@example.com');

  await page.route(
    (url) => url.pathname.includes('/api/v1/merchant/stores/101/users'),
    async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          code: 'PERMISSION_DENIED',
          message: 'You do not have permission to view users.',
          errors: {},
        }),
      });
    }
  );

  await page.goto('/en/merchant/users');

  // Should redirect or show error
  await expect(page).toHaveURL(/\/en\/merchant/);
});

test('permission changes after store switch are enforced immediately', async ({ page }) => {
  await login(page, 'merchant@example.com');
  
  // Store 101 - limited permissions
  await expect(page.getByRole('link', { name: 'Customers' })).toHaveCount(0);

  // Switch to Store 102 with broader permissions
  await page.getByTestId('workspace-store-switcher').click();
  await page.getByRole('option', { name: 'Northwind Plus' }).click();

  // New permissions should be visible immediately
  await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();

  // Switch back to Store 101
  await page.getByTestId('workspace-store-switcher').click();
  await page.getByRole('option', { name: 'Northwind Store' }).click();

  // Restricted permissions should be enforced again
  await expect(page.getByRole('link', { name: 'Customers' })).toHaveCount(0);
});

test('direct URL access to restricted feature redirects', async ({ page }) => {
  await login(page, 'merchant@example.com');

  // Try to access customers page without permission
  await page.route(
    (url) => url.pathname.includes('/api/v1/merchant/stores/101/customers'),
    async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          code: 'PERMISSION_DENIED',
          message: 'You do not have permission to view customers.',
          errors: {},
        }),
      });
    }
  );

  await page.goto('/en/merchant/customers');

  // Should redirect to dashboard or show error
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
});
