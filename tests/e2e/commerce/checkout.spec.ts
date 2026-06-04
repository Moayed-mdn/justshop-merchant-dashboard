/**
 * Flow: Commerce Checkout
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects complete purchase flow from cart to order confirmation including payment processing and error recovery
 * Belongs to: tests/e2e/commerce/checkout.spec.ts
 */

import { expect, test } from '@playwright/test';
import { login, resetMockBackend } from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('successful checkout completes purchase and shows confirmation', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Navigate to storefront (simulating customer view)
  await page.goto('/en/stores/101/shop');

  // Add product to cart
  await page.getByTestId('product-101').click();
  await page.getByTestId('add-to-cart-button').click();
  await expect(page.getByTestId('cart-count')).toContainText('1');

  // Proceed to checkout
  await page.getByTestId('cart-icon').click();
  await page.getByTestId('proceed-to-checkout').click();

  // Fill shipping information
  await page.getByTestId('checkout-name').fill('John Doe');
  await page.getByTestId('checkout-email').fill('customer@example.com');
  await page.getByTestId('checkout-address').fill('123 Main St');
  await page.getByTestId('checkout-city').fill('New York');
  await page.getByTestId('checkout-postal-code').fill('10001');

  // Fill payment information
  await page.getByTestId('checkout-card-number').fill('4242424242424242');
  await page.getByTestId('checkout-card-expiry').fill('12/25');
  await page.getByTestId('checkout-card-cvc').fill('123');

  // Complete purchase
  await page.getByTestId('checkout-submit').click();

  // Should show order confirmation
  await expect(page).toHaveURL(/\/en\/stores\/101\/order\/\d+\/confirmation$/, { timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Order Confirmed' })).toBeVisible();
  await expect(page.getByTestId('order-number')).toBeVisible();
  await expect(page.getByText('Thank you for your purchase')).toBeVisible();
});

test('checkout with invalid payment card shows error and allows retry', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/stores/101/shop');

  await page.getByTestId('product-101').click();
  await page.getByTestId('add-to-cart-button').click();
  await page.getByTestId('cart-icon').click();
  await page.getByTestId('proceed-to-checkout').click();

  // Fill valid shipping information
  await page.getByTestId('checkout-name').fill('John Doe');
  await page.getByTestId('checkout-email').fill('customer@example.com');
  await page.getByTestId('checkout-address').fill('123 Main St');
  await page.getByTestId('checkout-city').fill('New York');
  await page.getByTestId('checkout-postal-code').fill('10001');

  // Use invalid test card number
  await page.getByTestId('checkout-card-number').fill('4000000000000002');
  await page.getByTestId('checkout-card-expiry').fill('12/25');
  await page.getByTestId('checkout-card-cvc').fill('123');

  await page.getByTestId('checkout-submit').click();

  // Should show payment error
  await expect(page.getByTestId('checkout-error')).toBeVisible();
  await expect(page.getByTestId('checkout-error')).toContainText('payment declined');

  // Should remain on checkout page for retry
  await expect(page).toHaveURL(/\/en\/stores\/101\/checkout$/);
  await expect(page.getByTestId('checkout-submit')).toBeVisible();
});

test('checkout with insufficient inventory shows error', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/stores/101/shop');

  // Intercept checkout submission to simulate out-of-stock
  await page.route(
    (url) => url.pathname.includes('/api/v1/stores/101/orders'),
    async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            code: 'VALIDATION_ERROR',
            message: 'Product is out of stock',
            errors: {
              items: ['Product "Sample Product" is no longer available in the requested quantity.'],
            },
          }),
        });
      } else {
        await route.continue();
      }
    }
  );

  await page.getByTestId('product-101').click();
  await page.getByTestId('add-to-cart-button').click();
  await page.getByTestId('cart-icon').click();
  await page.getByTestId('proceed-to-checkout').click();

  await page.getByTestId('checkout-name').fill('John Doe');
  await page.getByTestId('checkout-email').fill('customer@example.com');
  await page.getByTestId('checkout-address').fill('123 Main St');
  await page.getByTestId('checkout-city').fill('New York');
  await page.getByTestId('checkout-postal-code').fill('10001');
  await page.getByTestId('checkout-card-number').fill('4242424242424242');
  await page.getByTestId('checkout-card-expiry').fill('12/25');
  await page.getByTestId('checkout-card-cvc').fill('123');

  await page.getByTestId('checkout-submit').click();

  await expect(page.getByTestId('checkout-error')).toContainText('no longer available');
  await expect(page).toHaveURL(/\/en\/stores\/101\/checkout$/);
});

test('empty cart prevents checkout access', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/stores/101/checkout');

  // Should redirect to cart or shop
  await expect(page).toHaveURL(/\/en\/stores\/101\/(shop|cart)$/);
  await expect(page.getByText('Your cart is empty')).toBeVisible();
});
