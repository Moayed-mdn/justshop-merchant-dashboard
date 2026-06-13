const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('bfcache') || text.includes('pageshow') || text.includes('BootstrapProvider')) {
      console.log(`[BROWSER LOG] ${text}`);
    }
  });

  try {
    console.log('\n=== Testing bfcache Restoration Bug ===\n');
    
    // Login
    console.log('Step 1: Login...');
    await page.goto('http://localhost:3001/en/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'merchant@test.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    console.log('✓ Logged in\n');

    // Navigate to orders
    console.log('Step 2: Navigate to /merchant/orders...');
    await page.goto('http://localhost:3001/en/merchant/orders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check initial UI state
    const initialSidebarVisible = await page.locator('[data-slot="sidebar-nav"], nav[aria-label*="sidebar" i]').count() > 0 || 
                                    await page.locator('text=Themes').count() > 0;
    const initialStoreVisible = await page.locator('[data-testid="workspace-store-switcher"]').count() > 0;
    
    console.log(`✓ Orders page loaded`);
    console.log(`  - Sidebar visible: ${initialSidebarVisible || await page.locator('text=Themes').count() > 0}`);
    console.log(`  - Store switcher visible: ${initialStoreVisible}\n`);

    // Navigate to Google
    console.log('Step 3: Navigate to Google...');
    await page.goto('https://www.google.com/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    console.log('✓ On Google\n');

    // Go back
    console.log('Step 4: Click BACK button...');
    console.log('Monitoring for bfcache restoration...\n');
    
    await page.goBack();
    
    // Wait a moment for page to settle
    await page.waitForTimeout(3000);
    
    console.log('=== Checking UI State After Back Navigation ===\n');
    
    // Check for loading indicators
    const hasLoadingSpinner = await page.locator('[class*="animate-spin"]').count() > 0;
    const hasLoadingText = await page.locator('text=/loading/i').count() > 0;
    
    // Check for "No active store" error
    const hasNoActiveStore = await page.locator('text=/no active store/i').count() > 0;
    
    // Check if sidebar is visible
    const sidebarVisible = await page.locator('text=Themes').isVisible().catch(() => false) ||
                          await page.locator('text=Stores').isVisible().catch(() => false);
    
    // Check if store switcher has content
    const storeSwitcherVisible = await page.locator('[data-testid="workspace-store-switcher"]').count() > 0;
    const storeSwitcherHasText = storeSwitcherVisible ? 
      (await page.locator('[data-testid="workspace-store-switcher"]').textContent()).trim().length > 0 :
      false;
    
    console.log(`Current URL: ${page.url()}`);
    console.log(`\nUI State:`);
    console.log(`  ❓ Loading spinner visible: ${hasLoadingSpinner}`);
    console.log(`  ❓ Loading text visible: ${hasLoadingText}`);
    console.log(`  ❓ "No active store" error: ${hasNoActiveStore}`);
    console.log(`  ❓ Sidebar visible: ${sidebarVisible}`);
    console.log(`  ❓ Store switcher visible: ${storeSwitcherVisible}`);
    console.log(`  ❓ Store switcher has content: ${storeSwitcherHasText}`);
    
    // Determine if bug is present
    const bugPresent = hasNoActiveStore || 
                       (hasLoadingSpinner && hasLoadingText && !sidebarVisible) ||
                       (storeSwitcherVisible && !storeSwitcherHasText);
    
    if (bugPresent) {
      console.log(`\n🔴 BUG DETECTED!`);
      console.log(`   The page is stuck in a loading state after bfcache restoration.`);
      
      // Try to get more details
      const bodyText = await page.locator('body').textContent();
      if (bodyText.includes('No active store')) {
        console.log(`   Error message: "No active store"`);
      }
      if (bodyText.includes('Loading your workspace')) {
        console.log(`   Loading message: "Loading your workspace..."`);
      }
    } else {
      console.log(`\n✅ NO BUG DETECTED!`);
      console.log(`   The page restored successfully from bfcache.`);
      console.log(`   All UI elements are rendering correctly.`);
    }
    
    // Wait longer to see if it eventually loads
    console.log(`\nWaiting 10 more seconds to see if it recovers...`);
    await page.waitForTimeout(10000);
    
    const finalSidebarVisible = await page.locator('text=Themes').isVisible().catch(() => false);
    const finalLoadingVisible = await page.locator('[class*="animate-spin"]').count() > 0;
    
    console.log(`\nFinal State:`);
    console.log(`  - Sidebar visible: ${finalSidebarVisible}`);
    console.log(`  - Still loading: ${finalLoadingVisible}`);
    
    if (!finalSidebarVisible && finalLoadingVisible) {
      console.log(`\n🔴 CONFIRMED: Page never recovered - stuck in loading state`);
    } else if (finalSidebarVisible && !bugPresent) {
      console.log(`\n✅ CONFIRMED: Page is working correctly`);
    } else if (finalSidebarVisible && bugPresent) {
      console.log(`\n⚠️  Page recovered but took too long (> 3 seconds)`);
    }

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  }

  console.log('\n\nClosing in 5 seconds...');
  await page.waitForTimeout(5000);
  await browser.close();
})();
