import type { APIRequestContext, Page } from '@playwright/test';

const mockApiBaseUrl = process.env.PLAYWRIGHT_MOCK_API_URL ?? 'http://127.0.0.1:4100';

async function sendCommand(request: APIRequestContext, payload: Record<string, unknown>): Promise<void> {
  const response = await request.post(`${mockApiBaseUrl}/__test/command`, {
    data: payload,
  });

  if (!response.ok()) {
    throw new Error(`Mock backend command failed: ${response.status()} ${response.statusText()}`);
  }
}

export async function resetMockBackend(request: APIRequestContext): Promise<void> {
  await sendCommand(request, { action: 'reset' });
}

export async function verifyUser(request: APIRequestContext, email: string): Promise<void> {
  await sendCommand(request, {
    action: 'verify-user',
    email,
  });
}

export async function expireCurrentSession(request: APIRequestContext): Promise<void> {
  await sendCommand(request, { action: 'expire-session' });
}

export async function setNextCreatedStoreProvisioning(
  request: APIRequestContext,
  mode: 'auto-complete' | 'failed' | 'timed_out' | 'stuck' | 'manual'
): Promise<void> {
  await sendCommand(request, {
    action: 'set-next-created-store-provisioning',
    mode,
  });
}

export async function setStoreProvisioning(
  request: APIRequestContext,
  storeId: number,
  payload: {
    mode?: 'auto-complete' | 'failed' | 'timed_out' | 'stuck' | 'manual';
    status?: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
    currentStep?: string | null;
    message?: string | null;
    retryable?: boolean;
  }
): Promise<void> {
  await sendCommand(request, {
    action: 'set-store-provisioning',
    storeId,
    ...payload,
  });
}

export async function login(page: Page, email: string, password = 'password123'): Promise<void> {
  await page.goto('/en/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
}

export async function signup(page: Page, input: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  await page.goto('/en/signup');
  await page.getByTestId('signup-name').fill(input.name);
  await page.getByTestId('signup-email').fill(input.email);
  await page.getByTestId('signup-password').fill(input.password);
  await page.getByTestId('signup-password-confirmation').fill(input.password);
  await page.getByTestId('signup-submit').click();
}

export async function createFirstStore(page: Page, input: { name: string; slug: string }): Promise<void> {
  await page.getByTestId('create-store-name').fill(input.name);
  await page.getByTestId('create-store-slug').fill(input.slug);
  await page.getByTestId('create-store-submit').click();
}

export async function dismissMobileOverlay(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
}

export async function logout(page: Page): Promise<void> {
  await dismissMobileOverlay(page);
  await page.getByTestId('user-menu-trigger').click();
  await page.getByTestId('logout-action').click();
}
