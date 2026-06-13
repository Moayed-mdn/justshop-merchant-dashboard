const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track requests with timestamps
  let requests = [];
  page.on('request', request => {
    const url = request.url();
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    
    if (url.includes('/merchant/dashboard') && !url.includes('dashboard/')) {
      const entry = `[${timestamp}] GET /merchant/dashboard`;
      requests.push(entry);
      console.log(entry);
    }
    if (url.includes('active-store')) {
      const entry = `[${timestamp}] PATCH /api/v1/merchant/auth/active-store`;
      requests.push(entry);
      console.log(entry);
    }
    if (url.includes('/stores/') && url.includes('/dashboard')) {
      const entry = `[${timestamp}] GET /stores/.../dashboard`;
      requests.push(entry);
      console.log(entry);
    }
  });

  try {
    console.log('\n=== TESTING: Original Issue Scenario ===');
    console.log('Route: /stores/1/dashboard → /merchant/dashboard → Google → Back\n');
    
    console.log('=== Step 1: Login ===');
    await page.goto('http://localhost:3001/en/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'merchant@test.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    console.log(`Logged in, current URL: ${page.url()}\n`);

    console.log('=== Step 2: Navigate to LEGACY route /stores/1/dashboard ===');
    requests = []; // Clear previous requests
    await page.goto('http://localhost:3001/en/stores/1/dashboard');
    await page.waitForLoadState('networkidle');
    
    console.log(`Current URL: ${page.url()}`);
    console.log('Waiting 3 seconds...\n');
    await page.waitForTimeout(3000);

    console.log('=== Step 3: Navigate to Google ===');
    requests = []; // Reset for back navigation test
    await page.goto('https://www.google.com/');
    await page.waitForLoadState('domcontentloaded');
    console.log('On Google, waiting 2 seconds...\n');
    await page.waitForTimeout(2000);

    console.log('=== Step 4: CLICK BACK BUTTON ===');
    console.log('⚠️  Monitoring for infinite loop pattern:\n');
    
    const startTime = Date.now();
    const startRequestCount = requests.length;
    
    await page.goBack();
    
    console.log('Monitoring for 10 seconds...\n');
    await page.waitForTimeout(10000);
    
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    const totalRequests = requests.length;
    const dashboardRequests = requests.filter(r => r.includes('GET /merchant/dashboard')).length;
    const activeStoreRequests = requests.filter(r => r.includes('PATCH')).length;
    
    console.log('\n=== ANALYSIS ===');
    console.log(`Current URL: ${page.url()}`);
    console.log(`Time elapsed: ${elapsedTime}s`);
    console.log(`Total requests captured: ${totalRequests}`);
    console.log(`  - GET /merchant/dashboard: ${dashboardRequests}`);
    console.log(`  - PATCH active-store: ${activeStoreRequests}`);
    
    if (dashboardRequests > 5 && activeStoreRequests > 3) {
      console.log('\n🔴 INFINITE LOOP DETECTED!');
      console.log(`   Pattern: Dashboard requested ${dashboardRequests} times in ${elapsedTime}s`);
      console.log(`   This matches the original bug behavior.`);
      console.log('\n   Request timeline:');
      requests.slice(0, 15).forEach(r => console.log(`   ${r}`));
      if (requests.length > 15) {
        console.log(`   ... and ${requests.length - 15} more requests`);
      }
    } else if (dashboardRequests <= 2 && activeStoreRequests <= 1) {
      console.log('\n✅ NO LOOP - Behavior is NORMAL');
      console.log('   The fix is working correctly!');
    } else {
      console.log('\n⚠️  MODERATE ACTIVITY');
      console.log('   Some repeated requests but not an obvious infinite loop.');
      console.log('\n   Request timeline:');
      requests.forEach(r => console.log(`   ${r}`));
    }
    
    console.log('\nContinuing to monitor for 10 more seconds...');
    const midpointCount = requests.length;
    await page.waitForTimeout(10000);
    
    const finalRequestCount = requests.length;
    const additionalRequests = finalRequestCount - midpointCount;
    
    console.log(`\n=== FINAL CHECK ===`);
    console.log(`Additional requests in last 10s: ${additionalRequests}`);
    
    if (additionalRequests > 5) {
      console.log('🔴 LOOP CONTINUING - requests are still being made!');
    } else if (additionalRequests > 0) {
      console.log('⚠️  Some activity, but slowing down');
    } else {
      console.log('✅ STABLE - no additional requests, page has settled');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  console.log('\nClosing browser in 5 seconds...');
  await page.waitForTimeout(5000);
  await browser.close();
})();
