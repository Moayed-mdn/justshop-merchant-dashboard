import { expect, test } from '@playwright/test';
import {
  createFirstStore,
  login,
  resetMockBackend,
  setNextCreatedStoreProvisioning,
  setStoreProvisioning,
} from './utils/mock-backend';

test.beforeEach(async ({ request }) => {
  await resetMockBackend(request);
});

test('onboarding restores create-store state after refresh', async ({ page }) => {
  await login(page, 'nostore@example.com');

  await expect(page).toHaveURL(/\/en\/onboarding$/);
  await expect(page.getByRole('link', { name: 'Create your first store' })).toBeVisible();

  await page.reload();

  await expect(page).toHaveURL(/\/en\/onboarding$/);
  await expect(page.getByRole('link', { name: 'Create your first store' })).toBeVisible();
});

test('creating the first store progresses through provisioning into the dashboard', async ({ page }) => {
  await login(page, 'nostore@example.com');
  await page.goto('/en/create-store');

  await createFirstStore(page, {
    name: 'My First Store',
    slug: 'my-first-store',
  });

  await expect(page).toHaveURL(/\/en\/stores\/201\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('provisioning failure shows recovery UI without unlocking the dashboard', async ({ page }) => {
  await setNextCreatedStoreProvisioning(page.context().request, 'failed');
  await login(page, 'nostore@example.com');
  await page.goto('/en/create-store');

  await createFirstStore(page, {
    name: 'Recovery Store',
    slug: 'recovery-store',
  });

  await expect(page).toHaveURL(/\/en\/onboarding$/);
  await expect(page.getByText('Store provisioning needs attention')).toBeVisible();
  await expect(page.getByText('Recovery guidance')).toBeVisible();
  await expect(page.getByText('Do not resubmit store creation')).toBeVisible();
});

test('provisioning timeout messaging stays in onboarding with manual recovery actions', async ({ page }) => {
  await setNextCreatedStoreProvisioning(page.context().request, 'timed_out');
  await login(page, 'nostore@example.com');
  await page.goto('/en/create-store');

  await createFirstStore(page, {
    name: 'Timed Out Store',
    slug: 'timed-out-store',
  });

  await expect(page).toHaveURL(/\/en\/onboarding$/);
  await expect(page.getByText('Store provisioning needs attention')).toBeVisible();
  await expect(page.getByText('Store provisioning timed out. Retry provisioning to continue setup.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Check again' })).toBeVisible();
});

test('failed provisioning recovers after a manual check-again flow', async ({ page }) => {
  await setNextCreatedStoreProvisioning(page.context().request, 'failed');
  await login(page, 'nostore@example.com');
  await page.goto('/en/create-store');

  await createFirstStore(page, {
    name: 'Retry Store',
    slug: 'retry-store',
  });

  await expect(page.getByText('Store provisioning needs attention')).toBeVisible();

  await setStoreProvisioning(page.context().request, 201, {
    mode: 'auto-complete',
    status: 'pending',
    progress: 0,
    currentStep: 'initializing_store',
    message: 'Retrying provisioning.',
    retryable: false,
  });

  await page.getByRole('button', { name: 'Check again' }).click();

  await expect(page).toHaveURL(/\/en\/stores\/201\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('malformed provisioning payload falls back to a recovery-safe failure state', async ({ page }) => {
  await setNextCreatedStoreProvisioning(page.context().request, 'manual');
  await login(page, 'nostore@example.com');
  await page.goto('/en/create-store');

  await page.route(
    (url) =>
      url.pathname === '/api/proxy' &&
      url.searchParams.get('endpoint') === '/api/v1/stores/201/provisioning-status',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            status: 'running',
            progress: 'invalid',
          },
        }),
      });
    }
  );

  await createFirstStore(page, {
    name: 'Malformed Store',
    slug: 'malformed-store',
  });

  await expect(page).toHaveURL(/\/en\/onboarding$/);
  await expect(page.getByText('Store provisioning needs attention')).toBeVisible();
  await expect(
    page.getByText('Provisioning status could not be restored from the server response. Try checking again.')
  ).toBeVisible();
});

test('refresh during provisioning restores the user into the provisioning screen', async ({ page }) => {
  await setNextCreatedStoreProvisioning(page.context().request, 'stuck');
  await login(page, 'nostore@example.com');
  await page.goto('/en/create-store');

  await createFirstStore(page, {
    name: 'Refresh Store',
    slug: 'refresh-store',
  });

  await expect(page.getByText('Provisioning your store')).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/\/en\/onboarding$/);
  await expect(page.getByText('Provisioning your store')).toBeVisible();
});
