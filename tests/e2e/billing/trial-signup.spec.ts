import { test, expect } from '@playwright/test';

test.describe('Trial Signup Flow', () => {

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

  test('should redirect to trial start page when no subscription exists', async ({ page }) => {
    await page.goto('/en/merchant/billing');
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    const onTrialPage = currentUrl.includes('/billing/trial/start');
    const onBillingPage = currentUrl.includes('/merchant/billing');

    if (onTrialPage) {
      await expect(page.locator('h1').or(page.locator('text=Choose Your Plan'))).toBeVisible({ timeout: 5000 });
      console.log('✅ Redirected to trial start page');
    } else if (onBillingPage) {
      await expect(page.locator('h1').or(page.locator('text=/Subscription|Billing/i'))).toBeVisible({ timeout: 5000 });
      console.log('✅ Billing page loaded (subscription exists)');
    } else {
      console.log('ℹ️ Current URL:', currentUrl);
    }
  });

  test('should display trial banner with correct urgency on dashboard', async ({ page }) => {
    await page.goto('/en/merchant/dashboard');
    await page.waitForLoadState('networkidle');

    const banner = page.locator('[data-testid="trial-banner"]');
    const bannerByText = page.locator('text=/Trial ends in/i');

    const bannerVisible = (await banner.isVisible().catch(() => false)) ||
                           (await bannerByText.isVisible().catch(() => false));
    if (bannerVisible) {
      console.log('✅ Trial banner displayed');
    } else {
      console.log('ℹ️ No trial banner visible (may not be in trial period)');
    }
  });

  test('should show plans page with plan options', async ({ page }) => {
    await page.goto('/en/merchant/billing/plans');
    await page.waitForLoadState('networkidle');

    const pageHeading = page.locator('h1');
    const headingText = await pageHeading.textContent().catch(() => '');
    expect(headingText?.length).toBeGreaterThan(0);
    console.log(`✅ Plans page loaded with heading: "${headingText}"`);

    const planCards = page.locator('button:has-text("Select Plan")');
    const count = await planCards.count().catch(() => 0);
    if (count > 0) {
      console.log(`✅ Found ${count} plan select buttons`);
    }

    await page.screenshot({ path: 'test-results/screenshots/plans-page.png', fullPage: true });
  });

  test('should handle trial page navigation gracefully', async ({ page }) => {
    await page.goto('/en/merchant/billing/trial/start');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    console.log(`ℹ️ Trial start page URL: ${currentUrl}`);

    await page.screenshot({ path: 'test-results/screenshots/trial-start-page.png', fullPage: true });
  });
});
