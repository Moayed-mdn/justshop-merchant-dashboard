# Testing Scenarios Update for Profile Settings

**Date**: June 15, 2026  
**File Updated**: `docs/testing/MERCHANT_UX_MANUAL_CHROMIUM_SCENARIOS.md`

---

## 📋 Summary

Added comprehensive manual testing scenarios for the newly implemented Profile Settings feature to the Merchant UX testing checklist.

---

## ✨ New Testing Scenarios Added

### **Scenario 12A: Profile Avatar Upload**
Tests the avatar upload functionality including:
- File picker interaction
- Image validation (type and size)
- Upload process and feedback
- Global avatar updates
- Error handling

### **Scenario 12B: Profile Information Update**
Tests personal information form including:
- Name, email, phone updates
- Real-time validation
- Email verification badge
- Form state management
- Error handling

### **Scenario 12C: Password Change Flow**
Tests password security features including:
- Current password verification
- New password validation
- Password confirmation matching
- Visibility toggles
- Error scenarios

### **Scenario 12D: Account Status and Management**
Tests account information display including:
- Account status badge
- Connected services status
- Danger zone presentation
- Account deletion confirmation
- Data loss warnings

### **Scenario 12E: Profile Settings Page Layout**
Tests overall page organization including:
- Section structure
- Visual hierarchy
- Card layout and sizing
- Responsive design
- Navigation flow

### **Scenario 12F: Profile Settings End-to-End Flow**
Tests complete workflow including:
- Multiple profile updates
- Data persistence
- Global UI synchronization
- Session management
- User experience consistency

---

## 🎯 Testing Coverage

Each scenario includes:
- **Goal**: What the test verifies
- **Steps**: Detailed actions to perform
- **Expected**: Correct behavior description
- **Watch For**: Common issues and edge cases

---

## 📝 Key Testing Points

### Avatar Upload
- ✅ File type validation (JPEG, PNG, GIF, WebP)
- ✅ File size limit (2MB)
- ✅ Upload progress feedback
- ✅ Global avatar updates
- ✅ Error handling

### Personal Information
- ✅ Real-time validation
- ✅ Email uniqueness
- ✅ Email verification status
- ✅ Phone number format
- ✅ Form state management
- ✅ Success feedback

### Password Change
- ✅ Current password verification
- ✅ Password strength requirements
- ✅ Confirmation matching
- ✅ Visibility toggles
- ✅ Form clearing on success
- ✅ Security feedback

### Account Management
- ✅ Status display
- ✅ Connected services
- ✅ Danger zone visibility
- ✅ Deletion confirmation
- ✅ Data loss warnings
- ✅ Cancel safety

### Page Layout
- ✅ Section organization
- ✅ Visual hierarchy
- ✅ Responsive design
- ✅ Card consistency
- ✅ Navigation clarity

### End-to-End
- ✅ Multiple updates
- ✅ Data persistence
- ✅ Global synchronization
- ✅ Session handling
- ✅ User experience flow

---

## 🔍 Edge Cases Covered

### File Upload
- Invalid file types
- Files exceeding size limit
- Network failures during upload
- Concurrent upload attempts

### Form Validation
- Invalid email formats
- Duplicate emails
- Weak passwords
- Mismatched passwords
- Missing required fields

### Error Scenarios
- Incorrect current password
- Network timeouts
- Server errors
- Validation failures
- Permission issues

### UI States
- Loading states
- Success states
- Error states
- Disabled states
- Empty states

---

## 🚀 How to Use These Scenarios

### For Manual Testing:
1. Start with **Scenario 12E** to verify page layout
2. Test each feature individually (12A-12D)
3. Complete with **Scenario 12F** for end-to-end flow
4. Use "Watch For" sections to catch common issues

### For QA Checklist:
- Each scenario can be checked off independently
- "Expected" items serve as acceptance criteria
- "Watch For" items highlight regression risks

### For Bug Reports:
- Reference specific scenario numbers
- Use "Expected" vs "Actual" format
- Include "Watch For" items as context

---

## 📊 Integration with Existing Tests

The new scenarios fit into the existing structure:

```
Scenario 1-11: Existing Merchant UX Tests
├─ Navigation and Setup
├─ Store Management
└─ Workspace Features

Scenario 12: Store Settings (existing)
└─ Scenario 12A-F: Profile Settings (NEW)
   ├─ 12A: Avatar Upload
   ├─ 12B: Profile Info
   ├─ 12C: Password Change
   ├─ 12D: Account Status
   ├─ 12E: Page Layout
   └─ 12F: End-to-End

Scenario 13-15: Workflow and Navigation
```

---

## 🎨 Testing Environment

### Prerequisites:
- Frontend running on `http://localhost:3001`
- Backend running on `http://localhost:8000`
- Test merchant account with active store
- Test images for avatar upload (<2MB)
- Browser: Chromium with DevTools open

### Test Data Needed:
- Valid test email addresses
- Test passwords meeting requirements
- Sample profile pictures (various formats/sizes)
- Invalid test files (wrong type, too large)

---

## ✅ Verification Checklist

Before marking testing complete, verify:

- [ ] All 6 new scenarios executed
- [ ] All "Expected" behaviors observed
- [ ] All "Watch For" items checked
- [ ] No console errors during testing
- [ ] No network request failures
- [ ] Browser history works correctly
- [ ] Changes persist after refresh
- [ ] Global UI updates correctly
- [ ] Responsive design tested
- [ ] Error handling verified

---

## 🐛 Common Issues to Watch For

### Avatar Upload
- ❌ Upload spinner doesn't stop
- ❌ Avatar doesn't update globally
- ❌ No validation for file type/size
- ❌ Error messages not clear

### Forms
- ❌ Save button enabled with invalid data
- ❌ No visual feedback on save
- ❌ Form doesn't clear after success
- ❌ Validation messages missing or unclear

### Password
- ❌ Passwords visible by default
- ❌ Toggle doesn't work
- ❌ Requirements not communicated
- ❌ Form doesn't clear after change

### Account
- ❌ Delete button without confirmation
- ❌ Weak warning language
- ❌ No data loss warning
- ❌ Accidental deletion possible

### Layout
- ❌ Sections out of order
- ❌ Missing separators
- ❌ Inconsistent card sizes
- ❌ Broken responsive layout

---

## 📝 Test Report Template

```markdown
## Profile Settings Test Report

**Date**: [Date]
**Tester**: [Name]
**Environment**: [localhost/staging/production]
**Browser**: Chromium [version]

### Scenario Results:
- [ ] 12A: Avatar Upload - PASS/FAIL
- [ ] 12B: Profile Info - PASS/FAIL
- [ ] 12C: Password Change - PASS/FAIL
- [ ] 12D: Account Status - PASS/FAIL
- [ ] 12E: Page Layout - PASS/FAIL
- [ ] 12F: End-to-End - PASS/FAIL

### Issues Found:
1. [Issue description]
2. [Issue description]

### Notes:
[Additional observations]
```

---

## 🎯 Next Steps

After manual testing completion:
1. Document any bugs found
2. Create bug reports with scenario references
3. Re-test after fixes
4. Consider automation for critical paths
5. Update scenarios if features change

---

**Status**: ✅ Testing scenarios documented and ready for use  
**Location**: `docs/testing/MERCHANT_UX_MANUAL_CHROMIUM_SCENARIOS.md`  
**Scenarios Added**: 6 new profile settings scenarios (12A-12F)
