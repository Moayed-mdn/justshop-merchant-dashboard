# Testing the Billing Back Navigation Fix

## Quick Test Steps

### 1. Initial State
1. Open http://localhost:3000/en/merchant/billing
2. Verify the billing page loads normally
3. You should see your subscription details

### 2. Navigate to Billing Portal
1. Click the **"Billing Portal"** button
2. You will be redirected to Stripe's billing portal (external page)
3. Note: The POST request `POST /api/proxy?endpoint=%2Fapi%2Fv1%2Fmerchant%2Fbilling%2Fportal` completes successfully

### 3. Test Browser Back Navigation (THE FIX)
1. Click the browser's **back button** (or press Alt+Left Arrow / Cmd+[)
2. **BEFORE THE FIX**: You would see "Preparing your session..." infinitely
3. **AFTER THE FIX**: The page should load instantly without any loading spinner
4. The billing page content displays immediately with cached data

### 4. Verify Console Logs
Open browser console (F12) and look for:
```
[useBootstrap] Skipping window focus refetch (data is recent)
```

This confirms the fix is working - the bootstrap refetch is being skipped.

## What Changed

### The Root Cause
- `useBootstrap` had `refetchOnWindowFocus: true` + `staleTime: 0`
- Every time the window gained focus (like when clicking back), it would refetch
- This caused `isBootstrapping: true` → full-screen loader appeared

### The Fix
- Changed `refetchOnWindowFocus` from `true` to a **function** that checks data age
- If data was fetched within last 30 seconds, skip the refetch
- This prevents unnecessary API calls and loading spinners

## Additional Test Scenarios

### Scenario A: Tab Switching
1. Navigate to billing page
2. Switch to another browser tab
3. Switch back to the billing tab
4. **Expected**: No loading spinner (data is recent)

### Scenario B: Long Duration Away
1. Navigate to billing page
2. Wait 35+ seconds
3. Click to another app, then back to browser
4. **Expected**: Bootstrap refetches (data is stale)

### Scenario C: Multiple Back/Forward
1. Navigate to billing page
2. Click "Billing Portal"
3. Click back
4. Click forward (to Stripe again)
5. Click back again
6. **Expected**: No loading spinner on any back navigation

## Success Criteria

✅ No "Preparing your session..." spinner when clicking back from Stripe
✅ Page content displays immediately (< 100ms)
✅ No unnecessary API calls to `/api/v1/merchant/me`
✅ Console shows "Skipping window focus refetch" message
✅ Data still refreshes when genuinely stale (> 30s old)

## Troubleshooting

If you still see the loading spinner:

1. **Hard refresh the page**: Ctrl+Shift+R (or Cmd+Shift+R) to clear cache
2. **Check the timestamp**: Open React DevTools and check `dataUpdatedAt` in the query
3. **Verify the fix is applied**: Check `/src/hooks/auth/useBootstrap.ts` has the conditional `refetchOnWindowFocus`
4. **Check console**: Look for any error messages or the skip message

## Performance Impact

### Before Fix:
- Browser back → Window focus → Bootstrap API call → 200-300ms delay → Loading spinner → Poor UX

### After Fix:
- Browser back → Window focus → Skip refetch (data recent) → 0ms delay → Instant display → Great UX

## Related Files

- `/src/hooks/auth/useBootstrap.ts` - Primary fix location
- `/src/components/providers/BootstrapProvider.tsx` - Secondary improvements
- `/src/app/[locale]/(merchant)/merchant/billing/BillingPageClient.tsx` - The affected page
