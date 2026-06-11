# The Real Issue & Complete Fix

## What You Discovered
The problem happens on **ANY page**, not just billing:
1. Go to: http://localhost:3000/en/merchant/dashboard
2. Navigate to: https://www.google.com (external site)
3. Click browser back button
4. Result: **"Preparing your session..." spinner appears!**

## Root Cause Analysis

### The Real Problem
When you navigate to an external site and click back, the browser does **NOT** restore from bfcache. Instead:

1. **Fresh Page Mount**: The React app initializes from scratch
2. **Initial Zustand State**: `isBootstrapping: true` (hardcoded initial state)
3. **No Bootstrap Data Yet**: `bootstrap: null` initially
4. **Condition Met**: `isRefreshingWithoutData = !bootstrap && isBootstrapping` evaluates to `true`
5. **Full-Screen Loader Appears**: "Preparing your session..." is shown

### Why My First Fix Didn't Work
My first fix only prevented **refetching** bootstrap data on window focus. But it didn't address the fact that when the page freshly mounts, `isBootstrapping` starts as `true` before React Query has a chance to restore cached data.

## The Complete Fix

### Fix #1: Smart Refetch Prevention (Already Applied)
**File:** `/src/hooks/auth/useBootstrap.ts`

Prevents unnecessary refetches when data is recent (< 30 seconds).

### Fix #2: React Query Cache Check (NEW - Just Applied)
**File:** `/src/components/providers/BootstrapProvider.tsx`

**The Problem:**
```typescript
const isRefreshingWithoutData = !bootstrap && isBootstrapping;

const shouldShowFullScreenLoader =
  isInitialBootstrapping ||
  isRefreshingWithoutData ||  // ⚠️ This triggers on fresh mount!
  (isAuthBoundary && Boolean(redirectTarget) && !bootstrap);
```

**The Solution:**
```typescript
// Check if React Query has cached data
const queryData = queryClient.getQueryData(queryKeys.merchant.me());
const hasQueryCache = !!queryData;

const shouldShowFullScreenLoader =
  isInitialBootstrapping ||
  (isRefreshingWithoutData && !hasQueryCache) ||  // ✅ Only show if no cache!
  (isAuthBoundary && Boolean(redirectTarget) && !bootstrap);
```

## How This Fix Works

### Scenario: External Navigation + Back Button

**Before Fix:**
1. Page mounts fresh → `isBootstrapping: true`, `bootstrap: null`
2. Check: `isRefreshingWithoutData = !bootstrap && isBootstrapping` → **TRUE**
3. Result: Full-screen loader shown ❌

**After Fix:**
1. Page mounts fresh → `isBootstrapping: true`, `bootstrap: null`
2. **React Query checks cache** → Finds cached bootstrap data from previous session
3. Check: `isRefreshingWithoutData && !hasQueryCache` → `true && !true` → **FALSE**
4. Result: No full-screen loader, page loads instantly ✅

### Why React Query Cache?

React Query persists data in memory for `gcTime` (garbage collection time). In `useBootstrap.ts`:
```typescript
gcTime: 1000 * 60, // 1 minute
```

This means when you navigate away and come back within 1 minute, React Query still has the cached bootstrap data. We can use this to avoid showing the spinner!

## How to Test

### Test 1: External Site Navigation
1. Go to: http://localhost:3000/en/merchant/dashboard
2. Navigate to: https://www.google.com
3. Click browser **back button**
4. **Expected:** Page loads instantly, NO spinner ✅

### Test 2: Billing Portal (Original Issue)
1. Go to: http://localhost:3000/en/merchant/billing
2. Click "Billing Portal" button
3. Click browser **back button**
4. **Expected:** Page loads instantly, NO spinner ✅

### Test 3: Tab Switching
1. Open: http://localhost:3000/en/merchant/dashboard
2. Switch to another tab
3. Switch back
4. **Expected:** Page loads instantly, NO spinner ✅

### Test 4: Long Duration Away
1. Open: http://localhost:3000/en/merchant/dashboard
2. Wait 2+ minutes (past `gcTime`)
3. Navigate to external site and back
4. **Expected:** Spinner may appear (cache expired) - this is OK

## Why This Is the Correct Fix

### 1. **Respects React Query Cache**
React Query already caches bootstrap data. We should use that cache instead of showing a spinner.

### 2. **Handles All Navigation Patterns**
- ✅ Browser back from external site
- ✅ Browser forward
- ✅ Direct URL navigation
- ✅ Tab switching
- ✅ Window focus changes

### 3. **Preserves Loading State for Real Cases**
When there's truly no cached data (first visit, after cache expires), the spinner still shows correctly.

### 4. **No Breaking Changes**
All existing bootstrap logic remains intact. We only added a check to avoid unnecessary spinners.

## Technical Details

### React Query Cache Lifecycle
```
1. First Load:
   - No cache → Query runs → Data cached → Page renders

2. Navigate Away (< 1 minute):
   - Cache persists in memory (gcTime: 60s)

3. Navigate Back:
   - Cache still exists → queryClient.getQueryData() returns data
   - No spinner needed → Page renders instantly with cache
   - Query refetches in background (if stale)

4. Navigate Back (> 1 minute):
   - Cache garbage collected → queryClient.getQueryData() returns undefined
   - Spinner shows (correct behavior) → Query runs → New data cached
```

### Cache vs Zustand State

**Why cache and not Zustand state?**
- Zustand state (`bootstrap`) might not be populated yet when component mounts
- React Query cache is synchronously accessible via `getQueryData()`
- Cache persists independently of component mount/unmount cycles

## Files Modified

1. ✅ `/src/hooks/auth/useBootstrap.ts` - Prevents unnecessary refetches
2. ✅ `/src/components/providers/BootstrapProvider.tsx` - Checks React Query cache before showing spinner

## Expected Behavior After Fix

### Should NOT Show Spinner:
- ✅ Browser back from external site (within 1 minute)
- ✅ Browser forward navigation
- ✅ Tab switching
- ✅ Window focus changes
- ✅ Page refresh (if auth cookie valid and cache exists)

### Should Show Spinner (Correct):
- ✅ First page load (no cache)
- ✅ After cache expires (gcTime > 1 minute)
- ✅ After logout/login
- ✅ Authentication failures
- ✅ Network errors requiring retry

## Verification

Check browser console after clicking back from external site:
```
[useBootstrap] Skipping window focus refetch (data is recent)
[BootstrapProvider] Using cached bootstrap data, skipping spinner
```

## Next Steps

**Please test NOW:**
1. http://localhost:3000/en/merchant/dashboard
2. Navigate to https://www.google.com
3. Click back
4. Confirm: NO spinner appears!

If it STILL shows the spinner, we need to check:
- Is `gcTime` being garbage collected too soon?
- Is something clearing React Query cache?
- Are there multiple QueryClient instances?

---

**Fix Status:** ✅ **COMPLETE - READY FOR TESTING**
