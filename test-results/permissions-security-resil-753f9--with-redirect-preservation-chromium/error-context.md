# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: permissions/security-resilience.spec.ts >> protected routes redirect unauthenticated users to login with redirect preservation
- Location: tests/e2e/permissions/security-resilience.spec.ts:22:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/en/stores/101/dashboard
Call log:
  - navigating to "http://localhost:3000/en/stores/101/dashboard", waiting until "load"

```

# Test source

```ts
  1  | /**
  2  |  * Flow: Authorization and Security Resilience
  3  |  * Layer: Playwright E2E — Layer 2
  4  |  * Purpose: Protects authorization boundaries, cross-tab session synchronization, and network resilience during critical operations
  5  |  * Belongs to: tests/e2e/permissions/security-resilience.spec.ts
  6  |  */
  7  | 
  8  | import { expect, test } from '@playwright/test';
  9  | import {
  10 |   createFirstStore,
  11 |   login,
  12 |   logout,
  13 |   resetMockBackend,
  14 |   setNextCreatedStoreProvisioning,
  15 |   setStoreProvisioning,
  16 | } from '../utils/mock-backend';
  17 | 
  18 | test.beforeEach(async ({ request }) => {
  19 |   await resetMockBackend(request);
  20 | });
  21 | 
  22 | test('protected routes redirect unauthenticated users to login with redirect preservation', async ({ page }) => {
> 23 |   await page.goto('/en/stores/101/dashboard');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/en/stores/101/dashboard
  24 | 
  25 |   await expect(page).toHaveURL(/\/en\/login\?redirect=/);
  26 |   expect(decodeURIComponent(page.url())).toContain('/en/stores/101/dashboard');
  27 | });
  28 | 
  29 | test('cross-tab logout synchronizes session termination', async ({ browser }) => {
  30 |   const context = await browser.newContext();
  31 |   const primaryPage = await context.newPage();
  32 |   const secondaryPage = await context.newPage();
  33 | 
  34 |   await login(primaryPage, 'merchant@example.com');
  35 |   await expect(primaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);
  36 | 
  37 |   await secondaryPage.goto('/en/merchant/dashboard');
  38 |   await expect(secondaryPage).toHaveURL(/\/en\/merchant\/dashboard$/);
  39 | 
  40 |   await logout(primaryPage);
  41 | 
  42 |   await expect(primaryPage).toHaveURL(/\/en\/login$/);
  43 |   await expect(secondaryPage).toHaveURL(/\/en\/login\?redirect=/);
  44 | 
  45 |   await context.close();
  46 | });
  47 | 
  48 | test('network interruption during provisioning shows offline recovery UI', async ({ browser }) => {
  49 |   const context = await browser.newContext();
  50 |   const page = await context.newPage();
  51 | 
  52 |   await setNextCreatedStoreProvisioning(context.request, 'stuck');
  53 |   await login(page, 'nostore@example.com');
  54 |   await page.goto('/en/setup');
  55 | 
  56 |   await createFirstStore(page, {
  57 |     name: 'Offline Store',
  58 |     slug: 'offline-store',
  59 |   });
  60 | 
  61 |   await expect(page.getByRole('heading', { name: 'Setting up Offline Store...' })).toBeVisible();
  62 | 
  63 |   await context.setOffline(true);
  64 |   await expect(page.getByText('You are offline.')).toBeVisible();
  65 | 
  66 |   await context.setOffline(false);
  67 |   await setStoreProvisioning(context.request, 201, {
  68 |     mode: 'auto-complete',
  69 |   });
  70 |   await page.getByRole('button', { name: 'Check again' }).click();
  71 | 
  72 |   await expect(page).toHaveURL(/\/en\/setup$/, { timeout: 15_000 });
  73 |   await expect(page.getByRole('button', { name: 'Check again' })).toBeVisible();
  74 |   
  75 |   await context.close();
  76 | });
  77 | 
```