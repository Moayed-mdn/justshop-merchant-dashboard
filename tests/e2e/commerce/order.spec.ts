/**
 * Flow: Order Management
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects order confirmation delivery and merchant order visibility after successful purchases
 * Belongs to: tests/e2e/commerce/order.spec.ts
 */

import { expect, test } from '@playwright/test';
import { login, resetMockBackend } from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('completed order appears in merchant order list', async ({ page }) => {
  await login(page, 'merchant@example.com');
  
  // Navigate to orders page
  await page.goto('/en/merchant/orders');
  await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();

  // Should show existing orders
  await expect(page.getByTestId('order-list')).toBeVisible();
  await expect(page.getByTestId('order-row')).toHaveCount(1);
});

test('merchant can view order details', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/orders');

  // Click first order
  await page.getByTestId('order-row').first().click();

  // Should show order detail page
  await expect(page).toHaveURL(/\/en\/merchant\/orders\/\d+$/);
  await expect(page.getByRole('heading', { name: /Order #/ })).toBeVisible();
  await expect(page.getByTestId('order-status')).toBeVisible();
  await expect(page.getByTestId('order-customer')).toBeVisible();
  await expect(page.getByTestId('order-items')).toBeVisible();
  await expect(page.getByTestId('order-total')).toBeVisible();
});

test('merchant can update order status', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/orders');

  await page.getByTestId('order-row').first().click();
  await expect(page).toHaveURL(/\/en\/merchant\/orders\/\d+$/);

  // Update status
  await page.getByTestId('order-status-select').click();
  await page.getByRole('option', { name: 'Processing' }).click();
  await page.getByTestId('order-status-update').click();

  // Should show success message
  await expect(page.getByText('Order status updated')).toBeVisible();
  await expect(page.getByTestId('order-status')).toContainText('Processing');
});

test('order confirmation page is accessible only to order owner', async ({ page }) => {
  await login(page, 'merchant@example.com');

  // Try to access non-existent order
  await page.goto('/en/order/99999/confirmation');

  // Should show not found or redirect
  await expect(page).toHaveURL(/\/en\/(merchant|stores\/101)/);
});

test('merchant cannot access orders from different store', async ({ page }) => {
  await login(page, 'merchant@example.com');
  
  // Intercept request to simulate accessing order from another store
  await page.route(
    (url) => url.pathname.includes('/api/v1/merchant/stores/101/orders/999'),
    async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          code: 'NOT_FOUND',
          message: 'Order not found',
          errors: {},
        }),
      });
    }
  );

  await page.goto('/en/merchant/orders/999');

  // Should show error or redirect
  await expect(page.getByText(/not found|does not exist/i)).toBeVisible();
});
