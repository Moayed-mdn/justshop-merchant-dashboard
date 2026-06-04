/**
 * Flow: Authentication
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects critical authentication flows including login, logout, session management, and cross-tab synchronization
 * Belongs to: tests/e2e/auth/auth.spec.ts
 * 
 * Note: This file covers both login and logout as a single cohesive authentication flow.
 * Login, logout, and session management are tightly coupled security boundaries that
 * belong together rather than being split into separate files.
 */

import { expect, test } from '@playwright/test';
import {
  dismissMobileOverlay,
  expireCurrentSession,
  login,
  logout,
  resetMockBackend,
} from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('login success routes verified merchant into dashboard', async ({ page }) => {
  await login(page, 'merchant@example.com');

  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('login failure rejects invalid credentials', async ({ page }) => {
  await login(page, 'merchant@example.com', 'wrong-password');

  await expect(page).toHaveURL(/\/en\/login$/);
  await expect(page.getByTestId('login-form-error')).toContainText('Invalid credentials');
});

test('login preserves protected route redirect target', async ({ page }) => {
  await page.goto('/en/stores/101/orders');
  await expect(page).toHaveURL(/\/en\/login\?redirect=/);

  await page.getByTestId('login-email').fill('merchant@example.com');
  await page.getByTestId('login-password').fill('password123');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/\/en\/merchant\/orders$/, { timeout: 10000 });
  await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
});

test('logout clears session and redirects to login', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
  
  await dismissMobileOverlay(page);
  await logout(page);

  await expect(page).toHaveURL(/\/en\/login$/);
  await expect(page.getByTestId('login-submit')).toBeVisible();
});

test('expired session redirects to login with expiry notification', async ({ page }) => {
  await login(page, 'merchant@example.com');
  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);

  await expireCurrentSession(page.context().request);
  await page.reload();
  await page.waitForURL(/\/en\/login/, { timeout: 10000 });

  await expect.poll(() => new URL(page.url()).searchParams.get('expired'), { timeout: 10000 }).toBe('1');
  await expect(page.getByTestId('session-expired-error')).toBeVisible({ timeout: 10000 });
});

test('cross-tab login synchronization redirects all tabs to dashboard', async ({ browser }) => {
  const context = await browser.newContext();
  const primaryPage = await context.newPage();
  const secondaryPage = await context.newPage();

  await primaryPage.goto('/en/login');
  await secondaryPage.goto('/en/login');

  await login(primaryPage, 'merchant@example.com');
  
  await expect(primaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);
  await expect(secondaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);

  await context.close();
});
