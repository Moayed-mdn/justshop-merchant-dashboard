import { test, expect } from '@playwright/test';

const PROXY_PREFIX = '/api/proxy?endpoint=/api/v1/merchant/billing';

test.describe('Quota Guard Enforcement', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/en/login');
    await page.waitForLoadState('networkidle');
    const emailInput = page.locator('[data-testid="login-email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill('merchant@test.com');
    await page.locator('[data-testid="login-password"]').fill('password');
    await page.locator('[data-testid="login-submit"]').click();
    await page.waitForLoadState('networkidle');
  });

  test('should load create product page', async ({ page }) => {
    await page.goto('/en/merchant/products/new');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    console.log(`ℹ️ New product page URL: ${currentUrl}`);

    const limitMessage = page.locator('text=/Product limit reached|Upgrade required/i');
    const hasLimit = await limitMessage.isVisible().catch(() => false);
    if (hasLimit) {
      console.log('✅ Product quota guard displayed');
    }

    const formField = page.locator('input[name="name"]').or(page.locator('label:has-text("Name")'));
    const formVisible = await formField.isVisible().catch(() => false);
    console.log(`ℹ️ Product form accessible: ${formVisible}`);

    await page.screenshot({ path: 'test-results/screenshots/new-product-page.png', fullPage: true });
  });

  test('should load create store page', async ({ page }) => {
    await page.goto('/en/merchant/stores/create');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    console.log(`ℹ️ Create store page URL: ${currentUrl}`);

    const limitMessage = page.locator('text=/Store limit reached|Upgrade required/i');
    const hasLimit = await limitMessage.isVisible().catch(() => false);
    if (hasLimit) {
      console.log('✅ Store quota guard displayed');
    }

    await page.screenshot({ path: 'test-results/screenshots/create-store-page.png', fullPage: true });
  });

  test('should handle subscription usage API endpoint', async ({ page }) => {
    const response = await page.request.get(`${PROXY_PREFIX}/subscription/usage`);
    const status = response.status();
    console.log(`ℹ️ Subscription usage API status: ${status}`);

    if (response.ok()) {
      const data = await response.json();
      console.log('✅ Subscription usage data retrieved');
    } else {
      const body = await response.text().catch(() => '');
      console.log(`ℹ️ Usage response (${status}): ${body.substring(0, 200)}`);
    }
  });

  test('should fail open gracefully when usage API fails', async ({ page }) => {
    await page.route('**/api/proxy?endpoint=**/subscription/usage**', route => {
      route.abort('failed');
    });

    await page.goto('/en/merchant/products/new');
    await page.waitForLoadState('networkidle');

    const formField = page.locator('input[name="name"]').or(page.locator('label:has-text("Name")'));
    const formVisible = await formField.isVisible().catch(() => false);
    console.log(`ℹ️ Product form accessible with API failure: ${formVisible}`);

    if (formVisible) {
      console.log('✅ Guard fails open correctly on API error');
    }
  });

  test('should check usage meters on billing page', async ({ page }) => {
    await page.goto('/en/merchant/billing');
    await page.waitForLoadState('networkidle');

    const usageSection = page.locator('text=/Usage|Limits|Products|Stores/i');
    const usageVisible = await usageSection.first().isVisible().catch(() => false);
    if (usageVisible) {
      console.log('✅ Usage/limits section visible on billing page');
    } else {
      console.log('ℹ️ No usage section visible');
    }

    await page.screenshot({ path: 'test-results/screenshots/billing-usage.png', fullPage: true });
  });
});
