import { test, expect } from '@playwright/test';

test.describe('Billing Portal Back Navigation', () => {
  test('should not show infinite loading when navigating back from billing portal', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      console.log(`[Browser ${msg.type()}]:`, msg.text());
    });

    // Navigate to login page
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:3000/en/login');
    await page.waitForLoadState('networkidle');

    // Login
    console.log('2. Logging in...');
    await page.fill('input[name="email"]', 'merchant@test.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for redirect after login
    await page.waitForURL(/merchant/, { timeout: 10000 });
    console.log('3. Login successful, redirected to:', page.url());

    // Navigate to billing page
    console.log('4. Navigating to billing page...');
    await page.goto('http://localhost:3000/en/merchant/billing');
    await page.waitForLoadState('networkidle');

    // Wait for billing page to fully load
    await page.waitForSelector('h1:has-text("Subscription & Billing")', { timeout: 10000 });
    console.log('5. Billing page loaded');

    // Take screenshot before clicking portal
    await page.screenshot({ path: 'billing-before-portal.png', fullPage: true });

    // Check if "Billing Portal" button exists
    const portalButton = page.locator('button:has-text("Billing Portal")');
    await expect(portalButton).toBeVisible({ timeout: 5000 });
    console.log('6. Found Billing Portal button');

    // Click the Billing Portal button
    console.log('7. Clicking Billing Portal button...');
    
    // Wait for navigation to Stripe
    const [newPage] = await Promise.all([
      page.waitForEvent('popup', { timeout: 10000 }).catch(() => null) || 
      page.context().waitForEvent('page', { timeout: 10000 }).catch(() => null),
      portalButton.click()
    ]);

    // If it's a popup/new tab
    if (newPage) {
      console.log('8. New page/popup opened:', newPage.url());
      await newPage.waitForLoadState('networkidle').catch(() => {});
      await newPage.close();
    } else {
      // If it's same page navigation, wait for Stripe URL
      console.log('8. Waiting for Stripe redirect...');
      await page.waitForURL(/stripe\.com|billing\.stripe\.com/, { timeout: 10000 }).catch(() => {
        console.log('   Current URL:', page.url());
      });
      
      if (page.url().includes('stripe')) {
        console.log('9. Stripe portal loaded:', page.url());
        
        // Now click the browser back button
        console.log('10. Clicking browser back button...');
        await page.goBack();
      } else {
        console.log('9. Did not navigate to Stripe, current URL:', page.url());
        // Still try to go back
        console.log('10. Clicking browser back button anyway...');
        await page.goBack();
      }
    }

    // Wait a moment for page restoration
    await page.waitForTimeout(1000);
    console.log('11. Navigated back to:', page.url());

    // Check for loading spinner
    const loadingSpinner = page.locator('text=Preparing your session');
    
    // Wait briefly to see if loading spinner appears
    await page.waitForTimeout(2000);
    
    const isLoadingVisible = await loadingSpinner.isVisible().catch(() => false);
    
    if (isLoadingVisible) {
      console.log('❌ ISSUE: Loading spinner is visible!');
      await page.screenshot({ path: 'billing-loading-spinner.png', fullPage: true });
      
      // Wait longer to see if it eventually loads
      console.log('12. Waiting 10 seconds to see if spinner clears...');
      await page.waitForTimeout(10000);
      
      const stillLoading = await loadingSpinner.isVisible().catch(() => false);
      if (stillLoading) {
        console.log('❌ FAIL: Loading spinner still visible after 10 seconds!');
      } else {
        console.log('✓ Loading spinner eventually cleared');
      }
    } else {
      console.log('✅ SUCCESS: No loading spinner detected!');
    }

    // Check if billing page content is visible
    const billingHeader = page.locator('h1:has-text("Subscription & Billing")');
    await expect(billingHeader).toBeVisible({ timeout: 5000 });
    console.log('13. Billing page content is visible');

    // Take final screenshot
    await page.screenshot({ path: 'billing-after-back.png', fullPage: true });

    // Verify no infinite loading spinner
    expect(isLoadingVisible).toBe(false);
    
    console.log('✅ Test completed successfully!');
  });
});
