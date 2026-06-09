# ✅ AI Collaboration Checklist (Commerce Frontend)

**Use this checklist for EVERY AI interaction**  
**Ensures code quality + prevents chaos**  
**Date**: June 7, 2026

---

## 📋 Pre-Interaction Checklist

**Before asking AI to do anything, prepare:**

- [ ] I know which feature area this belongs to (products, orders, CMS, auth, etc.)
- [ ] I have docs/standards/ rules fresh in mind
- [ ] I have the AI prompt template ready
- [ ] I know if I want documentation or not
- [ ] I know where documentation should go (if needed)

---

## 🤖 Prompt Checklist

**Include in EVERY prompt to AI:**

### ✅ Frontend Rules Section
- [ ] Included: "Server Components by default"
- [ ] Included: "Client Components ONLY for interactivity"
- [ ] Included: "NO `any` types"
- [ ] Included: "serverFetch for SSR, clientFetch for browser"
- [ ] Included: "CMS routes use cmsService"
- [ ] Included: "Thin components (no business logic)"
- [ ] Included: "Business logic in services/features"
- [ ] Included: "Routes under /{locale}/"
- [ ] Included: "Merchant routes under /merchant/*"
- [ ] Included: "NO localStorage for auth"
- [ ] Included: "RTL support via logical properties"
- [ ] Included: "generateMetadata() for SEO"
- [ ] Included: "React Query for mutations"
- [ ] Included: "Types match backend contracts"

### ✅ Documentation Rules Section
- [ ] Included: "NO files outside docs/"
- [ ] Included: "NO files in project root"
- [ ] Included: "NO files in code folders"
- [ ] Included: "ASK before creating docs"
- [ ] Included: "Use UPPERCASE_NAMING.md"
- [ ] Specified: Whether docs are needed or not

### ✅ Task Details Section
- [ ] Specified: Feature name
- [ ] Specified: Route (if applicable)
- [ ] Listed: Clear requirements
- [ ] Included: "Confirm before implementing"

---

## 🔍 AI Response Verification

**When AI responds, verify:**

### Standards Compliance
- [ ] AI confirmed component structure (Server vs Client)
- [ ] AI listed files to create
- [ ] AI showed implementation plan
- [ ] AI is waiting for approval
- [ ] Plan follows standards
- [ ] No anti-patterns visible

### Documentation Handling
- [ ] AI asked about documentation (if ambiguous)
- [ ] AI proposed correct location (if creating docs)
- [ ] AI used UPPERCASE_NAMING format
- [ ] No mention of files in wrong locations

---

## 💻 Code Output Verification

**After AI provides code, check:**

### Component Structure
- [ ] Server Components used by default
- [ ] 'use client' only where needed (hooks, events)
- [ ] No unnecessary client boundaries
- [ ] Components are thin (UI only)
- [ ] No business logic in components

### TypeScript Safety
- [ ] No `any` types anywhere
- [ ] Explicit interfaces defined
- [ ] Types match backend DTOs/Resources
- [ ] All optional fields handled
- [ ] Proper null/undefined safety
- [ ] Import paths correct

### Data Fetching
- [ ] serverFetch used in Server Components
- [ ] clientFetch used in browser code
- [ ] CMS routes use cmsService methods
- [ ] No direct fetch() calls
- [ ] Proper error handling
- [ ] Cookie forwarding handled

### Routing & Navigation
- [ ] All routes under /{locale}/
- [ ] Merchant routes under /merchant/*
- [ ] No legacy /stores/[id]/ patterns
- [ ] generateMetadata() implemented (if page)
- [ ] No manual <head> tags
- [ ] Proper dynamic params

### State Management
- [ ] React Query for server state/mutations
- [ ] Centralized query keys
- [ ] Zustand for global UI state (if needed)
- [ ] AuthContext for auth state
- [ ] No localStorage for sensitive data

### Services & Features
- [ ] Business logic in services
- [ ] Feature-based organization
- [ ] Reuses existing patterns
- [ ] Proper error handling
- [ ] Type-safe API calls

### UI & Styling
- [ ] Uses shadcn/ui components
- [ ] Consistent with design system
- [ ] RTL compatible (logical properties)
- [ ] rtl: prefix where needed
- [ ] Responsive design

### Forms & Validation
- [ ] React Hook Form used
- [ ] Zod schema validation
- [ ] Proper error display
- [ ] Loading states handled
- [ ] Success feedback

### Internationalization
- [ ] Locale-aware routes
- [ ] Translation keys used
- [ ] No hardcoded strings
- [ ] RTL/LTR layout support

---

## 📁 File Location Verification

**Check no random files created:**

```bash
# Run this command to find misplaced files
find laratenant-commerce -name "*.md" -not -path "*/docs/*" -not -name "README.md"
```

**Should return EMPTY or only expected root files.**

- [ ] No .md files in project root (except README.md)
- [ ] No .md files in src/
- [ ] No .md files in tests/
- [ ] No .md files in public/
- [ ] All docs in docs/[category]/

---

## 📝 Documentation Verification

**If AI created documentation:**

- [ ] File is in docs/[category]/ folder
- [ ] Category is correct (fixes, features, etc.)
- [ ] Filename is UPPERCASE_WITH_UNDERSCORES.md
- [ ] Filename is descriptive (not generic)
- [ ] Content is professional
- [ ] No temporary names (temp.md, notes.md)

---

## 🚫 Violation Response Checklist

**If you find ANY violation:**

- [ ] Point out the specific violation
- [ ] Reference the rule from docs/standards/
- [ ] Demand immediate correction
- [ ] DO NOT accept "it's close enough"
- [ ] Make AI fix before proceeding
- [ ] Add clearer rules to next prompt

**Example violation response:**
```
❌ VIOLATION: You used 'any' type in the form handler.

RULE: NO `any` types allowed (docs/standards/typescript.md).
Use explicit interface or unknown, then narrow.

FIX REQUIRED:
Replace: handler(data: any)
With: handler(data: CreateBrandData)

Do this now before continuing.
```

---

## ✅ Acceptance Checklist

**Only accept AI's work when ALL these are true:**

### Code Quality
- [ ] All standards rules followed
- [ ] Server/Client boundary correct
- [ ] No `any` types
- [ ] Types match backend
- [ ] Proper fetch utilities used
- [ ] Components are thin
- [ ] Business logic in services
- [ ] Routes structured correctly
- [ ] RTL compatible
- [ ] SEO metadata correct

### Documentation
- [ ] No files in wrong locations
- [ ] All docs in correct categories
- [ ] Filenames follow convention
- [ ] Content is professional

### Completeness
- [ ] All requested features implemented
- [ ] No shortcuts taken
- [ ] No "TODO" comments
- [ ] No placeholder code
- [ ] Ready for testing

---

## 🔄 Post-Acceptance Actions

**After accepting AI's work:**

- [ ] Test the implementation locally
- [ ] Run TypeScript checks (npm run type-check)
- [ ] Run linter (npm run lint)
- [ ] Check for console errors
- [ ] Test RTL layout (switch to Arabic)
- [ ] Verify responsive design
- [ ] Document any issues found
- [ ] Update team if significant change

---

## 📊 Session Summary Checklist

**At end of AI collaboration session:**

- [ ] All tasks completed
- [ ] All violations corrected
- [ ] No random files created
- [ ] Code is standards-compliant
- [ ] Documentation (if any) is properly placed
- [ ] TypeScript passes
- [ ] Linter passes
- [ ] Ready to commit

---

## 🎯 Quick Reference

### When AI Creates File in Wrong Location:
```
❌ STOP
Point out violation
Reference rule
Demand correction
Add rule to next prompt
```

### When AI Violates Standards:
```
❌ REJECT
Show the violation
Show the correct way
Make AI fix
Continue only after fix
```

### When Unsure:
```
✋ PAUSE
Check docs/standards/
Check AI_RULES_ENFORCEMENT_SYSTEM.md
Ask AI to explain approach
Verify against rules
Then proceed
```

---

## 📚 Quick Links

**Keep these open during AI collaboration:**

- **Standards**: [docs/standards/](./standards/) - All coding rules
- **Prompt Template**: [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md)
- **Enforcement Guide**: [AI_RULES_ENFORCEMENT_SYSTEM.md](./AI_RULES_ENFORCEMENT_SYSTEM.md)
- **Documentation Rules**: [AI_DOCUMENTATION_RULES.md](./AI_DOCUMENTATION_RULES.md)

---

## 💡 Pro Tips

1. **Print this checklist** - Keep it visible while working with AI
2. **Check off items** as you verify them
3. **Be strict** - No exceptions to rules
4. **Be consistent** - Use checklist every time
5. **Train AI** - Point out violations immediately

---

## 🎓 Success Criteria

You're successfully collaborating with AI when:

- [ ] AI always confirms before implementing
- [ ] AI never violates standards rules
- [ ] AI asks about documentation location
- [ ] No random files are created
- [ ] Code quality is consistently high
- [ ] You catch violations immediately
- [ ] You enforce rules strictly

---

## 📈 Track Your Progress

**Session Tracking:**
```
Date: ___________
Task: ___________
Violations Found: ___
Documentation Created: ___
Standards Compliance: ☐ Yes ☐ No
Files in Wrong Location: ☐ Yes ☐ No
TypeScript Passes: ☐ Yes ☐ No
Overall Quality: ☐ Excellent ☐ Good ☐ Needs Work
```

---

## 🎯 Remember

### The Golden Rules:
1. **Always use the prompt template**
2. **Always verify output**
3. **Always reject violations**
4. **Always be consistent**
5. **Never compromise on quality**

### The Result:
**High-quality code + Clean organization + Happy team** 🚀

---

**Created**: June 7, 2026  
**Purpose**: Systematic AI collaboration checklist for Next.js frontend  
**Status**: Use for every AI interaction  
**Authority**: docs/standards/ + All AI guides

---

**Print this, keep it visible, check items off, maintain quality!** ✅
