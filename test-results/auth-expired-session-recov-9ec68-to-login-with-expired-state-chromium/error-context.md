# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> expired session recovery redirects to login with expired state
- Location: tests/e2e/auth.spec.ts:91:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Sign in again to restore your dashboard')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Sign in again to restore your dashboard')

```

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | import {
  3   |   dismissMobileOverlay,
  4   |   expireCurrentSession,
  5   |   login,
  6   |   logout,
  7   |   resetMockBackend,
  8   |   signup,
  9   | } from './utils/mock-backend';
  10  | 
  11  | test.beforeEach(async ({ request }) => {
  12  |   await resetMockBackend(request);
  13  | });
  14  | 
  15  | test('register routes into verification-required onboarding', async ({ page }) => {
  16  |   await signup(page, {
  17  |     name: 'New Merchant',
  18  |     email: 'new-merchant@example.com',
  19  |     password: 'password123',
  20  |   });
  21  | 
  22  |   await expect(page).toHaveURL(/\/en\/onboarding$/);
  23  |   await expect(page.getByText('Verify your email')).toBeVisible();
  24  |   await expect(page.getByText('dashboard access stays locked until email verification is complete')).toBeVisible();
  25  | });
  26  | 
  27  | test('register renders duplicate email errors inline', async ({ page }) => {
  28  |   await signup(page, {
  29  |     name: 'Existing Merchant',
  30  |     email: 'merchant@example.com',
  31  |     password: 'password123',
  32  |   });
  33  | 
  34  |   await expect(page).toHaveURL(/\/en\/signup$/);
  35  |   await expect(page.getByTestId('signup-form-error')).toContainText('already been taken');
  36  |   await expect(page.getByTestId('signup-email')).toBeVisible();
  37  | });
  38  | 
  39  | test('login rejects invalid credentials inline', async ({ page }) => {
  40  |   await login(page, 'merchant@example.com', 'wrong-password');
  41  | 
  42  |   await expect(page).toHaveURL(/\/en\/login$/);
  43  |   await expect(page.getByTestId('login-form-error')).toContainText('Invalid credentials');
  44  | });
  45  | 
  46  | test('login preserves the original protected-route redirect target', async ({ page }) => {
  47  |   await page.goto('/en/stores/101/orders');
  48  |   await expect(page).toHaveURL(/\/en\/login\?redirect=/);
  49  | 
  50  |   await page.getByTestId('login-email').fill('merchant@example.com');
  51  |   await page.getByTestId('login-password').fill('password123');
  52  |   await page.getByTestId('login-submit').click();
  53  | 
  54  |   await expect(page).toHaveURL(/\/en\/stores\/101\/orders$/);
  55  |   await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
  56  | });
  57  | 
  58  | test('login routes a verified merchant into the active store dashboard', async ({ page }) => {
  59  |   await login(page, 'merchant@example.com');
  60  | 
  61  |   await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);
  62  |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  63  | });
  64  | 
  65  | test('login in one tab refreshes bootstrap and redirects guest tabs out of auth routes', async ({ browser }) => {
  66  |   const context = await browser.newContext();
  67  |   const primaryPage = await context.newPage();
  68  |   const secondaryPage = await context.newPage();
  69  | 
  70  |   await primaryPage.goto('/en/login');
  71  |   await secondaryPage.goto('/en/login');
  72  | 
  73  |   await login(primaryPage, 'merchant@example.com');
  74  |   await expect(primaryPage).toHaveURL(/\/en\/stores\/101\/dashboard$/);
  75  |   await expect(secondaryPage).toHaveURL(/\/en\/stores\/101\/dashboard$/);
  76  | 
  77  |   await context.close();
  78  | });
  79  | 
  80  | test('logout clears the session and redirects consistently', async ({ page }) => {
  81  |   await login(page, 'merchant@example.com');
  82  |   await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);
  83  |   await dismissMobileOverlay(page);
  84  | 
  85  |   await logout(page);
  86  | 
  87  |   await expect(page).toHaveURL(/\/en\/login$/);
  88  |   await expect(page.getByTestId('login-submit')).toBeVisible();
  89  | });
  90  | 
  91  | test('expired session recovery redirects to login with expired state', async ({ page }) => {
  92  |   await login(page, 'merchant@example.com');
  93  |   await expect(page).toHaveURL(/\/en\/stores\/101\/dashboard$/);
  94  | 
  95  |   await expireCurrentSession(page.context().request);
  96  |   await page.reload();
  97  | 
  98  |   await expect(page).toHaveURL(/\/en\/login/);
  99  |   await expect.poll(() => new URL(page.url()).searchParams.get('expired')).toBe('1');
> 100 |   await expect(page.getByText('Sign in again to restore your dashboard')).toBeVisible();
      |                                                                           ^ Error: expect(locator).toBeVisible() failed
  101 | });
  102 | 
```