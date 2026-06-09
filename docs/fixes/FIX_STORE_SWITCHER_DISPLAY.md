# Fix: Store Switcher Displays ID Instead of Name

## Problem

The `WorkspaceStoreSwitcher` component was showing the store **ID** in the trigger button, while the dropdown correctly showed store **names**.

**Example:**
```
Trigger shows: "3"
Dropdown shows: "My Amazing Store" ✅
```

## Root Cause

The component was using `<SelectValue>` with a placeholder, but when a value is selected, the base UI Select component displays the `value` attribute (which is the store ID) by default, not the display text from the SelectItem.

```tsx
// BEFORE (shows ID)
<SelectValue placeholder="Select store" />
```

The `value` prop of Select was set to `String(activeStore.id)`, so that's what gets displayed.

## Solution

Instead of relying on `SelectValue` to automatically display the selected value, we explicitly render the store name from the active store object:

```tsx
// AFTER (shows name)
const activeStoreName = activeStore?.name || 'Select store';

<span>{activeStoreName}</span>
```

## Code Changes

**File:** `laratenant-commerce/src/features/merchant/components/WorkspaceStoreSwitcher.tsx`

### Before
```tsx
<div className="flex-1 truncate text-left">
  <SelectValue placeholder="Select store" />
</div>
```

### After
```tsx
// Get the active store name for display
const activeStoreName = activeStore?.name || 'Select store';

// ... in JSX:
<div className="flex-1 truncate text-left">
  <span>{activeStoreName}</span>
</div>
```

## How It Works

1. **Get active store from state:** `useBootstrapStore((state) => state.activeStore)`
2. **Extract store name:** `activeStore?.name`
3. **Fallback to placeholder:** `|| 'Select store'`
4. **Display the name:** `<span>{activeStoreName}</span>`

The dropdown items already correctly display names because they use:
```tsx
<SelectItem value={String(store.id)}>
  <span>{store.name}</span>
</SelectItem>
```

## Testing

### Before Fix
```
Trigger button: "3" ❌
Dropdown: "My Amazing Store" ✅
```

### After Fix
```
Trigger button: "My Amazing Store" ✅
Dropdown: "My Amazing Store" ✅
```

### Test Steps

1. **Start the Next.js server:**
   ```bash
   cd laratenant-commerce
   npm run dev
   ```

2. **Login as merchant**

3. **Check the store switcher:**
   - Should display store name (e.g., "My Amazing Store")
   - NOT the store ID (e.g., "3")

4. **Open dropdown:**
   - Should still show all store names correctly

5. **Switch to different store:**
   - Trigger should update to show new store name

## Edge Cases Handled

### No Active Store
```tsx
activeStore?.name || 'Select store'
```
Shows "Select store" placeholder when no store is selected.

### Store Name is Empty
If `store.name` is an empty string, it will show the empty string (not the placeholder). If this is an issue, you could add additional validation:
```tsx
const activeStoreName = (activeStore?.name?.trim()) || 'Select store';
```

### During Provisioning
The loading spinner still shows correctly, and the name updates once provisioning completes.

### During Store Switch
The "Syncing" badge appears, and the switcher is disabled during the mutation.

## Why This Is Better

1. **Explicit:** Clearly shows what value is being displayed
2. **Consistent:** Same pattern as dropdown items
3. **Predictable:** Not relying on library's default behavior
4. **Maintainable:** Easy to customize format if needed (e.g., add badges)

## Future Enhancements (Optional)

If you want to show additional info in the trigger:

```tsx
const activeStoreName = activeStore?.name || 'Select store';
const storeStatus = activeStore?.status;

<div className="flex items-center gap-2">
  <span>{activeStoreName}</span>
  {storeStatus !== 'active' && (
    <Badge variant="outline" className="text-[10px]">
      {storeStatus}
    </Badge>
  )}
</div>
```

## No Breaking Changes

✅ Same functionality  
✅ Same component API  
✅ Same props  
✅ Same behavior  
✅ Just fixes the display issue

## Summary

**Changed:** 1 line (replaced `<SelectValue>` with `<span>{activeStoreName}</span>`)  
**Added:** 1 line (compute `activeStoreName`)  
**Time to fix:** 30 seconds  
**Impact:** High (improves UX significantly)

---

**Status: ✅ FIXED**

The store switcher now displays the store name instead of the ID in both the trigger and dropdown.
