import { expect, test } from '@playwright/test';
import {
  dismissMobileOverlay,
  expireCurrentSession,
  login,
  logout,
  resetMockBackend,
  signup,
} from './utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('register routes into verification-required onboarding', async ({ page }) => {
  await signup(page, {
    name: 'New Merchant',
    email: 'new-merchant@example.com',
    password: 'password123',
  });

  await expect(page).toHaveURL(/\/en\/onboarding$/);
  await expect(page.getByText('Verify your email')).toBeVisible();
  await expect(page.getByText('dashboard access stays locked until email verification is complete')).toBeVisible();
});

test('register renders duplicate email errors inline', async ({ page }) => {
  await signup(page, {
    name: 'Existing Merchant',
    email: 'merchant@example.com',
    password: 'password123',
  });

  await expect(page).toHaveURL(/\/en\/signup$/);
  await expect(page.getByTestId('signup-form-error')).toContainText('already been taken');
  await expect(page.getByTestId('signup-email')).toBeVisible();
});

test('login rejects invalid credentials inline', async ({ page }) => {
  await login(page, 'merchant@example.com', 'wrong-password');

  await expect(page).toHaveURL(/\/en\/login$/);
  await expect(page.getByTestId('login-form-error')).toContainText('Invalid credentials');
});

test('login preserves the original protected-route redirect target', async ({ page }) => {
  await page.goto('/en/stores/101/orders');
  await expect(page).toHaveURL(/\/en\/login\?redirect=/);

  await page.getByTestId('login-email').fill('merchant@example.com');
  await page.getByTestId('login-password').fill('password123');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/\/en\/stores\/101\/orders$/);
  await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
});

test('login routes a verified merchant into the active store dashboard', async ({ page }) => {
  await login(page, 'merchant@example.com');

  await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('login in one tab refreshes bootstrap and redirects guest tabs out of auth routes', async ({ browser }) => {
  const context = await browser.newContext();
  const primaryPage = await context.newPage();
  const secondaryPage = await context.newPage();

  await primaryPage.goto('/en/login');
  await secondaryPage.goto('/en/login');

  await login(primaryPage, 'merchant@example.com');
  await expect(primaryPage).toHaveURL(/\/en\/stores\/101\/dashboard$/);
  await expect(secondaryPage).toHaveURL(/\/en\/stores\/101\/dashboard$/);

  await context.close();
});

test('logout clears the session and redirects consistently', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);
  await dismissMobileOverlay(page);

  await logout(page);

  await expect(page).toHaveURL(/\/en\/login$/);
  await expect(page.getByTestId('login-submit')).toBeVisible();
});

test('expired session recovery redirects to login with expired state', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);

  await expireCurrentSession(page.context().request);
  await page.reload();

  await expect(page).toHaveURL(/\/en\/login/);
  await expect.poll(() => new URL(page.url()).searchParams.get('expired')).toBe('1');
  await expect(page.getByText('Sign in again to restore your dashboard')).toBeVisible();
});
