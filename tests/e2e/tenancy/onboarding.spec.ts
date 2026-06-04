/**
 * Flow: Tenant Onboarding
 * Layer: Playwright E2E — Layer 2
 * Purpose: Protects first store creation and provisioning lifecycle including failure recovery and state persistence
 * Belongs to: tests/e2e/tenancy/onboarding.spec.ts
 */

import { expect, test } from '@playwright/test';
import {
  createFirstStore,
  login,
  resetMockBackend,
  setNextCreatedStoreProvisioning,
  setStoreProvisioning,
} from '../utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('successful first store creation completes onboarding and grants dashboard access', async ({ page }) => {
  await login(page, 'nostore@example.com');
  await page.goto('/en/setup');

  await createFirstStore(page, {
    name: 'My First Store',
    slug: 'my-first-store',
  });

  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('provisioning failure blocks dashboard access and shows recovery UI', async ({ page }) => {
  await setNextCreatedStoreProvisioning(page.context().request, 'failed');
  await login(page, 'nostore@example.com');
  await page.goto('/en/setup');

  await createFirstStore(page, {
    name: 'Recovery Store',
    slug: 'recovery-store',
  });

  await expect(page).toHaveURL(/\/en\/setup$/);
  await expect(page.getByRole('heading', { name: 'Setup needs attention' })).toBeVisible();
  await expect(page.getByText('Recovery guidance')).toBeVisible();
});

test('failed provisioning recovers after manual retry', async ({ page }) => {
  await setNextCreatedStoreProvisioning(page.context().request, 'failed');
  await login(page, 'nostore@example.com');
  await page.goto('/en/setup');

  await createFirstStore(page, {
    name: 'Retry Store',
    slug: 'retry-store',
  });

  await expect(page.getByRole('heading', { name: 'Setup needs attention' })).toBeVisible();

  await setStoreProvisioning(page.context().request, 201, {
    mode: 'auto-complete',
    status: 'pending',
    progress: 0,
    currentStep: 'initializing_store',
    message: 'Retrying provisioning.',
    retryable: false,
  });

  await page.getByRole('button', { name: 'Check again' }).click();

  await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('provisioning state persists across page refresh', async ({ page }) => {
  await setNextCreatedStoreProvisioning(page.context().request, 'stuck');
  await login(page, 'nostore@example.com');
  await page.goto('/en/setup');

  await createFirstStore(page, {
    name: 'Refresh Store',
    slug: 'refresh-store',
  });

  await expect(page.getByRole('heading', { name: 'Setting up Refresh Store...' })).toBeVisible();
  
  await page.reload();
  
  await expect(page).toHaveURL(/\/en\/setup$/);
  await expect(page.getByRole('heading', { name: 'Setting up Refresh Store...' })).toBeVisible();
});
