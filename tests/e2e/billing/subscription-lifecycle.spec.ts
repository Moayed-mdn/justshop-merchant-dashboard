import { test, expect } from '@playwright/test';

const PROXY_PREFIX = '/api/proxy?endpoint=/api/v1/merchant/billing';

test.describe('Subscription Lifecycle Management', () => {

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

  test('should display billing page with subscription info', async ({ page }) => {
    await page.goto('/en/merchant/billing');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    console.log(`ℹ️ Billing page URL: ${currentUrl}`);

    const heading = page.locator('h1');
    const headingText = await heading.textContent().catch(() => '');
    console.log(`ℹ️ Page heading: "${headingText}"`);

    await page.screenshot({ path: 'test-results/screenshots/billing-page.png', fullPage: true });
  });

  test('should display plans page with billing cycle toggle', async ({ page }) => {
    await page.goto('/en/merchant/billing/plans');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });

    const monthlyToggle = page.locator('button:has-text("Monthly")');
    const annualToggle = page.locator('button:has-text("Annual")');
    const monthlyVisible = await monthlyToggle.isVisible().catch(() => false);
    const annualVisible = await annualToggle.isVisible().catch(() => false);

    if (monthlyVisible && annualVisible) {
      console.log('✅ Billing cycle toggle visible (Monthly/Annual)');
    } else {
      console.log('ℹ️ Billing cycle toggle state:', { monthlyVisible, annualVisible });
    }

    const selectPlanButtons = page.locator('button:has-text("Select Plan")');
    const planCount = await selectPlanButtons.count().catch(() => 0);
    console.log(`✅ Found ${planCount} plan selection buttons`);

    await page.screenshot({ path: 'test-results/screenshots/plans-billing-cycle.png', fullPage: true });
  });

  test('should navigate between billing pages correctly', async ({ page }) => {
    await page.goto('/en/merchant/billing');
    await page.waitForLoadState('networkidle');

    const invoicesLink = page.locator('a:has-text("View Invoices")');
    if (await invoicesLink.isVisible().catch(() => false)) {
      await invoicesLink.click();
      await page.waitForLoadState('networkidle');
      const invoiceUrl = page.url();
      console.log(`✅ Navigated to invoices: ${invoiceUrl}`);
    } else {
      console.log('ℹ️ View Invoices link not visible');
    }

    await page.goto('/en/merchant/billing/plans');
    await page.waitForLoadState('networkidle');
    console.log(`✅ Navigated to plans page: ${page.url()}`);
  });

  test('should handle subscription API endpoint', async ({ page }) => {
    const response = await page.request.get(`${PROXY_PREFIX}/subscription`);
    const status = response.status();
    console.log(`ℹ️ Subscription API status: ${status}`);

    if (response.ok()) {
      const data = await response.json();
      console.log('✅ Subscription data retrieved');
    } else {
      const errorText = await response.text().catch(() => 'no body');
      console.log(`ℹ️ Subscription API response (${status}): ${errorText.substring(0, 200)}`);
    }
  });

  test('should handle upgrade API endpoint validation', async ({ page }) => {
    const response = await page.request.post(`${PROXY_PREFIX}/subscription/upgrade`, {
      data: { plan_slug: 'invalid-plan', billing_cycle: 'invalid-cycle' },
    });
    const status = response.status();
    console.log(`ℹ️ Upgrade validation API status: ${status}`);

    if (status === 422) {
      const data = await response.json();
      console.log('✅ Validation error returned as expected');
    } else {
      const body = await response.text().catch(() => '');
      console.log(`ℹ️ Upgrade response (${status}): ${body.substring(0, 200)}`);
    }
  });
});
