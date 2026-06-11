const CDP = require('chrome-remote-interface');

async function test() {
  let client;
  try {
    client = await CDP();
    const {Page, Runtime, Network} = client;

    await Page.enable();
    await Runtime.enable();
    await Network.enable();

    // Track bootstrap API calls
    let bootstrapCalls = [];
    Network.requestWillBeSent((params) => {
      if (params.request.url.includes('/merchant/me')) {
        bootstrapCalls.push({
          time: new Date().toISOString(),
          url: params.request.url
        });
        console.log(`[${new Date().toISOString()}] Bootstrap API called:`, params.request.url);
      }
    });

    console.log('\n=== Navigating to billing page (after login) ===');
    await Page.navigate({url: 'http://localhost:3000/en/merchant/billing'});
    await Page.loadEventFired();
    await new Promise(resolve => setTimeout(resolve, 3000));

    const initialCallCount = bootstrapCalls.length;
    console.log(`Initial bootstrap calls: ${initialCallCount}`);

    console.log('\n=== Getting page content ===');
    const pageContent = await Runtime.evaluate({
      expression: `document.body.innerText.substring(0, 500)`
    });
    console.log('Page content preview:', pageContent.result.value);

    const hasSpinner = await Runtime.evaluate({
      expression: `document.body.innerText.includes('Preparing your session')`
    });
    console.log('Has loading spinner:', hasSpinner.result.value);

    console.log('\n=== Simulating browser back/forward (via navigation) ===');
    // Go to another page
    await Page.navigate({url: 'http://localhost:3000/en/merchant/dashboard'});
    await Page.loadEventFired();
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mark the time before going back
    const beforeBackTime = Date.now();
    const beforeBackCalls = bootstrapCalls.length;

    // Go back to billing
    console.log('\n=== Navigating BACK to billing page ===');
    await Page.navigate({url: 'http://localhost:3000/en/merchant/billing'});
    await Page.loadEventFired();

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    const afterBackTime = Date.now();
    const afterBackCalls = bootstrapCalls.length;

    // Check for spinner
    const hasSpinnerAfterBack = await Runtime.evaluate({
      expression: `document.body.innerText.includes('Preparing your session')`
    });

    // Check console for our skip message
    const checkLog = await Runtime.evaluate({
      expression: `window.__bootstrapSkipLog || 'not found'`
    });

    console.log('\n========================================');
    console.log('TEST RESULTS:');
    console.log('========================================');
    console.log(`Time elapsed: ${afterBackTime - beforeBackTime}ms`);
    console.log(`Bootstrap calls before back: ${beforeBackCalls}`);
    console.log(`Bootstrap calls after back: ${afterBackCalls}`);
    console.log(`New bootstrap calls during back navigation: ${afterBackCalls - beforeBackCalls}`);
    
    if (hasSpinnerAfterBack.result.value) {
      console.log('❌ FAIL: Loading spinner visible after back navigation!');
    } else {
      console.log('✅ PASS: No loading spinner after back navigation');
    }

    if (afterBackCalls - beforeBackCalls === 0) {
      console.log('✅ PASS: No bootstrap refetch on back navigation (fix working!)');
    } else if (afterBackCalls - beforeBackCalls === 1) {
      console.log('⚠️  WARNING: One bootstrap refetch occurred');
      console.log('   This might be expected if data is >30s old');
    } else {
      console.log('❌ FAIL: Multiple bootstrap refetches occurred');
    }

    console.log('\nAll bootstrap calls during session:');
    bootstrapCalls.forEach((call, i) => {
      console.log(`  ${i + 1}. ${call.time}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

test().then(() => {
  console.log('\n=== Test completed ===');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
