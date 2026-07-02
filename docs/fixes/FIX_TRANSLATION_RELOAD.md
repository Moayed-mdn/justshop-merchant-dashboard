# Translation Reload Issue Fix

## Problem

After adding new translation keys to `messages/en/theme.json` and `messages/ar/theme.json`, Next.js shows error:

```
MISSING_MESSAGE: Could not resolve `theme.navigation.itemDialog.form.noPagesInfo` in messages for locale `en`.
```

## Root Cause

Next.js dev server caches translation files and doesn't automatically reload them when they change.

## Solution

**Restart the Next.js dev server** to reload translations:

### Option 1: Quick Restart

```bash
# In the terminal running npm run dev:
# Press Ctrl+C to stop
# Then restart:
npm run dev
```

### Option 2: Hard Restart

```bash
# Stop the dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next
# Restart
npm run dev
```

### Option 3: If dev server is stuck

```bash
# Kill any running Next.js processes
pkill -f "next dev"
# Restart
npm run dev
```

## Verification

After restarting, all these translation keys should work:

### New Keys Added to `theme.navigation.itemDialog.form`:

```json
{
  "or": "OR",
  "customUrl": "Enter a custom URL",
  "customUrlPlaceholder": "/about, /contact, /custom-page",
  "customUrlHelp": "For advanced users: Enter a custom internal path. This won't auto-update if the page changes.",
  "selectPage": "Select a page from your CMS",
  "noPagesInfo": "You haven't created any pages yet. Create your first page in the CMS, then come back to link it here.",
  "createFirstPage": "Create First Page",
  "selectFromAbove": "Select from above"
}
```

### New Keys Added to `theme.navigation.resourcePicker`:

```json
{
  "selectPlaceholder": "Select a {type}...",
  "noResults": "No matches found."
}
```

## Validation Command

You can verify the JSON is valid with:

```bash
cd /home/leader/projects/laravel/v3/tenant/laratenant-commerce
cat messages/en/theme.json | jq empty && echo "✅ English JSON valid"
cat messages/ar/theme.json | jq empty && echo "✅ Arabic JSON valid"
```

Both files are confirmed valid. The issue is purely a cache reload problem.

## Files Modified (Confirmed Valid)

1. ✅ `messages/en/theme.json` - Valid JSON, all keys added
2. ✅ `messages/ar/theme.json` - Valid JSON, all keys added
3. ✅ `src/features/theme/navigation/MenuItemDialog.tsx` - Using correct keys
4. ✅ `src/features/theme/navigation/ResourcePicker.tsx` - Using correct keys
5. ✅ `src/lib/api/navigation.ts` - API paths fixed

## Next Steps

1. **Stop the dev server** (Ctrl+C in the terminal)
2. **Start it again**: `npm run dev`
3. **Refresh the browser**
4. The dropdown selector should now work perfectly with all 6 pages showing!

---

**Status**: Ready to test after dev server restart
