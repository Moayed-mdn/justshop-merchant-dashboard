# Billing Portal Back Navigation Fix

## Problem

When navigating back from the Stripe Billing Portal using the browser's back button, the billing page would show an infinite "Preparing your session..." loading spinner instead of displaying the page content immediately.

### Root Cause Analysis

The issue was caused by **aggressive bootstrap refetching** in the `useBootstrap` hook:

1. **Window Focus Refetch**: The `useBootstrap` hook had `refetchOnWindowFocus: true` AND `staleTime: 0`
2. **Browser Back Navigation**: When clicking browser back from Stripe, the window regains focus
3. **Immediate Refetch**: This triggers an immediate bootstrap refetch (data is always considered stale)
4. **Bootstrap Store State Change**: During refetch, `isBootstrapping: true` is set in the Zustand store
5. **Full-Screen Loader**: The `BootstrapProvider` detects `isBootstrapping: true` and shows "Preparing your session..."
6. **User Experience**: User sees unnecessary loading spinner instead of cached page content

The key insight: **The bootstrap query was refetching on every window focus event, causing the loader to appear even when cached data was perfectly valid**.

## Solution

### Primary Fix: Smart Window Focus Refetching

Modified `/src/hooks/auth/useBootstrap.ts` to use **conditional refetch on window focus**:

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

**How it works:**
- Checks when the bootstrap data was last fetched
- If fetched within the last 30 seconds, **skip the refetch**
- If data is older than 30 seconds, allow the refetch (for genuine stale data)
- This prevents unnecessary API calls when returning from external pages

### Secondary Fix: Improved BootstrapProvider Loader Logic

Modified `/src/components/providers/BootstrapProvider.tsx` to prevent showing full-screen loader when cached data exists:

```typescript
const shouldShowFullScreenLoader =
  isInitialBootstrapping ||
  isRefreshingWithoutData ||
  (isAuthBoundary && Boolean(redirectTarget) && !bootstrap); // Added !bootstrap check
```

**Additional enhancements:**
- Added `pageshow` event listener to detect bfcache restoration
- Improved visibility change handler to skip refreshes when bootstrap data is recent
- Added time-based staleness checks (5s for visibility, 30s for bfcache)

## Why This Fixes the Issue

### Before the Fix:
1. User clicks "Billing Portal" → navigates to Stripe
2. User clicks browser back → window regains focus
3. `useBootstrap` immediately refetches (because `refetchOnWindowFocus: true` and `staleTime: 0`)
4. During refetch, `isBootstrapping: true` → full-screen loader appears
5. User stuck looking at "Preparing your session..." spinner

### After the Fix:
1. User clicks "Billing Portal" → navigates to Stripe
2. User clicks browser back → window regains focus
3. `useBootstrap` checks if data is recent (< 30s old)
4. Data is recent → **skip refetch**
5. No state change → **no loading spinner**
6. Page displays immediately with cached data

## Benefits

1. ✅ **No More Infinite Loading**: Billing page loads instantly when using browser back
2. ✅ **Better Performance**: Eliminates unnecessary API calls on window focus
3. ✅ **Improved UX**: Seamless navigation experience for all external redirects
4. ✅ **Smart Refresh**: Still refreshes when data is genuinely stale (> 30 seconds)
5. ✅ **Security Maintained**: All auth checks and error handling remain intact

## Testing

To test the fix:

1. Navigate to http://localhost:3000/en/merchant/billing
2. Click "Billing Portal" button
3. Wait for Stripe portal to load (external redirect)
4. Click the browser's back button
5. **Expected Result**: Page loads instantly without "Preparing your session..." spinner
6. The cached billing data displays immediately

## Additional Scenarios Covered

- **Tab Switching**: Switching away and back to the tab won't trigger unnecessary refetch
- **Multiple Back Clicks**: Repeatedly using browser back won't cause loading loops
- **Genuine Stale Data**: Data older than 30 seconds still triggers refresh as expected
- **Offline/Online**: Network state changes still trigger appropriate refreshes
- **Multi-tab Sync**: Cross-tab authentication events still work correctly

## Technical Details

- **Time Window**: 30-second window for "recent" data (configurable)
- **React Query Integration**: Uses query state (`dataUpdatedAt`) for staleness checks
- **No Breaking Changes**: All existing bootstrap functionality preserved
- **Zustand Store**: No changes to store structure or state management
- **Type Safety**: Full TypeScript type safety maintained
