# BFCache Navigation Bug - Problem Report for New AI Session

## Critical Issue Description

When a user navigates from a merchant page (e.g., `/en/merchant/orders`) to an external website (e.g., `https://www.google.com/`) and then clicks the browser's **BACK button**, the application becomes stuck in a broken state.

## How to Reproduce the Bug

### Steps:
1. Open browser and navigate to `http://localhost:3001/en/login`
2. Login with credentials:
   - Email: `merchant@test.com`
   - Password: `password`
3. Navigate to `http://localhost:3001/en/merchant/orders` (or any merchant page)
4. **Verify the page is working correctly:**
   - ✅ Sidebar shows navigation items: "Themes", "Stores", "Billing", "Settings", "Orders", etc.
   - ✅ Top bar shows store switcher with store name
   - ✅ Page content loads properly
5. **Navigate to external site:**
   - Type `https://www.google.com/` in the address bar
   - Press Enter
   - Wait for Google to fully load
6. **Click the browser BACK button**
7. **THE BUG APPEARS**

## How to Detect If the Bug Exists

### Primary Indicator (Most Important):
**Check if the sidebar navigation items are visible:**

❌ **BUG EXISTS** if you see:
- Only "Admin Dashboard" text in the sidebar
- Missing navigation buttons: "Themes", "Stores", "Billing", "Settings", "Orders", etc.
- The sidebar is mostly empty

✅ **BUG FIXED** if you see:
- Full sidebar with ALL navigation items visible
- "Themes" button visible
- "Stores" button visible  
- "Billing" button visible
- "Settings" button visible
- "Orders" button visible (and other items)

### Secondary Indicators:
- "No active store" error message appears
- Infinite loading spinner with "Loading your workspace..."
- Store switcher in top bar is empty or missing
- Page appears stuck/frozen

## The Real Test

**Quote from user:**
> "you can use the order navigation button, if you find it, the problem solved, if you don't find it, the problem still occurs."

This means: **If you can see and click the "Orders" navigation button in the sidebar after clicking back, the bug is fixed. If the "Orders" button is missing, the bug still exists.**

## What Has Been Tried (But Failed)

### Attempt 1: Added pageshow Event Listener
- Added handler to detect bfcache restoration
- Calls `bootstrapQuery.refetch()` when page restored
- **Result:** Navigation items still missing on initial restore

### Attempt 2: Added Zustand Persistence
- Added `persist` middleware to save bootstrap state to sessionStorage
- Persists: permissions, activeStore, stores, user
- **Result:** Automated tests show "Sidebar visible: true" but user reports problem still occurs
- **Issue:** The automated test might be checking for wrong thing (checking if sidebar container exists, not if navigation ITEMS are rendered inside it)

### Attempt 3: Fixed WorkspaceStoreSwitcher Initialization
- Added reset logic for initialization flags
- **Result:** Store switcher issue might be improved, but navigation items still missing

### Attempt 4: Fixed Legacy Route Redirectors
- Prevented infinite loops in legacy redirectors
- **Result:** This fixed a different issue, but not the main bfcache problem

## Why Previous Fixes Didn't Work

The navigation items in the sidebar are rendered by `WorkspaceSidebarNav` component, which checks permissions for each item:

```typescript
// From WorkspaceSidebarNav.tsx
const canViewDashboard  = useCan('canViewDashboard');
const canManageOrders   = useCan('canManageOrders');
const canManageProducts = useCan('canManageProducts');
// ... etc

const navItems = [
  { label: 'Orders', show: canManageOrders, ... },
  { label: 'Products', show: canManageProducts, ... },
  // ... etc
];

const visibleItems = navItems.filter((item) => item.show);
```

If `permissions` are not properly restored from sessionStorage, OR if the component doesn't re-render after permissions are restored, the navigation items won't appear.

## Key Files to Investigate

1. **`/src/features/merchant/components/WorkspaceSidebarNav.tsx`**
   - Renders the navigation items
   - Uses `useCan()` hooks to check permissions
   - Filters out items where `show: false`

2. **`/src/stores/bootstrapStore.ts`**
   - Contains `useCan()` implementation
   - Should have persistence configured
   - Permissions array must be restored from sessionStorage

3. **`/src/components/providers/BootstrapProvider.tsx`**
   - Handles bootstrap data fetching
   - Should trigger re-render when bootstrap data changes
   - Has pageshow event listener

4. **`/src/features/merchant/components/WorkspaceStoreSwitcher.tsx`**
   - Store switcher component
   - Should show active store name

## Debugging Steps for New AI

### Step 1: Verify Persistence Is Actually Working
Check if sessionStorage actually contains the data after refresh:
- Open browser DevTools → Application tab → Session Storage
- Look for key `bootstrap-storage`
- Verify it contains `permissions` array with values
- Verify it contains `activeStore` object

### Step 2: Check If Components Re-render
Add console.log in `WorkspaceSidebarNav.tsx`:
```typescript
console.log('WorkspaceSidebarNav render', {
  permissions,
  canManageOrders,
  visibleItemsCount: visibleItems.length
});
```

After clicking back, check if:
- Component re-renders
- `permissions` is populated (not empty array)
- `visibleItemsCount` is > 0

### Step 3: Check useCan Hook
The `useCan()` hook might not be reacting to persisted state changes:
```typescript
export function useCan(permission: UiPermissionKey): boolean {
  return useBootstrapStore((state) => {
    // Does this re-execute when state is restored from persistence?
    switch (permission) {
      case 'canManageOrders':
        return canViewOrdersFromPermissions(state.permissions);
      // ...
    }
  });
}
```

### Step 4: Verify Hydration Timing
Zustand persist middleware might hydrate AFTER React components render:
- First render: `permissions = []` (empty)
- Navigation items filtered out because all `show: false`
- Second render after hydration: `permissions` populated
- BUT components might not re-render automatically

## Possible Root Causes

1. **Hydration Timing Issue:**
   - Zustand hydrates from sessionStorage AFTER first render
   - Components render with empty permissions
   - Components don't re-render after hydration completes

2. **React Strict Mode / Concurrent Rendering:**
   - React 18+ might cause double rendering issues
   - State updates might be batched incorrectly

3. **Component Mounting Issue:**
   - `WorkspaceSidebarNav` might be memoized or cached
   - Changes to permissions don't trigger re-render

4. **Persistence Merge Strategy:**
   - The custom `merge` function might be causing issues
   - Persisted state might not be applied correctly

## How to Verify the Fix Works

### Option 1: Manual Testing (Recommended First)
1. Navigate to `/en/merchant/orders`
2. See full navigation with Orders button visible
3. Navigate to Google
4. Click back
5. **Within 1 second**, see:
   - ✅ "Orders" button visible in sidebar
   - ✅ "Themes" button visible in sidebar
   - ✅ "Stores" button visible in sidebar
   - ✅ "Billing" button visible in sidebar
   - ✅ Full navigation restored

**Take a screenshot after clicking back to compare with the initial state.**

### Option 2: Playwright Automated Test
**You can use Playwright to automate the test.** There are already test scripts in the project:
- `test-bfcache-ui-state.js` - Existing test but it has a bug (doesn't properly check nav items)

**Create a proper test that checks for actual navigation buttons:**

```javascript
// test-nav-buttons-visibility.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  // Login
  await page.goto('http://localhost:3001/en/login');
  await page.fill('input[name="email"]', 'merchant@test.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // Go to orders page
  await page.goto('http://localhost:3001/en/merchant/orders');
  await page.waitForLoadState('networkidle');
  
  // Check initial state - these SHOULD be visible
  console.log('\n=== Initial State (Before Google) ===');
  const initialOrders = await page.locator('text=Orders').first().isVisible();
  const initialThemes = await page.locator('text=Themes').isVisible();
  const initialStores = await page.locator('text=Stores').isVisible();
  console.log(`Orders button visible: ${initialOrders}`);
  console.log(`Themes button visible: ${initialThemes}`);
  console.log(`Stores button visible: ${initialStores}`);

  // Navigate to Google
  await page.goto('https://www.google.com/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  // Go back
  console.log('\n=== Clicking BACK ===');
  await page.goBack();
  await page.waitForTimeout(2000); // Wait 2 seconds

  // Check if nav buttons are visible
  console.log('\n=== After Back Navigation ===');
  const ordersVisible = await page.locator('text=Orders').first().isVisible().catch(() => false);
  const themesVisible = await page.locator('text=Themes').isVisible().catch(() => false);
  const storesVisible = await page.locator('text=Stores').isVisible().catch(() => false);
  const billingVisible = await page.locator('text=Billing').isVisible().catch(() => false);
  
  console.log(`Orders button visible: ${ordersVisible}`);
  console.log(`Themes button visible: ${themesVisible}`);
  console.log(`Stores button visible: ${storesVisible}`);
  console.log(`Billing button visible: ${billingVisible}`);

  // Verdict
  if (ordersVisible && themesVisible && storesVisible && billingVisible) {
    console.log('\n✅ BUG IS FIXED - All navigation buttons are visible');
  } else {
    console.log('\n🔴 BUG STILL EXISTS - Navigation buttons are missing');
    console.log('Missing buttons:', {
      Orders: !ordersVisible,
      Themes: !themesVisible,
      Stores: !storesVisible,
      Billing: !billingVisible,
    });
  }

  await page.waitForTimeout(5000);
  await browser.close();
})();
```

**Run the test:**
```bash
node test-nav-buttons-visibility.js
```

### Option 3: Browser DevTools Check
After clicking back, open DevTools and check:

1. **Check sessionStorage:**
   - Application tab → Session Storage → `http://localhost:3001`
   - Look for key: `bootstrap-storage`
   - Verify it has `permissions` array with values

2. **Check DOM:**
   - Elements tab
   - Search for text "Orders" or "Themes"
   - These should exist in the sidebar nav

3. **Check Console:**
   - Look for any errors
   - Look for "[BootstrapProvider] Page restored from bfcache" message

## Environment Details

- **Framework:** Next.js 16.2.4
- **State Management:** Zustand (with persist middleware added)
- **React Version:** 18+ (likely using concurrent features)
- **Browser:** Chromium 148.0.7778.167
- **Storage:** sessionStorage for persistence
- **Dev Server:** Running on `http://localhost:3001`

## Important Notes for New AI

1. **Don't trust automated tests that only check if sidebar container exists**
   - Must check if individual navigation ITEMS/BUTTONS are rendered
   - Must look for specific text like "Orders", "Themes", "Stores", etc.

2. **The user can see the problem visually**
   - They see empty sidebar with only "Admin Dashboard"
   - Navigation buttons are completely missing
   - This is not a brief loading state - it stays broken

3. **Zustand persistence was added but didn't fix it**
   - Maybe hydration happens too late
   - Maybe components need to be forced to re-render
   - Maybe the selector hooks don't react to persisted state

4. **Focus on WHY navigation items don't render**
   - Not just why permissions are empty
   - But why components don't show items even after permissions are restored

## Suggested Investigation Approach

1. First, reproduce the bug manually
2. Add extensive logging to track:
   - When sessionStorage hydration happens
   - When WorkspaceSidebarNav renders
   - What permissions values are during each render
   - How many visibleItems there are
3. Identify the exact timing issue
4. Consider solutions like:
   - Forcing component remount after hydration
   - Using a "hydrated" flag to delay rendering
   - Triggering explicit re-render after persistence loads
   - Different persistence strategy (localStorage vs sessionStorage)

## Last Resort Solutions to Try

If Zustand persistence continues to fail:

1. **Use React Context + localStorage:**
   - More control over hydration timing
   - Can block render until hydration completes

2. **Add a "ready" gate:**
   - Don't render WorkspaceSidebarNav until hydration confirmed
   - Show skeleton loader during hydration

3. **Force key change:**
   - Give WorkspaceSidebarNav a key based on permissions hash
   - Force remount when permissions change

4. **Manual persistence:**
   - Save/load permissions manually in useEffect
   - Bypass Zustand persistence middleware

Good luck! The user is counting on you to actually verify the fix works by checking if the navigation buttons are visible.
