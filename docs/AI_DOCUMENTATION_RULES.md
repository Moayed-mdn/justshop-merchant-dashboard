# 🚫 AI Documentation Rules - Prevent Chaotic File Creation (Commerce)

**Purpose**: Prevent AI from creating documentation files in random locations  
**Authority**: This document + docs/standards/  
**Date**: June 7, 2026

---

## 🔥 THE PROBLEM

AI often creates documentation files like:
- ❌ `laratenant-commerce/task-summary.md`
- ❌ `laratenant-commerce/QUICK_FIX.md`
- ❌ `laratenant-commerce/notes.md`
- ❌ `src/app/README.md`
- ❌ `src/features/CHANGES.md`

**Result**: Chaos! Files scattered everywhere! 😱

---

## ✅ THE SOLUTION

**STRICT RULE**: AI MUST ONLY create documentation in designated folders.

---

## 📋 Documentation File Location Rules

### Rule 1: NO Documentation Files Outside docs/

**FORBIDDEN LOCATIONS:**
```
❌ laratenant-commerce/task-summary.md
❌ laratenant-commerce/ANYTHING.md
❌ src/app/README.md
❌ src/features/NOTES.md
❌ src/components/CHANGES.md
❌ tests/TESTING_NOTES.md
❌ ANY file outside docs/ folder
```

**ONLY ALLOWED LOCATION:**
```
✅ laratenant-commerce/docs/[category]/filename.md
```

### Rule 2: Documentation MUST Go in Correct Category

**Categories and Their Purpose:**

| Category | Use For | Examples |
|----------|---------|----------|
| `docs/sessions/` | Session completion logs | SESSION_X_COMPLETE.md |
| `docs/fixes/` | Bug fixes and resolutions | FIX_RTL_LAYOUT.md |
| `docs/features/` | Feature documentation | FEATURE_BRANDS_GUIDE.md |
| `docs/implementation/` | Implementation guides | IMPLEMENTATION_STEPS.md |
| `docs/testing/` | Test results and guides | TEST_RESULTS.md |
| `docs/routing/` | Routing changes | ROUTING_CHANGES.md |
| `docs/frontend/` | Frontend architecture | COMPONENT_ARCHITECTURE.md |
| `docs/standards/` | Coding standards | NEW_PATTERN.md |
| `docs/architecture/` | Architecture decisions | ARCHITECTURE_CHANGE.md |
| `docs/planning/` | Planning documents | EXECUTION_PLAN.md |

### Rule 3: File Naming Convention

**REQUIRED FORMAT:**
```
[PURPOSE]_[DESCRIPTION].md

Examples:
✅ FIX_PRODUCT_WIZARD_RTL.md
✅ FEATURE_BRAND_MANAGEMENT.md
✅ SESSION_13_COMPLETE.md
✅ TEST_RESULTS_2026_06_07.md
✅ ROUTING_MERCHANT_WORKSPACE.md

❌ task1-summary.md          (lowercase, vague)
❌ NOTES.md                  (too generic)
❌ temp.md                   (temporary name)
❌ new-feature.md            (lowercase, vague)
```

**Naming Rules:**
- UPPERCASE with underscores
- Descriptive, not generic
- Include date if time-sensitive
- Clear purpose in name

---

## 🤖 How to Tell AI: Prompt Template

### Template 1: Prevent Documentation Creation

**Copy-paste this into your prompt:**

```
📝 DOCUMENTATION RULES (MANDATORY):

1. NO documentation files outside laratenant-commerce/docs/
2. IF you need to create documentation:
   - ASK ME which category first
   - Use correct naming (UPPERCASE_WITH_UNDERSCORES.md)
   - Place in proper docs/[category]/ folder
3. FORBIDDEN:
   - laratenant-commerce/*.md (root level)
   - src/**/*.md (in code folders)
   - tests/*.md
   - Any location except docs/

IF you need to document something:
- ASK: "Should I create documentation? Where should it go?"
- WAIT for my approval
- THEN create in approved location only

DO NOT create documentation files without asking!
```

### Template 2: Specify Exact Location

**When you DO want documentation:**

```
Create documentation for this task.

DOCUMENTATION REQUIREMENTS:
- Location: laratenant-commerce/docs/[CATEGORY]/
- Category: [fixes/features/implementation/sessions/etc.]
- Filename: [DESCRIPTIVE_NAME].md
- Format: Professional markdown

Example:
✅ laratenant-commerce/docs/fixes/FIX_RTL_LAYOUT.md
❌ laratenant-commerce/fix-summary.md

Confirm location before creating.
```

### Template 3: Forbid Documentation

**When you DON'T want documentation:**

```
Complete this task.

🚫 DOCUMENTATION RULE:
- DO NOT create ANY documentation files
- NO summary files
- NO notes files
- ONLY write code

If you think documentation is needed, ASK ME first.
```

---

## 📖 Example Conversations

### Example 1: Preventing Chaos

**❌ BAD PROMPT:**
```
Fix the RTL layout in product wizard
```

**AI Creates:**
```
✅ Code fixes (good)
❌ laratenant-commerce/fix-summary.md (BAD!)
❌ src/features/products/NOTES.md (BAD!)
```

---

**✅ GOOD PROMPT:**
```
Fix the RTL layout in product wizard.

🚫 DOCUMENTATION RULE:
- DO NOT create documentation files
- NO summary files
- Only write code

If documentation needed, ASK first.
```

**AI Response:**
```
✅ Code fixes only
✅ No random files created
```

---

### Example 2: Controlled Documentation

**YOUR PROMPT:**
```
Fix the RTL layout in product wizard.

📝 IF you want to document this:
- ASK ME which category
- WAIT for approval
- Then create in docs/[category]/
```

**AI ASKS:**
```
"I've fixed the bug. Should I create documentation?
Suggested location: docs/fixes/FIX_PRODUCT_WIZARD_RTL.md"
```

**YOU APPROVE:**
```
Yes, create it in docs/fixes/ with that name.
```

**AI CREATES:**
```
✅ laratenant-commerce/docs/fixes/FIX_PRODUCT_WIZARD_RTL.md
```

**Result**: Clean and organized! ✅

---

## 🎯 Quick Reference Card for AI Prompts

**Copy this into EVERY prompt where documentation might be created:**

```
🚫 DOCUMENTATION LOCATION RULES:

1. NO files in project root (laratenant-commerce/*.md)
2. NO files in code folders (src/**/*.md, tests/*.md)
3. ONLY in docs/[category]/ folders
4. ASK before creating documentation
5. Use UPPERCASE_NAMING.md format

Categories:
- docs/fixes/          → Bug fixes
- docs/features/       → Feature docs
- docs/implementation/ → Implementation guides
- docs/sessions/       → Session logs
- docs/testing/        → Test results
- docs/routing/        → Routing changes
- docs/frontend/       → Frontend architecture

IF you want to create documentation:
→ ASK: "Should I create docs? Where?"
→ WAIT for approval
→ CREATE in approved location only

DEFAULT: Don't create documentation unless explicitly asked.
```

---

## 🛡️ Enforcement Checklist

After AI completes a task, verify:

**File Location Check:**
- [ ] No .md files in project root
- [ ] No .md files in src/ folder
- [ ] No .md files in tests/ folder
- [ ] No .md files in public/ folder
- [ ] All docs are in docs/[category]/

**File Naming Check:**
- [ ] Names are UPPERCASE_WITH_UNDERSCORES.md
- [ ] Names are descriptive (not generic)
- [ ] No temporary names (temp.md, notes.md, etc.)

**If violations found:**
1. Point out the violation
2. Ask AI to delete the file
3. Remind AI of documentation rules
4. Add documentation rules to next prompt

---

## 🔧 Fix Existing Chaotic Files

If AI already created chaotic files:

### Step 1: Identify Them
```bash
# Find all markdown files outside docs/
find laratenant-commerce -maxdepth 1 -name "*.md" -type f -not -name "README.md"
```

### Step 2: Review Each File
- Decide if it's valuable
- Determine correct category
- Choose proper name

### Step 3: Move to Correct Location
```bash
# Example: Move misplaced file
mv laratenant-commerce/task1-summary.md \
   laratenant-commerce/docs/sessions/SESSION_13_SUMMARY.md
```

### Step 4: Delete Useless Files
```bash
# Delete temporary files
rm laratenant-commerce/temp-notes.md
rm laratenant-commerce/quick-fix.md
```

---

## 📋 Categories Deep Dive

### When to Use Each Category

**docs/fixes/**
- Bug fix summaries
- Problem resolution
- Hotfix documentation
- Error corrections

**docs/features/**
- Feature specifications
- Feature implementation guides
- Feature usage documentation
- Component architecture

**docs/implementation/**
- Step-by-step implementation guides
- How-to documents
- Integration guides
- Setup instructions

**docs/sessions/**
- Session completion logs
- Session planning
- Session handoffs
- Session summaries

**docs/testing/**
- Test results
- Test plans
- E2E test documentation
- QA reports

**docs/routing/**
- Routing changes
- Route migration guides
- URL structure changes
- Navigation updates

**docs/frontend/**
- Frontend architecture decisions
- Component patterns
- State management
- Server/Client boundaries

**docs/standards/**
- Coding standards
- New patterns
- Best practices
- Style guides

**docs/architecture/**
- Architecture decisions
- System design
- Technical specifications
- ADRs (Architecture Decision Records)

**docs/planning/**
- Execution plans
- Roadmaps
- Migration plans
- Strategy documents

---

## 💡 Pro Tips

### Tip 1: Be Explicit About Documentation
Always tell AI whether you want documentation or not:
```
"Fix this bug. NO documentation needed."
OR
"Fix this bug. Create documentation in docs/fixes/"
```

### Tip 2: Specify Location Upfront
When you want docs, specify exactly where:
```
"Create: docs/features/FEATURE_NAME.md"
```

### Tip 3: Use the Quick Reference Card
Paste it into every prompt where AI might create files.

### Tip 4: Review After AI Completes
Always check if AI created unexpected files:
```bash
find laratenant-commerce -name "*.md" -not -path "*/docs/*" -not -name "README.md"
```

### Tip 5: Train AI Consistently
Every time AI creates a file in wrong location:
1. Point it out immediately
2. Make AI delete it
3. Remind AI of rules
4. Add rules to next prompt

---

## 🎓 Training AI

### When AI Creates Wrong File Location:

**YOUR MESSAGE:**
```
❌ VIOLATION: You created laratenant-commerce/task1-summary.md

RULES:
1. NO documentation outside docs/ folder
2. ONLY create in docs/[category]/
3. ASK before creating documentation

ACTION REQUIRED:
1. Delete: laratenant-commerce/task1-summary.md
2. If documentation needed, create in: docs/sessions/SESSION_13_SUMMARY.md
3. Remember this rule for future tasks

Confirm deletion and compliance.
```

### When AI Asks Permission (GOOD!):

**AI MESSAGE:**
```
"Task complete. Should I create documentation?
Suggested: docs/fixes/FIX_RTL_LAYOUT.md"
```

**YOUR RESPONSE:**
```
✅ YES! Good job asking first.
Create: docs/fixes/FIX_RTL_LAYOUT.md

This is the correct behavior:
1. You asked first ✅
2. You suggested correct location ✅
3. You used proper naming ✅

Continue this approach.
```

---

## 📚 Integration with AI Rules Enforcement System

This document complements `AI_RULES_ENFORCEMENT_SYSTEM.md`.

### Add to Every Prompt:

```
🔥 MANDATORY RULES:

FRONTEND RULES:
[Paste from AI_RULES_ENFORCEMENT_SYSTEM.md]

DOCUMENTATION RULES:
[Paste quick reference card from this document]
```

---

## ✅ Success Criteria

You've mastered documentation control when:

- [ ] AI asks before creating documentation
- [ ] All docs are in docs/[category]/ folders
- [ ] File names are descriptive and uppercase
- [ ] No random files in project root
- [ ] No files in code folders
- [ ] You can find any doc easily
- [ ] Your project stays clean

---

## 🎯 Summary

### The Golden Rules:

1. **NO documentation outside docs/**
2. **ASK before creating docs**
3. **Use correct category**
4. **Use UPPERCASE_NAMING.md**
5. **Be explicit in prompts**

### The Quick Fix:

Paste this in every prompt:
```
🚫 NO documentation files outside docs/[category]/
   ASK before creating any .md files
```

### The Result:

- ✅ Clean project structure
- ✅ Easy to find documentation
- ✅ No scattered files
- ✅ Professional organization

---

## 🚀 Action Plan

### Today:
1. ✅ Read this document
2. 📋 Copy the Quick Reference Card
3. 🤖 Add to your AI prompt template
4. 🧹 Clean up existing chaotic files

### Every Task:
1. 📝 Include documentation rules in prompt
2. ✅ Verify no random files created
3. 🎯 Enforce rules consistently

### Result:
**Clean, organized, professional documentation forever!** ✨

---

**Created**: June 7, 2026  
**Purpose**: Prevent AI documentation chaos in Next.js project  
**Authority**: Mandatory for all AI interactions  
**Status**: Active enforcement guide

---

**Remember**: AI is powerful but needs clear rules. Be explicit, be consistent, and your project will stay clean! 💪
