/**
 * Flow: Subscription Purchase
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects subscription purchase flow from plan selection through payment confirmation and activation
 * Belongs to: tests/e2e/subscriptions/purchase.spec.ts
 */

import { expect, test } from '@playwright/test';
import { login, resetMockBackend } from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('successful subscription purchase activates plan', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  // Navigate to subscription plans
  await page.goto('/en/merchant/subscription/plans');

  // Select a plan
  await page.getByTestId('plan-professional').click();
  await page.getByTestId('select-plan-button').click();

  // Should navigate to payment page
  await expect(page).toHaveURL(/\/en\/merchant\/subscription\/checkout$/);
  await expect(page.getByRole('heading', { name: 'Professional Plan' })).toBeVisible();

  // Fill payment information
  await page.getByTestId('subscription-card-number').fill('4242424242424242');
  await page.getByTestId('subscription-card-expiry').fill('12/25');
  await page.getByTestId('subscription-card-cvc').fill('123');
  await page.getByTestId('subscription-cardholder-name').fill('John Doe');

  // Accept terms
  await page.getByTestId('subscription-terms-checkbox').check();

  // Complete purchase
  await page.getByTestId('subscription-purchase-button').click();

  // Should show confirmation
  await expect(page).toHaveURL(/\/en\/merchant\/subscription\/confirmation$/, { timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Subscription Activated' })).toBeVisible();
  await expect(page.getByText('Professional Plan')).toBeVisible();
  await expect(page.getByText('Thank you for subscribing')).toBeVisible();
});

test('subscription purchase with declined card shows error', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/subscription/plans');

  await page.getByTestId('plan-professional').click();
  await page.getByTestId('select-plan-button').click();

  // Use test card that will be declined
  await page.getByTestId('subscription-card-number').fill('4000000000000002');
  await page.getByTestId('subscription-card-expiry').fill('12/25');
  await page.getByTestId('subscription-card-cvc').fill('123');
  await page.getByTestId('subscription-cardholder-name').fill('John Doe');
  await page.getByTestId('subscription-terms-checkbox').check();

  await page.getByTestId('subscription-purchase-button').click();

  // Should show payment error
  await expect(page.getByTestId('subscription-error')).toBeVisible();
  await expect(page.getByTestId('subscription-error')).toContainText(/declined|failed/i);

  // Should remain on checkout page
  await expect(page).toHaveURL(/\/en\/merchant\/subscription\/checkout$/);
});

test('subscription purchase without accepting terms is blocked', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/subscription/plans');

  await page.getByTestId('plan-professional').click();
  await page.getByTestId('select-plan-button').click();

  await page.getByTestId('subscription-card-number').fill('4242424242424242');
  await page.getByTestId('subscription-card-expiry').fill('12/25');
  await page.getByTestId('subscription-card-cvc').fill('123');
  await page.getByTestId('subscription-cardholder-name').fill('John Doe');

  // Do NOT check terms checkbox

  await page.getByTestId('subscription-purchase-button').click();

  // Should show validation error
  await expect(page.getByText(/accept.*terms/i)).toBeVisible();
  await expect(page).toHaveURL(/\/en\/merchant\/subscription\/checkout$/);
});

test('free trial subscription activates without payment', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/subscription/plans');

  // Select plan with free trial
  await page.getByTestId('plan-starter').click();
  await page.getByTestId('start-free-trial-button').click();

  await expect(page.getByTestId('subscription-terms-checkbox')).toBeVisible();
  await page.getByTestId('subscription-terms-checkbox').check();
  await page.getByTestId('subscription-trial-confirm-button').click();

  // Should activate trial without payment
  await expect(page).toHaveURL(/\/en\/merchant\/subscription\/confirmation$/, { timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Trial Started' })).toBeVisible();
  await expect(page.getByText(/free trial.*active/i)).toBeVisible();
});

test('existing subscription prevents duplicate purchase', async ({ page }) => {
  await login(page, 'merchant@example.com');

  // Mock user already has active subscription
  await page.route(
    (url) => url.pathname.includes('/api/v1/merchant/subscription/status'),
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            has_subscription: true,
            plan: 'professional',
            status: 'active',
            expires_at: '2026-12-31T23:59:59Z',
          },
        }),
      });
    }
  );

  await page.goto('/en/merchant/subscription/plans');

  // Should show already subscribed message
  await expect(page.getByText(/already subscribed/i)).toBeVisible();
  await expect(page.getByTestId('select-plan-button')).toBeDisabled();
});

test('plan comparison shows feature differences', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await page.goto('/en/merchant/subscription/plans');

  // Verify multiple plans are visible
  await expect(page.getByTestId('plan-starter')).toBeVisible();
  await expect(page.getByTestId('plan-professional')).toBeVisible();
  await expect(page.getByTestId('plan-enterprise')).toBeVisible();

  // Verify feature lists are displayed
  await expect(page.getByTestId('plan-starter-features')).toBeVisible();
  await expect(page.getByTestId('plan-professional-features')).toBeVisible();
  await expect(page.getByTestId('plan-enterprise-features')).toBeVisible();
});
