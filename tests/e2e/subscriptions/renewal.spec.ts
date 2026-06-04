/**
 * Flow: Subscription Renewal
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects subscription renewal process including automatic renewal, payment failures, and grace period handling
 * Belongs to: tests/e2e/subscriptions/renewal.spec.ts
 */

import { expect, test } from '@playwright/test';
import { login, resetMockBackend } from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('subscription with upcoming renewal shows renewal date', async ({ page }) => {
  await login(page, 'merchant@example.com');

  // Mock active subscription
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
            current_period_end: '2026-07-01T00:00:00Z',
            will_renew: true,
          },
        }),
      });
    }
  );

  await page.goto('/en/merchant/subscription');

  await expect(page.getByTestId('subscription-status')).toContainText('Active');
  await expect(page.getByTestId('subscription-renewal-date')).toBeVisible();
  await expect(page.getByTestId('subscription-renewal-date')).toContainText('July 1, 2026');
});

test('subscription renewal failure shows payment update prompt', async ({ page }) => {
  await login(page, 'merchant@example.com');

  // Mock subscription with failed renewal
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
            status: 'past_due',
            current_period_end: '2026-06-05T00:00:00Z',
            will_renew: false,
            payment_failed: true,
            grace_period_ends: '2026-06-12T00:00:00Z',
          },
        }),
      });
    }
  );

  await page.goto('/en/merchant/subscription');

  await expect(page.getByTestId('subscription-status')).toContainText('Past Due');
  await expect(page.getByTestId('subscription-payment-failed-alert')).toBeVisible();
  await expect(page.getByText(/update payment method/i)).toBeVisible();
  await expect(page.getByTestId('update-payment-button')).toBeVisible();
});

test('merchant can update payment method for renewal', async ({ page }) => {
  await login(page, 'merchant@example.com');

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
          },
        }),
      });
    }
  );

  await page.goto('/en/merchant/subscription');

  await page.getByTestId('update-payment-button').click();

  // Should show payment update form
  await expect(page).toHaveURL(/\/en\/merchant\/subscription\/payment$/);
  await expect(page.getByRole('heading', { name: 'Update Payment Method' })).toBeVisible();

  // Update card
  await page.getByTestId('payment-card-number').fill('4242424242424242');
  await page.getByTestId('payment-card-expiry').fill('12/26');
  await page.getByTestId('payment-card-cvc').fill('456');
  await page.getByTestId('payment-update-submit').click();

  // Should show success message
  await expect(page.getByText('Payment method updated')).toBeVisible({ timeout: 10000 });
});

test('merchant can cancel subscription', async ({ page }) => {
  await login(page, 'merchant@example.com');

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
            current_period_end: '2026-07-01T00:00:00Z',
          },
        }),
      });
    }
  );

  await page.goto('/en/merchant/subscription');

  await page.getByTestId('cancel-subscription-button').click();

  // Should show confirmation dialog
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/cancel.*subscription/i)).toBeVisible();

  await page.getByTestId('confirm-cancel-subscription').click();

  // Should show cancellation confirmation
  await expect(page.getByText(/subscription.*cancelled/i)).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('subscription-status')).toContainText(/cancelled|canceled/i);
});

test('cancelled subscription retains access until period end', async ({ page }) => {
  await login(page, 'merchant@example.com');

  // Mock cancelled subscription with remaining access
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
            status: 'cancelled',
            current_period_end: '2026-07-01T00:00:00Z',
            will_renew: false,
            access_until: '2026-07-01T00:00:00Z',
          },
        }),
      });
    }
  );

  await page.goto('/en/merchant/subscription');

  await expect(page.getByTestId('subscription-status')).toContainText(/cancelled|canceled/i);
  await expect(page.getByText(/access until.*July 1, 2026/i)).toBeVisible();
  await expect(page.getByTestId('reactivate-subscription-button')).toBeVisible();
});

test('expired subscription restricts dashboard access', async ({ page }) => {
  await login(page, 'merchant@example.com');

  // Mock expired subscription
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
            status: 'expired',
            current_period_end: '2026-05-01T00:00:00Z',
            will_renew: false,
          },
        }),
      });
    }
  );

  await page.goto('/en/merchant/dashboard');

  // Should show subscription required message
  await expect(page.getByTestId('subscription-expired-banner')).toBeVisible();
  await expect(page.getByText(/subscription.*expired/i)).toBeVisible();
  await expect(page.getByTestId('renew-subscription-button')).toBeVisible();
});

test('merchant can upgrade subscription plan', async ({ page }) => {
  await login(page, 'merchant@example.com');

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
            plan: 'starter',
            status: 'active',
          },
        }),
      });
    }
  );

  await page.goto('/en/merchant/subscription');

  await page.getByTestId('upgrade-plan-button').click();

  // Should show available upgrade plans
  await expect(page).toHaveURL(/\/en\/merchant\/subscription\/upgrade$/);
  await expect(page.getByTestId('plan-professional')).toBeVisible();
  await expect(page.getByTestId('plan-enterprise')).toBeVisible();

  // Select upgrade
  await page.getByTestId('plan-professional').click();
  await page.getByTestId('confirm-upgrade-button').click();

  // Should show upgrade confirmation
  await expect(page.getByText(/upgraded.*professional/i)).toBeVisible({ timeout: 10000 });
});

test('subscription grace period allows continued access with warning', async ({ page }) => {
  await login(page, 'merchant@example.com');

  // Mock subscription in grace period
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
            status: 'past_due',
            grace_period_ends: '2026-06-12T00:00:00Z',
            payment_failed: true,
          },
        }),
      });
    }
  );

  await page.goto('/en/merchant/dashboard');

  // Should show grace period warning
  await expect(page.getByTestId('grace-period-banner')).toBeVisible();
  await expect(page.getByText(/payment failed/i)).toBeVisible();
  await expect(page.getByText(/access expires.*June 12/i)).toBeVisible();

  // Dashboard should still be accessible
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
