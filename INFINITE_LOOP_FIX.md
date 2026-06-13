# Infinite Loop Fix - Store Switching

## Problem Description

An infinite loop was occurring after a user navigated from `/stores/1/dashboard` to `/merchant/dashboard`. The application would continuously:

1. Load `/en/merchant/dashboard`
2. Fetch CSRF cookie
3. Send PATCH request to `/api/v1/merchant/auth/active-store`  
4. Repeat from step 1

This cycle repeated every ~500-800ms, causing excessive server load and preventing the dashboard from being usable.

## Root Cause

The `WorkspaceStoreSwitcher` component was using Base UI's Select component with a controlled value that started as `undefined` and later became a store ID after bootstrap resolved.

```typescript
// The value transitions: undefined → "1" (store ID)
const selectValue = activeStore ? String(activeStore.id) : undefined;
```

When Base UI's Select component detected this value change from `undefined` to a defined value, it **automatically triggered the `onValueChange` callback** - even though this wasn't a user-initiated action.

This caused:
1. `handleValueChange` to be called with the new store ID
2. `switchStoreMutation.mutate(value)` to be invoked
3. The store switch API call to execute
4. Bootstrap to refresh
5. The Select value to update again
6. Back to step 1 - **infinite loop**

## The Fix

Added initialization tracking to prevent `onValueChange` from triggering store switches until after the component has fully initialized with a real value:

```typescript
// Track when Select first renders with a real value
const hasInitializedRef = useRef(false);

useEffect(() => {
  // Once we have a selectValue, mark as initialized
  if (selectValue !== undefined && !hasInitializedRef.current) {
    hasInitializedRef.current = true;
  }
}, [selectValue]);

const handleValueChange = (value: string | null) => {
  if (!value) return;

  if (value === '__create_store__') {
    router.push(ROUTES.merchant.stores.create());
    return;
  }

  // Prevent triggering switch on first render when selectValue becomes defined.
  // Only process user-initiated changes after the component has initialized.
  if (!hasInitializedRef.current) {
    return;
  }

  // Only switch if the selected store differs from the currently active one.
  if (value !== selectValue && !isDisabled) {
    switchStoreMutation.mutate(value);
  }
};
```

## How It Works

1. **First Render**: `selectValue` is `undefined`, `hasInitializedRef.current` is `false`
2. **Bootstrap Resolves**: `selectValue` becomes `"1"`, triggering BaseUI's `onValueChange`
3. **Guard Check**: `handleValueChange` checks `hasInitializedRef.current` (still `false`) and returns early
4. **useEffect Runs**: Sets `hasInitializedRef.current = true`
5. **Future Changes**: All subsequent `onValueChange` calls are now processed normally (user clicks)

## Files Modified

- `/src/features/merchant/components/WorkspaceStoreSwitcher.tsx`
  - Added `useRef` and `useEffect` imports
  - Added `hasInitializedRef` to track initialization state
  - Added guard in `handleValueChange` to prevent premature execution

## Testing

To verify the fix:
1. Navigate to `/stores/{id}/dashboard` (legacy route)
2. Observe redirect to `/merchant/dashboard`
3. Confirm only ONE store switch API call occurs
4. Verify dashboard loads and stops refreshing
5. Test manual store switching still works correctly

## Related Issues

This fix resolves the infinite loop but preserves the intended behavior:
- Store switcher initializes with the correct active store
- Manual store switching by users continues to work
- Cross-tab synchronization still functions
- Bootstrap refresh on tab focus/online events unaffected
