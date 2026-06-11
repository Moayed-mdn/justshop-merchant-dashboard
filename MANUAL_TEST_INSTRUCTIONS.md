# Manual Test Instructions for Billing Back Navigation Fix

## What Was Fixed

The infinite "Preparing your session..." spinner when clicking browser back from the Stripe billing portal.

**Root Cause:** The `useBootstrap` hook had `refetchOnWindowFocus: true` + `staleTime: 0`, causing it to refetch bootstrap data every time the window regained focus (like when clicking back), which triggered the loading spinner.

**Solution:** Changed `refetchOnWindowFocus` to a conditional function that only refetches if data is older than 30 seconds.

## Files Modified

1. ✅ `/src/hooks/auth/useBootstrap.ts` - **Primary fix**
2. ✅ `/src/components/providers/BootstrapProvider.tsx` - **Secondary improvements**

## How to Test

### Step 1: Open the Billing Page
1. Navigate to: http://localhost:3000/en/login
2. Login with:
   - Email: `merchant@test.com`
   - Password: `password`
3. After login, go to: http://localhost:3000/en/merchant/billing

### Step 2: Click Billing Portal
1. On the billing page, click the **"Billing Portal"** button
2. You will be redirected to Stripe's external billing portal
3. Wait for the Stripe page to fully load

### Step 3: Click Browser Back Button
1. Click the browser's **back button** (or press Alt+← on Linux, Cmd+[ on Mac)
2. This is where the bug occurred before the fix

### Expected Result (After Fix)
- ✅ The billing page should load **instantly** (< 100ms)
- ✅ **NO** "Preparing your session..." spinner appears
- ✅ Page content displays immediately
- ✅ In the browser console (F12), you should see:
  ```
  [useBootstrap] Skipping window focus refetch (data is recent)
  ```

### What Would Happen Before the Fix
- ❌ "Preparing your session..." spinner would appear
- ❌ Spinner would remain for 1-3 seconds (or infinitely if API failed)
- ❌ Poor user experience

## Additional Test Scenarios

### Test 2: Tab Switching (should also work now)
1. Go to billing page
2. Switch to another browser tab
3. Switch back to the billing page tab
4. **Expected:** No loading spinner (data is recent)

### Test 3: Long Duration Away (should still refresh)
1. Go to billing page
2. Wait for 35+ seconds
3. Switch to another app/tab
4. Come back to the browser
5. **Expected:** Bootstrap refetches (data is stale), this is correct behavior

### Test 4: Multiple Back/Forward
1. Go to billing page
2. Click "Billing Portal"
3. Click back
4. Click forward (to Stripe again)
5. Click back again
6. **Expected:** No spinner on any back navigation

## How to Verify the Fix is Applied

### Check 1: Inspect useBootstrap.ts
Open `/src/hooks/auth/useBootstrap.ts` and verify line 16-27 looks like:

```typescript
refetchOnWindowFocus: (query) => {
  // Don't refetch on window focus if we have recent data (< 30 seconds)
  const dataUpdatedAt = query.state.dataUpdatedAt;
  const timeSinceLastFetch = Date.now() - dataUpdatedAt;
  const shouldRefetch = timeSinceLastFetch > 30000; // 30 seconds
  
  if (!shouldRefetch) {
    console.log('[useBootstrap] Skipping window focus refetch (data is recent)');
  }
  
  return shouldRefetch;
},
```

If you see `refetchOnWindowFocus: true`, the fix is NOT applied.

### Check 2: Console Logs
Open Browser DevTools (F12) → Console tab, then perform the back navigation test.

You should see:
```
[useBootstrap] Skipping window focus refetch (data is recent)
```

If you don't see this message, the fix might not be working.

## Troubleshooting

### Issue: Still seeing the loading spinner

**Solution 1:** Hard refresh the page
- Press `Ctrl+Shift+R` (Linux) or `Cmd+Shift+R` (Mac)
- This clears the cache and loads the latest code

**Solution 2:** Check if dev server reloaded
- Look at the terminal where `npm run dev` is running
- You should see compilation messages after the file changes
- If not, restart the dev server:
  ```bash
  # Kill the current server (Ctrl+C)
  npm run dev
  ```

**Solution 3:** Verify the fix is in place
- Check the file content as described in "How to Verify the Fix is Applied" above

### Issue: Console log not appearing

**Possible causes:**
1. Browser console might be filtering logs - check the filter settings
2. The fix might not be applied - verify the file content
3. Cache issue - do a hard refresh

## Technical Details

### The 30-Second Window
- If bootstrap data was fetched within the last **30 seconds**, skip the refetch
- This window is configurable (change `30000` to a different millisecond value)
- 30 seconds is sufficient for most navigation scenarios

### What Still Triggers Refetch
- Window focus after 30+ seconds (genuinely stale data)
- Page visibility change after 30+ seconds
- Online/offline events
- Multi-tab authentication sync events
- Manual page refresh

### What NO LONGER Triggers Refetch
- Browser back navigation (within 30s)
- Browser forward navigation (within 30s)
- Tab switching (within 30s)
- Window focus from other apps (within 30s)

## Success Criteria Checklist

- [ ] No loading spinner when clicking back from Stripe portal
- [ ] Page displays instantly (< 100ms)
- [ ] Console shows "Skipping window focus refetch" message
- [ ] No unnecessary API calls to `/api/v1/merchant/me`
- [ ] Data still refreshes when genuinely stale (> 30s)
- [ ] All existing functionality still works

## Report Back

After testing, please confirm:
1. Did the billing page load instantly without spinner? (Yes/No)
2. Did you see the console log message? (Yes/No)
3. Did you test multiple back/forward navigations? (Yes/No)
4. Any unexpected behavior? (Describe)

If the issue persists, please provide:
- Browser console logs (full output)
- Network tab activity (during back navigation)
- Any error messages
