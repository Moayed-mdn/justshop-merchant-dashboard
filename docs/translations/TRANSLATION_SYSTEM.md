# Translation System Guide

## ⚠️ CRITICAL: Translation File Location

**ONLY edit translations in:**
```
src/locales/{locale}/
```

**DO NOT create or edit files in:**
```
messages/  ← This directory was removed (legacy)
```

---

## Directory Structure

```
src/locales/
├── en/
│   ├── common.json          ← Most translations (flattened to root)
│   ├── settings.json        ← Settings-specific
│   ├── marketing.json       ← Marketing pages
│   ├── cmsPages.json        ← CMS-specific
│   ├── shipping.json        ← Shipping-specific
│   └── theme-settings.json  ← Theme settings
│
└── ar/
    ├── common.json          ← Arabic translations
    ├── settings.json
    ├── marketing.json
    ├── cmsPages.json
    ├── shipping.json
    └── theme-settings.json
```

---

## How Translations Are Loaded

The i18n configuration (`src/i18n.ts`) loads all JSON files from `src/locales/{locale}/` and merges them.

### Special Rules:

1. **common.json is flattened to root**
   - Content is merged directly into the root messages object
   - This allows direct namespace access like `theme.navigation.itemDialog`

2. **Other files become namespaces**
   - `settings.json` → `settings.*`
   - `marketing.json` → `marketing.*`

---

## Adding New Translations

### Step 1: Choose the Right File

**Most translations go in `common.json`:**
- Navigation (`theme.navigation.*`)
- Products (`products.*`)
- Orders (`orders.*`)
- Dashboard (`dashboard.*`)
- General UI (`nav.*`, `actions.*`)

**Specialized translations:**
- Settings UI → `settings.json`
- Marketing pages → `marketing.json`
- CMS-specific → `cmsPages.json`

### Step 2: Add to BOTH Locales

**English:** `src/locales/en/common.json`
```json
{
  "theme": {
    "navigation": {
      "itemDialog": {
        "form": {
          "newKey": "New Translation"
        }
      }
    }
  }
}
```

**Arabic:** `src/locales/ar/common.json`
```json
{
  "theme": {
    "navigation": {
      "itemDialog": {
        "form": {
          "newKey": "ترجمة جديدة"
        }
      }
    }
  }
}
```

### Step 3: No Restart Needed!

Next.js automatically reloads JSON files in development.

---

## Using Translations in Components

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('theme.navigation.itemDialog');
  
  return (
    <div>
      {t('form.newKey')}
    </div>
  );
}
```

---

## Common Mistakes

### ❌ WRONG: Creating `messages/` directory
```
messages/en/theme.json  ← Not used by the app!
```

### ✅ CORRECT: Using `src/locales/`
```
src/locales/en/common.json  ← This is the active file!
```

### ❌ WRONG: Missing Arabic translation
```json
// Only adding to English file
```

### ✅ CORRECT: Adding to both locales
```json
// Add to both en/ and ar/ directories
```

---

## Navigation Translation Structure

Here's the complete structure for navigation translations in `common.json`:

```json
{
  "theme": {
    "navigation": {
      "title": "Navigation Menus",
      "items": {
        "noItems": "...",
        "addItem": "..."
      },
      "itemDialog": {
        "createTitle": "...",
        "form": {
          "label": "...",
          "type": "...",
          "url": "...",
          "customUrl": "...",
          "noPagesInfo": "...",
          "createFirstPage": "..."
        }
      },
      "resourcePicker": {
        "selectPlaceholder": "...",
        "searchPlaceholder": "...",
        "noResults": "..."
      }
    }
  }
}
```

---

## Validation

Always validate JSON syntax after editing:

```bash
cat src/locales/en/common.json | jq empty && echo "✅ Valid"
cat src/locales/ar/common.json | jq empty && echo "✅ Valid"
```

---

## Key Points for AI Assistants

1. ✅ **ALWAYS edit** `src/locales/{locale}/common.json`
2. ❌ **NEVER create** `messages/` directory
3. ✅ **ALWAYS add to both** English AND Arabic
4. ✅ **Validate JSON** after edits
5. ✅ **No restart needed** in development

---

## Recent Changes (2026-07-01)

**Removed:** Legacy `messages/` directory to prevent confusion

**Added to `src/locales/en/common.json` and `src/locales/ar/common.json`:**
- `theme.navigation.itemDialog.form.or`
- `theme.navigation.itemDialog.form.customUrl`
- `theme.navigation.itemDialog.form.customUrlPlaceholder`
- `theme.navigation.itemDialog.form.customUrlHelp`
- `theme.navigation.itemDialog.form.noPagesInfo`
- `theme.navigation.itemDialog.form.createFirstPage`
- `theme.navigation.itemDialog.form.selectFromAbove`
- `theme.navigation.resourcePicker.selectPlaceholder`
- `theme.navigation.resourcePicker.noResults`

---

**Remember:** If translations don't work, you're probably editing the wrong file!
