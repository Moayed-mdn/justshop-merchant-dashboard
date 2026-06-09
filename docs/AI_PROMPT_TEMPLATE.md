# 🎯 AI Prompt Template - Copy & Paste (Commerce Frontend)

**Use this template for EVERY AI interaction**  
**Prevents architecture violations + documentation chaos**

---

## 📋 The Complete Template

```
I need to [DESCRIBE YOUR TASK].

🔥 MANDATORY FRONTEND RULES (from standards/):

1. Server Components by default → Client Components ONLY for interactivity
2. NO `any` type → use explicit types or `unknown`
3. Use serverFetch for SSR → clientFetch for browser requests
4. CMS routes MUST use cmsService (no direct fetch)
5. Keep components thin → business logic in services/features
6. Use existing UI patterns (shadcn/ui)
7. All routes under /{locale}/ prefix
8. Merchant routes under /merchant/* (canonical)
9. NO localStorage for auth → use AuthContext + cookies
10. RTL support → use rtl: prefix or logical properties
11. generateMetadata() for SEO → NO manual <head> tags
12. React Query for mutations → centralized queryKeys
13. Type safety → frontend types MUST match backend DTOs

🚫 DOCUMENTATION RULES:

1. NO files outside laratenant-commerce/docs/
2. NO files in project root (laratenant-commerce/*.md)
3. NO files in code folders (src/**/*.md)
4. ONLY create in docs/[category]/ folders
5. ASK before creating ANY documentation
6. Use UPPERCASE_NAMING.md format

Available categories:
- docs/fixes/          → Bug fixes
- docs/features/       → Feature docs
- docs/implementation/ → Implementation guides
- docs/sessions/       → Session logs
- docs/testing/        → Test results
- docs/routing/        → Routing changes
- docs/frontend/       → Frontend architecture

DEFAULT: Don't create documentation unless explicitly asked.

📝 TASK DETAILS:
- Feature: [YOUR FEATURE]
- Route: [YOUR ROUTE IF APPLICABLE]
- Requirements:
  • [REQUIREMENT 1]
  • [REQUIREMENT 2]
  • [REQUIREMENT 3]

🔄 PROCESS:
1. FIRST: Confirm architecture patterns to follow
2. THEN: Show implementation plan
3. WAIT for my approval
4. THEN: Implement following standards
5. IF documentation needed: ASK where to put it

NO EXCEPTIONS. FOLLOW STRICTLY.

Begin now.
```

---

## 🚀 Quick Examples

### Example 1: New Feature (No Docs)

```
I need to add a store settings page to the merchant dashboard.

[PASTE FULL TEMPLATE ABOVE]

TASK DETAILS:
- Feature: Store Settings
- Route: /[locale]/merchant/settings
- Requirements:
  • Display store name and slug
  • Allow editing store information
  • Use React Query for mutations
  • Server Component wrapper with Client form

DOCUMENTATION: None needed, just code.

Begin now.
```

---

### Example 2: Bug Fix (With Docs)

```
I need to fix the RTL layout issue in the product wizard.

[PASTE FULL TEMPLATE ABOVE]

TASK DETAILS:
- Feature: Product Wizard
- Route: /[locale]/merchant/products/create
- Requirements:
  • Fix step indicator alignment in RTL
  • Use logical properties
  • Test in Arabic locale

DOCUMENTATION: Yes, create in docs/fixes/FIX_PRODUCT_WIZARD_RTL.md

Begin now.
```

---

### Example 3: Just Asking Questions (No Code/Docs)

```
Explain how the server/client boundary works in the CMS pages.

🚫 RULES:
- NO code changes
- NO file creation
- NO documentation
- ONLY explain

Begin now.
```

---

## 💡 Customization Tips

### When You DON'T Want Documentation:
```
DOCUMENTATION: None needed, just code.
```

### When You DO Want Documentation:
```
DOCUMENTATION: Yes, create in docs/[category]/[FILENAME].md
```

### When Unsure About Documentation:
```
DOCUMENTATION: Ask me after implementation if needed.
```

---

## 📊 What Each Section Does

| Section | Purpose |
|---------|---------|
| **Frontend Rules** | Ensures Next.js/TypeScript compliance |
| **Documentation Rules** | Prevents file chaos |
| **Task Details** | Gives AI context |
| **Process** | Controls AI behavior |
| **Documentation** | Specifies doc requirements |

---

## ✅ Verification Checklist

After AI responds, check:

**Frontend Compliance:**
- [ ] No `any` types used
- [ ] Server Components used where appropriate
- [ ] Proper fetch utility (serverFetch vs clientFetch)
- [ ] Types match backend contracts
- [ ] Component is thin (no business logic)

**Documentation Compliance:**
- [ ] No files in project root
- [ ] No files in code folders
- [ ] If docs created, in correct category
- [ ] Filename is descriptive and UPPERCASE

**If any check fails**: Reject and demand fix!

---

## 🎯 Pro Tips

1. **Save this template** in a text file for quick access
2. **Customize** the task details section for each use
3. **Be explicit** about documentation needs
4. **Always verify** AI output
5. **Enforce consistently** - no exceptions

---

## 📚 Related Documents

- **Full Frontend Rules**: [AI_RULES_ENFORCEMENT_SYSTEM.md](./AI_RULES_ENFORCEMENT_SYSTEM.md)
- **Documentation Rules**: [AI_DOCUMENTATION_RULES.md](./AI_DOCUMENTATION_RULES.md)
- **Agent Rules**: [standards/AI_AGENT_RULES.md](./standards/AI_AGENT_RULES.md)
- **Entry Point**: [00-START-HERE.md](./00-START-HERE.md)

---

## 🚀 Quick Start

1. **Copy** the template above
2. **Fill in** task details
3. **Paste** into AI chat
4. **Verify** output
5. **Done!**

---

**Created**: June 7, 2026  
**Purpose**: Ready-to-use AI prompt template for Next.js frontend  
**Status**: Copy & paste into every AI interaction

---

**Remember**: Consistency is key! Use this template EVERY time you interact with AI for code tasks. 💪
