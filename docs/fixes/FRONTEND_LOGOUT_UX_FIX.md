# Frontend Logout UX Fix - Domain Mismatch Error

## Problem
When users got a domain mismatch error, they saw:
```
Bootstrap Failed
You are currently logged in as a merchant, but this page requires platform access. 
Please log out and sign in with the correct account type.
```

**BUT:** There was no logout button! Users were stuck with only a "Retry" button that would fail again.

## Solution Implemented

### Backend (Already Done)
The API now returns:
```json
{
    "code": "IDENTITY_DOMAIN_MISMATCH",
    "message": "You are currently logged in as a merchant, but this page requires platform access...",
    "logoutUrl": "http://localhost:8000/api/v1/merchant/auth/logout",
    "action": "logout_required"
}
```

### Frontend (New Changes)

#### 1. Updated API Error Type
**File:** `src/types/api.ts`

Added new optional fields to `ApiError`:
```typescript
export interface ApiError {
  message: string;
  errors: Record<string, string[]>;
  status: number;
  code: string;
  redirect?: string;
  logoutUrl?: string;    // ← NEW: Logout endpoint URL
  action?: string;        // ← NEW: Machine-readable action flag
}
```

#### 2. Enhanced Bootstrap Error Handling
**File:** `src/components/providers/BootstrapProvider.tsx`

Now detects domain mismatch errors and shows a different UI:

```typescript
const isDomainMismatch = 
  bootstrapError.code === 'IDENTITY_DOMAIN_MISMATCH' || 
  bootstrapError.action === 'logout_required';
```

### New UX

#### Before:
```
┌─────────────────────────────────────┐
│       Bootstrap Failed              │
│                                     │
│  You are currently logged in as    │
│  a merchant, but this page         │
│  requires platform access...       │
│                                     │
│         [ Retry ]                   │
└─────────────────────────────────────┘
```
❌ User clicks "Retry" → Same error  
❌ No way to log out  
❌ User is stuck  

#### After:
```
┌─────────────────────────────────────┐
│      Wrong Account Type             │
│                                     │
│  You are currently logged in as    │
│  a merchant, but this page         │
│  requires platform access...       │
│                                     │
│  [ Retry ]  [ Log Out and Switch   │
│               Account ]             │
└─────────────────────────────────────┘
```
✅ Clear title: "Wrong Account Type"  
✅ Actionable button: "Log Out and Switch Account"  
✅ Clicking logout → calls API → clears session → redirects to login  
✅ User can fix the problem  

## What Happens When User Clicks "Log Out and Switch Account"

1. **Calls the logout URL** from the API response
   ```javascript
   await fetch(bootstrapError.logoutUrl, { 
     method: 'POST',
     credentials: 'include'
   });
   ```

2. **Clears local session** in the store
   ```javascript
   clearSession();
   clearDashboardClientStorage();
   ```

3. **Redirects to login** page
   ```javascript
   window.location.href = getLoginUrl(locale, pathname);
   ```

4. User can now **log in with the correct account type**

## Error Handling

If the logout API call fails:
- Still clears local session
- Still redirects to login
- User can recover by logging in again

## Files Modified

| File | Purpose | Changes |
|------|---------|---------|
| `src/types/api.ts` | API error type | Added `logoutUrl` and `action` fields |
| `src/components/providers/BootstrapProvider.tsx` | Bootstrap error UI | Special handling for domain mismatch with logout button |

## Testing

### Test Scenario
1. Log in as a merchant
2. Try to access a customer-only or platform-only page
3. See the "Wrong Account Type" error
4. Click "Log Out and Switch Account"
5. Verify you're logged out and redirected to login
6. Log in with the correct account type
7. Success!

### Expected Behavior
- ✅ Clear error message
- ✅ Visible logout button
- ✅ Logout works correctly
- ✅ Redirect to login page
- ✅ No more "stuck" users

## Benefits

### For Users
- ✅ Clear, actionable UI
- ✅ Can fix the problem themselves
- ✅ No confusion or frustration
- ✅ Self-service recovery

### For Product
- ✅ Reduced support tickets
- ✅ Better user experience
- ✅ Fewer abandoned sessions
- ✅ Professional error handling

### For Developers
- ✅ Consistent error handling pattern
- ✅ Reusable for other error types
- ✅ Clean separation of concerns
- ✅ Easy to test and maintain

## Future Enhancements

1. **Remember Original Destination**: After login, redirect back to the original page
2. **Smart Account Suggestion**: Show which account type is needed
3. **Quick Switch**: If user has multiple accounts, show account picker
4. **Analytics**: Track how often this error occurs to identify UX issues

## Status

✅ **Implemented and Ready for Testing**
