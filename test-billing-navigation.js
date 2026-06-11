const CDP = require('chrome-remote-interface');

async function testBillingNavigation() {
  let client;
  try {
    // Connect to Chrome DevTools Protocol
    client = await CDP();
    const {Page, Runtime, Network, Console} = client;

    // Enable necessary domains
    await Page.enable();
    await Runtime.enable();
    await Network.enable();
    await Console.enable();

    // Listen to console messages
    Console.messageAdded((params) => {
      const msg = params.message;
      console.log(`[Browser Console ${msg.level}]:`, msg.text);
    });

    // Listen to network requests
    const requests = [];
    Network.requestWillBeSent((params) => {
      if (params.request.url.includes('/api/')) {
        requests.push({
          url: params.request.url,
          method: params.request.method,
          timestamp: Date.now()
        });
        console.log(`[Network] ${params.request.method} ${params.request.url}`);
      }
    });

    console.log('\n=== Step 1: Navigating to login page ===');
    await Page.navigate({url: 'http://localhost:3000/en/login'});
    await Page.loadEventFired();
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n=== Step 2: Filling login form ===');
    // Fill email
    await Runtime.evaluate({
      expression: `document.querySelector('input[name="email"]').value = 'merchant@test.com'`
    });
    
    // Fill password
    await Runtime.evaluate({
      expression: `document.querySelector('input[name="password"]').value = 'password'`
    });

    console.log('\n=== Step 3: Submitting login ===');
    // Click submit
    await Runtime.evaluate({
      expression: `document.querySelector('button[type="submit"]').click()`
    });

    // Wait for redirect
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n=== Step 4: Navigating to billing page ===');
    await Page.navigate({url: 'http://localhost:3000/en/merchant/billing'});
    await Page.loadEventFired();
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n=== Step 5: Checking for Billing Portal button ===');
    const hasButton = await Runtime.evaluate({
      expression: `!!document.querySelector('button:has-text("Billing Portal")') || !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Billing Portal'))`
    });

    if (hasButton.result.value) {
      console.log('✓ Billing Portal button found');
      
      console.log('\n=== Step 6: Clicking Billing Portal button ===');
      const beforeClickRequests = requests.length;
      
      await Runtime.evaluate({
        expression: `Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Billing Portal'))?.click()`
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('\n=== Step 7: Simulating browser back navigation ===');
      await Page.navigate({url: 'http://localhost:3000/en/merchant/billing'});
      await Page.loadEventFired();
      
      const timeBeforeCheck = Date.now();
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('\n=== Step 8: Checking for loading spinner ===');
      const hasSpinner = await Runtime.evaluate({
        expression: `document.body.innerText.includes('Preparing your session')`
      });

      const afterBackRequests = requests.filter(r => r.timestamp > timeBeforeCheck);
      
      console.log('\n========================================');
      console.log('TEST RESULTS:');
      console.log('========================================');
      
      if (hasSpinner.result.value) {
        console.log('❌ FAIL: Loading spinner "Preparing your session" is visible!');
      } else {
        console.log('✅ PASS: No loading spinner detected!');
      }

      const bootstrapRefetch = afterBackRequests.find(r => r.url.includes('/merchant/me') || r.url.includes('/bootstrap'));
      if (bootstrapRefetch) {
        console.log('❌ FAIL: Bootstrap API was refetched after back navigation');
        console.log('   URL:', bootstrapRefetch.url);
      } else {
        console.log('✅ PASS: No unnecessary bootstrap refetch');
      }

      console.log('\nTotal API calls after back navigation:', afterBackRequests.length);
      afterBackRequests.forEach(r => {
        console.log(`  - ${r.method} ${r.url}`);
      });
      
    } else {
      console.log('❌ Billing Portal button not found - cannot complete test');
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testBillingNavigation().then(() => {
  console.log('\n=== Test completed ===');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
