# 📋 Systematic Implementation Plan: Jakob Nielsen's 10 Usability Heuristics

---

## 🎯 **Core Principles Before We Start**
- ✅ Follow all existing project architecture rules
- ✅ Server Components by default, Client only for interactivity
- ✅ Thin route pages, business logic in features/services
- ✅ No architectural drift, no unplanned refactors
- ✅ Documentation first
- ✅ Type-safe, no `any`
- ✅ Respect existing folder and naming conventions

---

## 📊 **Implementation Prioritization Roadmap**

### **Phase 1: High Impact, Low Effort (Weeks 1-2)**
- [ ] Heuristic 1: Visibility of System Status
- [ ] Heuristic 3: User Control and Freedom
- [ ] Heuristic 5: Error Prevention

### **Phase 2: High Impact, Medium Effort (Weeks 3-4)**
- [ ] Heuristic 2: Match Between System and Real World
- [ ] Heuristic 4: Consistency and Standards
- [ ] Heuristic 6: Recognition Rather Than Recall

### **Phase 3: Medium Impact (Weeks 5-8)**
- [ ] Heuristic 7: Flexibility and Efficiency of Use
- [ ] Heuristic 8: Aesthetic and Minimalist Design
- [ ] Heuristic 9: Help Users Recognize, Diagnose, Recover from Errors

### **Phase 4: Long-Term (Weeks 9+)**
- [ ] Heuristic 10: Help and Documentation

---

## 📁 **Folder Structure for New Components**
We will follow existing conventions:
```
src/
├── components/
│   ├── ui/              # New low-level primitives (e.g., Badge, Skeleton)
│   └── shared/          # New cross-feature components (e.g., Breadcrumbs, CommandPalette)
├── features/
│   ├── dashboard/
│   │   └── shell/       # Modifications to existing shell components
│   ├── notifications/   # New feature for activity badges
│   ├── recent-items/    # New feature for recent items
│   └── command-palette/ # New feature for quick search
├── hooks/               # New hooks for state management
├── stores/              # Modifications to existing stores (uiStore, add activityStore)
├── lib/                 # New utilities
└── config/              # New constants, features
```

---

## 🚀 **Phase 1: High Impact, Low Effort**

---

### **✅ Heuristic 1: Visibility of System Status**

**Goal:** Keep users informed about what's happening with clear feedback.

#### **Tasks**
1. **Add Skeleton Loading Components**
   - Create `components/ui/Skeleton.tsx`
   - Create `components/ui/SkeletonCard.tsx`
   - Add loading skeletons to navigation while switching stores
   - Add loading skeletons to list views

2. **Activity Badges System**
   - Create `features/notifications/NotificationBadge.tsx`
   - Create `stores/activityStore.ts` for pending counts
   - Add badges to:
     - Orders (pending count)
     - Products (draft count)
     - Notifications (unread count)

3. **Enhanced Feedback**
   - Improve existing Toaster to show progress
   - Add success/error toast with undo option

#### **Components to Create/Modify**
| File | Type | Status |
|------|------|--------|
| `components/ui/Skeleton.tsx` | New UI primitive | Pending |
| `components/ui/Badge.tsx` | New/Enhanced | Pending |
| `features/notifications/NotificationBadge.tsx` | New Feature | Pending |
| `stores/activityStore.ts` | New Store | Pending |
| `features/dashboard/shell/topbar/Topbar.tsx` | Modified | Pending |

#### **Acceptance Criteria**
- ✅ Loading states are clearly visible
- ✅ Activity badges update in real-time
- ✅ Users never wonder "did that work?"

---

### **✅ Heuristic 3: User Control and Freedom**

**Goal:** Provide emergency exits, undo, and navigation freedom.

#### **Tasks**
1. **Breadcrumb Navigation**
   - Create `components/shared/Breadcrumbs.tsx`
   - Integrate with existing routing
   - Show hierarchy: Dashboard → Products → [Product Name]

2. **Persist All UI Preferences**
   - We already did sidebar + theme
   - Add tab view preferences (list vs grid)
   - Add pagination preferences

3. **Archive Instead of Delete (Soft Delete)**
   - Update delete mutations to support soft delete
   - Add "Restore" option
   - Add trash view for archived items

4. **Unsaved Changes Warning**
   - Create `hooks/useUnsavedChanges.ts`
   - Add beforeunload handler
   - Add route change confirmation

#### **Components to Create/Modify**
| File | Type | Status |
|------|------|--------|
| `components/shared/Breadcrumbs.tsx` | New Shared | Pending |
| `hooks/useUnsavedChanges.ts` | New Hook | Pending |
| `stores/uiStore.ts` | Modified | In Progress |

#### **Acceptance Criteria**
- ✅ Users can always go back
- ✅ Mistakes can be undone
- ✅ Work isn't lost accidentally

---

### **✅ Heuristic 5: Error Prevention**

**Goal:** Prevent errors before they happen.

#### **Tasks**
1. **Destructive Action Confirmations**
   - Create `components/ui/ConfirmDialog.tsx`
   - Require confirmation for:
     - Delete product/category/brand
     - Delete order
     - Delete user

2. **Form Validation**
   - Enhance existing validation to prevent invalid inputs
   - Real-time validation feedback

3. **Input Sanitization & Constraints**
   - Add input masks (phone, currency)
   - Add min/max constraints
   - Prevent invalid characters

#### **Components to Create/Modify**
| File | Type | Status |
|------|------|--------|
| `components/ui/ConfirmDialog.tsx` | New UI | Pending |

#### **Acceptance Criteria**
- ✅ No accidental data loss
- ✅ Clear warnings before dangerous actions
- ✅ Inputs are validated before submission

---

## 🚀 **Phase 2: High Impact, Medium Effort**

---

### **✅ Heuristic 2: Match Between System and Real World**

**Goal:** Use user-friendly language and concepts.

#### **Tasks**
1. **Review and Simplify Terminology**
   - Update translation files with clearer language
   - "Online Store" → "Storefront"
   - "Marketing Pages" → "Pages"
   - "Navigation" → "Menu Navigation"

2. **Reorganize Navigation Groups**
   - Update WorkspaceSidebarNav grouping
   - Move Billing into Settings > Billing
   - Group Storefront-related items together

3. **Use Familiar Concepts**
   - "Trash" instead of "Delete Permanently"
   - "Draft" instead of "Unpublished"

#### **Acceptance Criteria**
- ✅ Language is intuitive for non-technical users
- ✅ Navigation follows logical mental model

---

### **✅ Heuristic 4: Consistency and Standards**

**Goal:** Keep UI and behavior consistent across the app.

#### **Tasks**
1. **Iconography Standardization**
   - Document icon library (Lucide)
   - Define consistent icon sizes (16px, 20px, 24px)
   - Define consistent icon spacing
   - Create `components/ui/Icon.tsx` wrapper

2. **Component Pattern Consistency**
   - Standardize button variants
   - Standardize form field spacing
   - Standardize card layouts

3. **Navigation Behavior Consistency**
   - Consistent hover/active states
   - Consistent collapse/expand animations

#### **Acceptance Criteria**
- ✅ UI looks and behaves the same everywhere
- ✅ No surprises for users

---

### **✅ Heuristic 6: Recognition Rather Than Recall**

**Goal:** Make options visible, don't force memorization.

#### **Tasks**
1. **Command Palette (Quick Search)**
   - Create `components/shared/CommandPalette.tsx`
   - Support Cmd/Ctrl + K shortcut
   - Search across pages, products, orders
   - Show recent items

2. **Recent Items Section**
   - Create `features/recent-items/RecentItems.tsx`
   - Show last 10 visited pages/items
   - Persist to localStorage

3. **Favorites/Pinned Items**
   - Allow pinning frequently used pages
   - Show pinned items at top of sidebar

#### **Acceptance Criteria**
- ✅ Users can find what they need quickly
- ✅ No need to remember where things are

---

## 🚀 **Phase 3: Medium Impact**

---

### **✅ Heuristic 7: Flexibility and Efficiency of Use**

**Goal:** Cater to both novice and power users.

#### **Tasks**
1. **Keyboard Shortcuts System**
   - Create `hooks/useKeyboardShortcuts.ts`
   - Implement:
     - `Cmd/Ctrl + K` → Command palette
     - `Cmd/Ctrl + [` → Back
     - `Cmd/Ctrl + ]` → Forward
     - `Cmd/Ctrl + N` → New item
     - `?` → Show shortcuts help

2. **Quick Actions**
   - Add quick create buttons in sidebar
   - Add bulk actions to list views
   - Add context menus (right-click)

3. **Accelerators for Power Users**
   - Allow batch operations
   - Allow multi-select

---

### **✅ Heuristic 8: Aesthetic and Minimalist Design**

**Goal:** Keep UI clean and focused.

#### **Tasks**
1. **Visual Hierarchy Improvements**
   - Better use of whitespace
   - Clearer section dividers
   - Consistent typography scale
   - Progressive disclosure (hide less-used options)

2. **Information Density**
   - Optimize for both compact and comfortable views
   - Allow user to adjust density

---

### **✅ Heuristic 9: Help Users Recognize, Diagnose, Recover from Errors**

**Goal:** Clear error messages with recovery steps.

#### **Tasks**
1. **Better Error Messages**
   - Plain language, no technical jargon
   - Explain what went wrong
   - Suggest how to fix it
   - Provide recovery actions

2. **Error Boundaries**
   - Add error boundaries for graceful degradation
   - Show friendly error pages instead of crashes

---

## 🚀 **Phase 4: Long-Term**

---

### **✅ Heuristic 10: Help and Documentation**

**Goal:** Provide accessible help when needed.

#### **Tasks**
1. **In-App Help Menu**
   - Links to documentation
   - Video tutorials
   - Contact support
   - Keyboard shortcuts help

2. **Onboarding Tour**
   - First-time user walkthrough
   - Feature discovery tooltips
   - Optional, skippable

3. **Context-Sensitive Help**
   - Tooltips on complex features
   - "Learn more" links
   - Inline help for forms

---

## ✅ **Validation Checklist**

Before marking any heuristic complete:
- [ ] Follows all architecture rules
- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Works with RTL
- [ ] Works on mobile
- [ ] Server/Client boundaries respected
- [ ] Documentation updated if needed
- [ ] No `any` types
- [ ] Reuses existing patterns

---

## 📝 **Next Steps**
1. Start with Phase 1, Heuristic 1: Visibility of System Status
2. Create Skeleton components
3. Create NotificationBadge system
4. Move to Heuristic 3, then Heuristic 5

---

*Last Updated: 2026-06-25*
