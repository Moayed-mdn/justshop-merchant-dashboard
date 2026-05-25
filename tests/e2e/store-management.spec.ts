import { expect, test } from '@playwright/test';
import { login, resetMockBackend } from './utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('sidebar permissions rerender after active store switching', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);

  await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Customers' })).toHaveCount(0);

  await page.getByTestId('store-switcher').click();
  await page.getByRole('option', { name: 'Northwind Plus' }).click();

  await expect(page).toHaveURL(/\/en\/stores\/102\/dashboard$/);
  await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
  await expect(page.getByText('Switching active store and refreshing permissions...')).toHaveCount(0);
});

test('route and active-store mismatch recovers back to the canonical active store', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);

  await page.goto('/en/stores/102/dashboard');

  await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);
});

test('forbidden store-switch responses recover without leaking stale store context', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);

  let intercepted = false;
  await page.route(
    (url) =>
      url.pathname === '/api/proxy' &&
      url.searchParams.get('endpoint') === '/api/v1/users/auth/active-store' &&
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

  await page.getByTestId('store-switcher').click();
  await page.getByRole('option', { name: 'Northwind Plus' }).click();

  await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);
  await expect(page.getByRole('link', { name: 'Customers' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
});

test('active store changes in another tab synchronize and recover route context', async ({ browser }) => {
  const context = await browser.newContext();
  const primaryPage = await context.newPage();
  const secondaryPage = await context.newPage();

  await login(primaryPage, 'merchant@example.com');
  await expect(primaryPage).toHaveURL(/\/en\/stores\/101\/dashboard$/);

  await secondaryPage.goto('/en/stores/101/dashboard');
  await expect(secondaryPage).toHaveURL(/\/en\/stores\/101\/dashboard$/);

  await primaryPage.getByTestId('store-switcher').click();
  await primaryPage.getByRole('option', { name: 'Northwind Plus' }).click();

  await expect(primaryPage).toHaveURL(/\/en\/stores\/102\/dashboard$/);
  await expect(secondaryPage).toHaveURL(/\/en\/stores\/102\/dashboard$/);

  await context.close();
});
