# 🌍 Translation System

## ⚠️ CRITICAL FOR AI ASSISTANTS

**Translation files are located ONLY in:**
```
src/locales/en/common.json
src/locales/ar/common.json
```

**DO NOT:**
- ❌ Create `messages/` directory (removed - was legacy)
- ❌ Edit any files outside `src/locales/`
- ❌ Forget to add translations to BOTH `en/` and `ar/`

## Quick Reference

### To Add a New Translation:

1. **Edit:** `src/locales/en/common.json`
   ```json
   {
     "theme": {
       "navigation": {
         "itemDialog": {
           "form": {
             "myNewKey": "My New Translation"
           }
         }
       }
     }
   }
   ```

2. **Edit:** `src/locales/ar/common.json`
   ```json
   {
     "theme": {
       "navigation": {
         "itemDialog": {
           "form": {
             "myNewKey": "ترجمتي الجديدة"
           }
         }
       }
     }
   }
   ```

3. **Use in code:**
   ```tsx
   const t = useTranslations('theme.navigation.itemDialog');
   return <div>{t('form.myNewKey')}</div>;
   ```

4. **No restart needed** - Next.js auto-reloads!

## Full Documentation

See: [docs/translations/TRANSLATION_SYSTEM.md](./docs/translations/TRANSLATION_SYSTEM.md)

---

**Last Updated:** 2026-07-01
**Change:** Removed legacy `messages/` directory to prevent confusion
