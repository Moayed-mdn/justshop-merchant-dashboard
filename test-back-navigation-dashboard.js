const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500 // Slow down so we can see what's happening
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    if (['log', 'info', 'warn', 'error', 'debug'].includes(type)) {
      const text = msg.text();
      if (!text.includes('DevTools') && !text.includes('HMR')) {
        console.log(`[browser] [${type.toUpperCase()}]`, text);
      }
    }
  });

  // Track requests
  let requestCount = { dashboard: 0, activeStore: 0, orders: 0 };
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/merchant/dashboard') && !url.includes('dashboard/')) {
      requestCount.dashboard++;
      console.log(`[REQUEST ${requestCount.dashboard}] GET /merchant/dashboard`);
    }
    if (url.includes('/merchant/orders')) {
      requestCount.orders++;
      console.log(`[REQUEST ${requestCount.orders}] GET /merchant/orders`);
    }
    if (url.includes('active-store')) {
      requestCount.activeStore++;
      console.log(`[REQUEST ${requestCount.activeStore}] PATCH /api/v1/merchant/auth/active-store`);
    }
  });

  try {
    console.log('\n=== Step 1: Navigate to login page ===');
    await page.goto('http://localhost:3001/en/login');
    await page.waitForLoadState('networkidle');

    console.log('\n=== Step 2: Fill in login credentials ===');
    await page.fill('input[name="email"]', 'merchant@test.com');
    await page.fill('input[name="password"]', 'password');
    
    console.log('\n=== Step 3: Submit login form ===');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    console.log(`Current URL after login: ${page.url()}`);

    console.log('\n=== Step 4: Navigate to DASHBOARD page (where the bug should occur) ===');
    await page.goto('http://localhost:3001/en/merchant/dashboard');
    await page.waitForLoadState('networkidle');
    
    console.log(`Current URL: ${page.url()}`);
    console.log('Waiting 3 seconds on dashboard page...');
    await page.waitForTimeout(3000);

    console.log('\n=== Step 5: Navigate to Google ===');
    requestCount = { dashboard: 0, activeStore: 0, orders: 0 }; // Reset counters
    await page.goto('https://www.google.com/');
    await page.waitForLoadState('networkidle');
    
    console.log(`Current URL: ${page.url()}`);
    console.log('Waiting 2 seconds on Google...');
    await page.waitForTimeout(2000);

    console.log('\n=== Step 6: Click browser back button ===');
    console.log('⚠️  THIS IS WHERE THE BUG SHOULD APPEAR - Monitoring for infinite loops...\n');
    
    const startTime = Date.now();
    await page.goBack();
    
    console.log('After clicking back, waiting 8 seconds to observe behavior...');
    await page.waitForTimeout(8000);
    
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log('\n=== RESULTS AFTER 8 SECONDS ===');
    console.log(`Current URL: ${page.url()}`);
    console.log(`Dashboard requests: ${requestCount.dashboard}`);
    console.log(`Orders requests: ${requestCount.orders}`);
    console.log(`Active-store PATCH requests: ${requestCount.activeStore}`);
    console.log(`Time elapsed: ${elapsedSeconds}s`);
    
    if (requestCount.dashboard > 5 || requestCount.activeStore > 3) {
      console.log('\n🔴 PROBLEM DETECTED: Excessive requests detected - INFINITE LOOP!');
      console.log(`   Dashboard was requested ${requestCount.dashboard} times`);
      console.log(`   Active-store was called ${requestCount.activeStore} times`);
    } else if (requestCount.dashboard === 0 && requestCount.activeStore === 0) {
      console.log('\n✅ Looks good: Returned to dashboard without triggering loops');
    } else if (requestCount.dashboard <= 2 && requestCount.activeStore <= 1) {
      console.log('\n⚠️  MINOR ACTIVITY: Some requests but not looping');
    } else {
      console.log('\n⚠️  SUSPICIOUS: Multiple requests detected');
    }

    console.log('\nWaiting 10 more seconds for additional observation...');
    const beforeCount = { ...requestCount };
    await page.waitForTimeout(10000);
    
    console.log('\n=== FINAL CHECK (after 10 more seconds) ===');
    console.log(`Dashboard requests: ${requestCount.dashboard} (was ${beforeCount.dashboard}, +${requestCount.dashboard - beforeCount.dashboard})`);
    console.log(`Orders requests: ${requestCount.orders} (was ${beforeCount.orders})`);
    console.log(`Active-store requests: ${requestCount.activeStore} (was ${beforeCount.activeStore}, +${requestCount.activeStore - beforeCount.activeStore})`);
    
    const dashboardIncrease = requestCount.dashboard - beforeCount.dashboard;
    const activeStoreIncrease = requestCount.activeStore - beforeCount.activeStore;
    
    if (dashboardIncrease > 3 || activeStoreIncrease > 2) {
      console.log('\n🔴 CONFIRMED INFINITE LOOP: Requests continuing after initial navigation');
      console.log(`   The page is STUCK in a request loop!`);
    } else if (dashboardIncrease > 0 || activeStoreIncrease > 0) {
      console.log('\n⚠️  CONTINUED ACTIVITY: Some additional requests occurred');
    } else {
      console.log('\n✅ NO LOOP DETECTED: Request count stabilized');
    }

  } catch (error) {
    console.error('\n❌ Error during test:', error);
  }

  console.log('\nTest complete. Browser will close in 5 seconds...');
  await page.waitForTimeout(5000);
  await browser.close();
})();
