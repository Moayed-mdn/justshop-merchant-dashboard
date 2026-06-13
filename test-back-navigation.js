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
      console.log(`[browser] [${type.toUpperCase()}]`, msg.text());
    }
  });

  // Track requests
  let requestCount = { dashboard: 0, activeStore: 0, orders: 0 };
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/merchant/dashboard')) {
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

    console.log('\n=== Step 4: Navigate to orders page ===');
    await page.goto('http://localhost:3001/en/merchant/orders');
    await page.waitForLoadState('networkidle');
    
    console.log(`Current URL: ${page.url()}`);
    console.log('Waiting 2 seconds on orders page...');
    await page.waitForTimeout(2000);

    console.log('\n=== Step 5: Navigate to Google ===');
    requestCount = { dashboard: 0, activeStore: 0, orders: 0 }; // Reset counters
    await page.goto('https://www.google.com/');
    await page.waitForLoadState('networkidle');
    
    console.log(`Current URL: ${page.url()}`);
    console.log('Waiting 2 seconds on Google...');
    await page.waitForTimeout(2000);

    console.log('\n=== Step 6: Click browser back button ===');
    console.log('Request counters reset. Monitoring for loops...\n');
    
    await page.goBack();
    
    console.log('After clicking back, waiting 5 seconds to observe behavior...');
    await page.waitForTimeout(5000);
    
    console.log('\n=== RESULTS ===');
    console.log(`Current URL: ${page.url()}`);
    console.log(`Dashboard requests: ${requestCount.dashboard}`);
    console.log(`Orders requests: ${requestCount.orders}`);
    console.log(`Active-store PATCH requests: ${requestCount.activeStore}`);
    
    if (requestCount.dashboard > 5 || requestCount.activeStore > 3) {
      console.log('\n⚠️  PROBLEM DETECTED: Excessive requests suggest an infinite loop!');
    } else if (requestCount.dashboard === 0 && requestCount.orders > 0) {
      console.log('\n✅ Looks good: Returned to orders page without loops');
    } else if (requestCount.dashboard > 0) {
      console.log('\n⚠️  POTENTIAL ISSUE: Dashboard requests occurred when returning to orders page');
    }

    console.log('\nWaiting 10 more seconds for additional observation...');
    const beforeCount = { ...requestCount };
    await page.waitForTimeout(10000);
    
    console.log('\n=== FINAL CHECK (after 10 more seconds) ===');
    console.log(`Dashboard requests: ${requestCount.dashboard} (was ${beforeCount.dashboard})`);
    console.log(`Orders requests: ${requestCount.orders} (was ${beforeCount.orders})`);
    console.log(`Active-store requests: ${requestCount.activeStore} (was ${beforeCount.activeStore})`);
    
    if (requestCount.dashboard > beforeCount.dashboard || 
        requestCount.activeStore > beforeCount.activeStore) {
      console.log('\n🔴 CONFIRMED INFINITE LOOP: Requests continuing after initial navigation');
    } else {
      console.log('\n✅ NO LOOP DETECTED: Request count stabilized');
    }

  } catch (error) {
    console.error('\n❌ Error during test:', error);
  }

  console.log('\nTest complete. Press Ctrl+C to close browser or wait...');
  await page.waitForTimeout(5000);
  await browser.close();
})();
