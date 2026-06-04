# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: commerce/order.spec.ts >> merchant can update order status
- Location: tests/e2e/commerce/order.spec.ts:43:5

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-testid="login-submit"]') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - heading "404" [level=1] [ref=e5]
    - heading "Server Error" [level=2] [ref=e6]
    - paragraph [ref=e7]: The requested tenant could not be resolved from the storefront domain.
    - link "Go back home" [ref=e9] [cursor=pointer]:
      - /url: /
  - status [ref=e10]
  - iframe [ref=e11]:
    - generic [ref=f1e2]:
      - banner [ref=f1e3]:
        - generic [ref=f1e5]:
          - checkbox [ref=f1e6]
          - generic "Light mode" [ref=f1e8] [cursor=pointer]:
            - img [ref=f1e9]
      - generic [ref=f1e13]:
        - heading "Error" [level=4] [ref=f1e14]
        - heading "An error has occurred" [level=1] [ref=f1e15]
      - heading "The requested tenant could not be resolved from the storefront domain. Copy error message to clipboard" [level=2] [ref=f1e19]:
        - img [ref=f1e21]
        - generic [ref=f1e23]: The requested tenant could not be resolved from the storefront domain.
        - button "Copy error message to clipboard" [ref=f1e24] [cursor=pointer]:
          - img [ref=f1e25]
      - generic [ref=f1e30]:
        - heading "Stack Trace" [level=3] [ref=f1e33]
        - generic [ref=f1e35]:
          - generic [ref=f1e36]:
            - generic [ref=f1e38]:
              - checkbox "View All Frames" [ref=f1e39]
              - generic [ref=f1e40]: View All Frames
            - generic [ref=f1e42]:
              - button "Pretty" [ref=f1e43]
              - button "Raw" [ref=f1e44]
          - list [ref=f1e47]:
            - listitem [ref=f1e48]:
              - generic [ref=f1e49]:
                - button "src/core/runtime/router/useRouteResolver.ts in resolveRoute at line 25:19" [ref=f1e50]:
                  - link "src/core/runtime/router/useRouteResolver.ts" [ref=f1e51] [cursor=pointer]:
                    - /url: vscode://file//home/leader/projects/laravel/tenant/justshop-frontend/src/core/runtime/router/useRouteResolver.ts:25
                  - generic [ref=f1e52]:
                    - text: in
                    - code [ref=f1e53]: resolveRoute
                  - generic [ref=f1e54]:
                    - text: at line
                    - code [ref=f1e55]: 25:19
                - generic [ref=f1e56]:
                  - generic [ref=f1e57]: In App
                  - button [ref=f1e58]:
                    - img [ref=f1e59]
              - code [ref=f1e63]:
                - generic [ref=f1e77]: "locale: context.value.locale, }, showError: false, }, ) if (error) { const err = new Error(error.message) as any err.statusCode = error.statusCode || 500 err.data = error err.__storefront_error = true"
            - listitem [ref=f1e78]:
              - generic [ref=f1e79]:
                - button "app/pages/[...slug].vue in async watch at line 122:26" [ref=f1e80]:
                  - link "app/pages/[...slug].vue" [ref=f1e81] [cursor=pointer]:
                    - /url: vscode://file//home/leader/projects/laravel/tenant/justshop-frontend/app/pages/[...slug].vue:122
                  - generic [ref=f1e82]:
                    - text: in
                    - code [ref=f1e83]: async watch
                  - generic [ref=f1e84]:
                    - text: at line
                    - code [ref=f1e85]: 122:26
                - generic [ref=f1e86]:
                  - generic [ref=f1e87]: In App
                  - button [ref=f1e88]:
                    - img [ref=f1e89]
            - listitem [ref=f1e91]:
              - generic [ref=f1e92]:
                - button "app/pages/[...slug].vue in async setup at line 154:18" [ref=f1e93]:
                  - link "app/pages/[...slug].vue" [ref=f1e94] [cursor=pointer]:
                    - /url: vscode://file//home/leader/projects/laravel/tenant/justshop-frontend/app/pages/[...slug].vue:154
                  - generic [ref=f1e95]:
                    - text: in
                    - code [ref=f1e96]: async setup
                  - generic [ref=f1e97]:
                    - text: at line
                    - code [ref=f1e98]: 154:18
                - generic [ref=f1e99]:
                  - generic [ref=f1e100]: In App
                  - button [ref=f1e101]:
                    - img [ref=f1e102]
      - generic [ref=f1e105]:
        - heading "Error Cause" [level=3] [ref=f1e108]
        - code [ref=f1e113]:
          - generic [ref=f1e114]:
            - text: "Error {"
            - button "▼" [ref=f1e115]:
              - generic [ref=f1e116]: ▼
            - text: "}"
      - generic [ref=f1e118]:
        - heading "Request" [level=3] [ref=f1e120]
        - generic [ref=f1e121]:
          - generic [ref=f1e122]:
            - heading "url" [level=4] [ref=f1e123]
            - text: http://localhost:3000/en/login
          - generic [ref=f1e124]:
            - heading "method" [level=4] [ref=f1e125]
            - text: GET
          - generic [ref=f1e126]:
            - heading "headers" [level=4] [ref=f1e127]
            - table [ref=f1e128]:
              - rowgroup [ref=f1e129]:
                - row "host localhost:3000" [ref=f1e130]:
                  - cell "host" [ref=f1e131]
                  - cell "localhost:3000" [ref=f1e132]
                - row "connection close" [ref=f1e133]:
                  - cell "connection" [ref=f1e134]
                  - cell "close" [ref=f1e135]
                - row "sec-ch-ua \"Chromium\";v=\"148\", \"HeadlessChrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"" [ref=f1e136]:
                  - cell "sec-ch-ua" [ref=f1e137]
                  - cell "\"Chromium\";v=\"148\", \"HeadlessChrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"" [ref=f1e138]
                - row "sec-ch-ua-mobile ?0" [ref=f1e139]:
                  - cell "sec-ch-ua-mobile" [ref=f1e140]
                  - cell "?0" [ref=f1e141]
                - row "sec-ch-ua-platform \"Windows\"" [ref=f1e142]:
                  - cell "sec-ch-ua-platform" [ref=f1e143]
                  - cell "\"Windows\"" [ref=f1e144]
                - row "upgrade-insecure-requests 1" [ref=f1e145]:
                  - cell "upgrade-insecure-requests" [ref=f1e146]
                  - cell "1" [ref=f1e147]
                - row "user-agent Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36" [ref=f1e148]:
                  - cell "user-agent" [ref=f1e149]
                  - cell "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36" [ref=f1e150]
                - row "accept-language en-US" [ref=f1e151]:
                  - cell "accept-language" [ref=f1e152]
                  - cell "en-US" [ref=f1e153]
                - row "accept text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" [ref=f1e154]:
                  - cell "accept" [ref=f1e155]
                  - cell "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" [ref=f1e156]
                - row "sec-fetch-site none" [ref=f1e157]:
                  - cell "sec-fetch-site" [ref=f1e158]
                  - cell "none" [ref=f1e159]
                - row "sec-fetch-mode navigate" [ref=f1e160]:
                  - cell "sec-fetch-mode" [ref=f1e161]
                  - cell "navigate" [ref=f1e162]
                - row "sec-fetch-user ?1" [ref=f1e163]:
                  - cell "sec-fetch-user" [ref=f1e164]
                  - cell "?1" [ref=f1e165]
                - row "sec-fetch-dest document" [ref=f1e166]:
                  - cell "sec-fetch-dest" [ref=f1e167]
                  - cell "document" [ref=f1e168]
                - row "accept-encoding gzip, deflate, br, zstd" [ref=f1e169]:
                  - cell "accept-encoding" [ref=f1e170]
                  - cell "gzip, deflate, br, zstd" [ref=f1e171]
                - row "x-forwarded-for 127.0.0.1" [ref=f1e172]:
                  - cell "x-forwarded-for" [ref=f1e173]
                  - cell "127.0.0.1" [ref=f1e174]
                - row "x-forwarded-port 3000" [ref=f1e175]:
                  - cell "x-forwarded-port" [ref=f1e176]
                  - cell "3000" [ref=f1e177]
                - row "x-forwarded-proto http" [ref=f1e178]:
                  - cell "x-forwarded-proto" [ref=f1e179]
                  - cell "http" [ref=f1e180]
  - button "Toggle detailed error view" [ref=e12] [cursor=pointer]:
    - generic [ref=e13]: Toggle detailed error view
  - generic:
    - img
  - generic:
    - generic:
      - generic:
        - button "Go to parent" [disabled]
        - button "Open in editor"
        - button "Close"
  - generic [ref=e14]:
    - button "Toggle Nuxt DevTools" [ref=e15] [cursor=pointer]:
      - img [ref=e16]
    - generic "App load time" [ref=e19]:
      - generic [ref=e20]: "2.9"
      - generic [ref=e21]: s
    - button "Toggle Component Inspector" [ref=e23] [cursor=pointer]:
      - img [ref=e24]
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
  60  |   await page.goto('/en/login');
  61  |   
  62  |   // Wait for the login page to be fully loaded
> 63  |   await page.waitForSelector('[data-testid="login-submit"]', { state: 'visible', timeout: 10000 });
      |              ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
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