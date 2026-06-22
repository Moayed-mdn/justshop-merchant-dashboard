# Transient Error State Overrides Successful API Responses

## Symptoms

Two distinct but related symptoms observed during initial page load / hydration:

### 1. Orders Page: Permanent "Failed to load orders" despite successful API

- URL: `/en/merchant/orders`
- API returns `200 OK` with 53 orders
- UI renders: `"Failed to load orders. Please refresh the page."`
- No console errors
- Page remains broken until manual refresh

### 2. Dashboard Page: Conflicting dual state

- URL: `/en/merchant/dashboard`
- API stats/recent-orders/top-products all return `200 OK`
- UI simultaneously shows:
  - Content: "Getting started" checklist, sidebar stats
  - Error: `"Failed to load dashboard data. Please refresh."`
- Page remains in this conflicted state until manual refresh

---

## Root Cause

Both bugs share the same root cause: **React Query error state is checked before loading state**, and transient errors during initial hydration/route change permanently lock the UI into the error branch.

### Orders: `src/features/dashboard/orders/OrdersContent.tsx:97`

```tsx
if (error) {
  return (
    <div className="rounded-md border p-8 text-center">
      <p className="text-destructive">Failed to load orders. Please refresh the page.</p>
    </div>
  );
}
```

The error check runs **before** the loading check (line 116). When the page first hydrates:

1. `useOrders(storeId, filters)` fires its first query
2. The initial attempt may fail transiently (proxy race, store ID briefly stale during hydration, auth header not yet set)
3. React Query sets `error` on this first failure
4. React Query auto-retries and the second attempt succeeds (`data` is populated, `isLoading` becomes false)
5. But `error` is still truthy from the first failed attempt
6. The component returns the error branch (line 97) and never reaches the loading/data branches

React Query **retains the last error** even after subsequent retries succeed. The `error` field only clears when the query is manually refetched with `refetch()` or a new query key is used.

### Dashboard: `src/features/merchant/dashboard/WorkspaceDashboardContent.tsx:43`

```tsx
if (!stats || !orders || !products) {
  return (
    <div className="rounded-md bg-destructive/10 p-4">
      <p className="text-sm text-destructive">{t('error')}</p>
    </div>
  );
}
```

Three separate React Query hooks (`useDashboardStats`, `useRecentOrders`, `useTopProducts`). The error condition uses `!data` instead of checking `error`:

1. During hydration, all three hooks are in `{ data: undefined, isLoading: true }`
2. When loading finishes, each hook sets its `data`
3. If **any one** hook's `select` mapper throws (mismatched API shape, unexpected null), React Query sets `data: undefined` for that hook silently — no `error` surface is checked by the component
4. The `!stats || !orders || !products` check fires even though 2 of 3 queries succeeded
5. The error state renders alongside `PostOnboardingChecklist` (which is always visible), creating the "conflicting dual state" appearance

The component destructures each hook as:
```tsx
const { data: stats, isLoading: statsLoading } = useDashboardStats(storeId);
```
— the `error` field is not destructured or checked anywhere.

---

## Affected Files

| File | Line | Issue |
|------|------|-------|
| `src/features/dashboard/orders/OrdersContent.tsx` | 97 | `if (error)` before `if (isLoading)`, no `!isLoading` guard |
| `src/features/merchant/dashboard/WorkspaceDashboardContent.tsx` | 33-49 | Uses `!data` instead of explicit `error` check; no error destructuring |

---

## Fix Required

### Fix 1: Orders — Guard error check with `!isLoading`

```diff
- if (error) {
+ if (error && !isLoading) {
```

This ensures transient errors during the initial fetch don't permanently lock the error state. If the first attempt fails but retries succeed, the component shows the data instead.

### Fix 2: Dashboard — Check `error` and `isLoading` per-hook

Destructure `error` from each hook and check them individually:

```diff
- const { data: stats, isLoading: statsLoading } = useDashboardStats(storeId);
- const { data: orders, isLoading: ordersLoading } = useRecentOrders(storeId);
- const { data: products, isLoading: productsLoading } = useTopProducts(storeId);
+ const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats(storeId);
+ const { data: orders, isLoading: ordersLoading, error: ordersError } = useRecentOrders(storeId);
+ const { data: products, isLoading: productsLoading, error: productsError } = useTopProducts(storeId);
```

Then handle each error individually, showing a per-section fallback rather than a full-page error:

```diff
- if (!stats || !orders || !products) {
-   return ( ... full page error ... );
- }
+ const errors = [statsError, ordersError, productsError].filter(Boolean);
+ if (errors.length > 0 && !isLoading) {
+   return ( ... full page error ... );
+ }
```

Or more granularly, show per-card error states for individual failed queries.

---

## Why This Happens Now

This pattern works in production because:
1. The Next.js proxy (`/api/proxy`) is already warmed up after login, so the first API call usually succeeds
2. During Playwright testing / fresh navigation, the proxy cold-start may cause a brief race where the first request arrives before the proxy is fully initialized (HTTP 502 or timeout)
3. In local dev with hot reload, the React Query cache is cleared on each HMR, making every navigation a "first load" with no cached data

The fix is defensive: error states should never permanently override successful retries.
