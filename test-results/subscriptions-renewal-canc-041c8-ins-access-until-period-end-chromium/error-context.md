# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: subscriptions/renewal.spec.ts >> cancelled subscription retains access until period end
- Location: tests/e2e/subscriptions/renewal.spec.ts:156:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/en/login
Call log:
  - navigating to "http://localhost:3000/en/login", waiting until "load"

```

# Test source

```ts
  1   | import type { APIRequestContext, Page } from '@playwright/test';
  2   | 
  3   | const mockApiBaseUrl = process.env.PLAYWRIGHT_MOCK_API_URL ?? 'http://localhost:4100';
  4   | 
  5   | async function sendCommand(request: APIRequestContext, payload: Record<string, unknown>): Promise<void> {
  6   |   const response = await request.post(`${mockApiBaseUrl}/__test/command`, {
  7   |     data: payload,
  8   |   });
  9   | 
  10  |   if (!response.ok()) {
  11  |     throw new Error(`Mock backend command failed: ${response.status()} ${response.statusText()}`);
  12  |   }
  13  | }
  14  | 
  15  | export async function resetMockBackend(request: APIRequestContext): Promise<void> {
  16  |   await sendCommand(request, { action: 'reset' });
  17  | }
  18  | 
  19  | export async function verifyUser(request: APIRequestContext, email: string): Promise<void> {
  20  |   await sendCommand(request, {
  21  |     action: 'verify-user',
  22  |     email,
  23  |   });
  24  | }
  25  | 
  26  | export async function expireCurrentSession(request: APIRequestContext): Promise<void> {
  27  |   await sendCommand(request, { action: 'expire-session' });
  28  | }
  29  | 
  30  | export async function setNextCreatedStoreProvisioning(
  31  |   request: APIRequestContext,
  32  |   mode: 'auto-complete' | 'failed' | 'timed_out' | 'stuck' | 'manual'
  33  | ): Promise<void> {
  34  |   await sendCommand(request, {
  35  |     action: 'set-next-created-store-provisioning',
  36  |     mode,
  37  |   });
  38  | }
  39  | 
  40  | export async function setStoreProvisioning(
  41  |   request: APIRequestContext,
  42  |   storeId: number,
  43  |   payload: {
  44  |     mode?: 'auto-complete' | 'failed' | 'timed_out' | 'stuck' | 'manual';
  45  |     status?: 'pending' | 'running' | 'completed' | 'failed';
  46  |     progress?: number;
  47  |     currentStep?: string | null;
  48  |     message?: string | null;
  49  |     retryable?: boolean;
  50  |   }
  51  | ): Promise<void> {
  52  |   await sendCommand(request, {
  53  |     action: 'set-store-provisioning',
  54  |     storeId,
  55  |     ...payload,
  56  |   });
  57  | }
  58  | 
  59  | export async function login(page: Page, email: string, password = 'password123'): Promise<void> {
> 60  |   await page.goto('/en/login');
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/en/login
  61  |   
  62  |   // Wait for the login page to be fully loaded
  63  |   await page.waitForSelector('[data-testid="login-submit"]', { state: 'visible', timeout: 10000 });
  64  |   
  65  |   // Fill the login form using the correct testid selectors from LoginForm.tsx
  66  |   await page.getByTestId('login-email').fill(email);
  67  |   await page.getByTestId('login-password').fill(password);
  68  |   
  69  |   // Click submit and wait for navigation to complete
  70  |   // The login redirects to either /merchant/dashboard or /setup depending on onboarding state
  71  |   await page.getByTestId('login-submit').click();
  72  |   
  73  |   // Wait for navigation to happen (either to dashboard or setup)
  74  |   await page.waitForURL(/\/(merchant\/dashboard|setup)/, { timeout: 15000 });
  75  |   
  76  |   // Additional wait to ensure the page is fully loaded after redirect
  77  |   await page.waitForLoadState('networkidle', { timeout: 10000 });
  78  | }
  79  | 
  80  | export async function signup(page: Page, input: {
  81  |   name: string;
  82  |   email: string;
  83  |   password: string;
  84  | }): Promise<void> {
  85  |   await page.goto('/en/signup');
  86  |   await page.getByTestId('signup-name').fill(input.name);
  87  |   await page.getByTestId('signup-email').fill(input.email);
  88  |   await page.getByTestId('signup-password').fill(input.password);
  89  |   await page.getByTestId('signup-password-confirmation').fill(input.password);
  90  |   await page.getByTestId('signup-submit').click();
  91  | }
  92  | 
  93  | export async function createFirstStore(page: Page, input: { name: string; slug: string }): Promise<void> {
  94  |   await page.getByTestId('create-store-name').fill(input.name);
  95  |   await page.getByTestId('create-store-slug').fill(input.slug);
  96  |   await page.getByTestId('create-store-submit').click();
  97  | }
  98  | 
  99  | export async function dismissMobileOverlay(page: Page): Promise<void> {
  100 |   const closeButton = page.getByRole('button', { name: 'Close' });
  101 |   if (await closeButton.isVisible().catch(() => false)) {
  102 |     await closeButton.click();
  103 |   }
  104 | }
  105 | 
  106 | export async function logout(page: Page): Promise<void> {
  107 |   await dismissMobileOverlay(page);
  108 |   await page.getByTestId('user-menu-trigger').click();
  109 |   await page.getByTestId('logout-action').click();
  110 | }
  111 | 
  112 | export async function switchToStore(page: Page, storeName: string): Promise<void> {
  113 |   await dismissMobileOverlay(page);
  114 |   await page.getByTestId('store-switcher').click();
  115 |   await page.getByRole('option', { name: storeName }).click();
  116 | }
  117 | 
  118 | export async function createStoreForm(page: Page, input: { name: string; slug: string }): Promise<void> {
  119 |   await page.getByTestId('create-store-name').fill(input.name);
  120 |   await page.getByTestId('create-store-slug').fill(input.slug);
  121 |   await page.getByTestId('create-store-submit').click();
  122 | }
  123 | 
  124 | export async function setMockBootstrapStores(
  125 |   request: APIRequestContext,
  126 |   stores: Array<{
  127 |     id?: number;
  128 |     name?: string;
  129 |     slug?: string;
  130 |     status?: string;
  131 |     isActive?: boolean;
  132 |     permissions?: string[];
  133 |   }>,
  134 |   activeStoreId?: number | null
  135 | ): Promise<void> {
  136 |   await sendCommand(request, {
  137 |     action: 'set-bootstrap-stores',
  138 |     stores,
  139 |     ...(activeStoreId !== undefined ? { activeStoreId } : {}),
  140 |   });
  141 | }
  142 | 
```