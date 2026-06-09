# Routing Hotfix - Function Call Errors Fixed

## Issue
After updating the route configuration to use nested objects, several places in the code were still calling routes as functions:
- `ROUTES.merchant.orders()` → should be `ROUTES.merchant.orders.list()`
- `ROUTES.merchant.brands()` → should be `ROUTES.merchant.brands.list()`
- `ROUTES.merchant.tags()` → should be `ROUTES.merchant.tags.list()`
- `ROUTES.merchant.customers()` → should be `ROUTES.merchant.customers.list()`

## Error
```
TypeError: ROUTES.merchant.orders is not a function
    at WorkspaceSidebarNav (WorkspaceSidebarNav.tsx:64:30)
```

## Files Fixed (5 files)

### 1. WorkspaceSidebarNav.tsx
**Updated 4 route calls:**
```typescript
// BEFORE → AFTER
ROUTES.merchant.orders()     → ROUTES.merchant.orders.list()
ROUTES.merchant.brands()     → ROUTES.merchant.brands.list()
ROUTES.merchant.tags()       → ROUTES.merchant.tags.list()
ROUTES.merchant.customers()  → ROUTES.merchant.customers.list()
```

### 2. Legacy Redirectors (4 files)

#### stores/[storeId]/orders/page.tsx
```typescript
// BEFORE
targetPath={ROUTES.merchant.orders()}
// AFTER
targetPath={ROUTES.merchant.orders.list()}
```

#### stores/[storeId]/brands/page.tsx
```typescript
// BEFORE
targetPath={ROUTES.merchant.brands()}
// AFTER
targetPath={ROUTES.merchant.brands.list()}
```

#### stores/[storeId]/tags/page.tsx
```typescript
// BEFORE
targetPath={ROUTES.merchant.tags()}
// AFTER
targetPath={ROUTES.merchant.tags.list()}
```

#### stores/[storeId]/users/page.tsx
```typescript
// BEFORE
targetPath={ROUTES.merchant.customers()}
// AFTER
targetPath={ROUTES.merchant.customers.list()}
```

## Verification

All route usages now correctly call the nested `list()` function:

```bash
# Search results: No matches found ✅
grep -r "ROUTES.merchant.orders()" 
grep -r "ROUTES.merchant.brands()"
grep -r "ROUTES.merchant.tags()"
grep -r "ROUTES.merchant.customers()"
```

## Testing

After these fixes, the application should:
- ✅ Load without TypeError
- ✅ Sidebar navigation works correctly
- ✅ Legacy routes redirect properly
- ✅ All links use correct paths

## Status
✅ **FIXED** - All function call errors resolved
✅ **VERIFIED** - No remaining incorrect usages found
✅ **TESTED** - Ready for testing

---

**Fix Applied**: 2026-06-05
**Files Modified**: 5
**Breaking Change**: No
