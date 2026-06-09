# Frontend Error Handling for Session Domain Mismatch

## Before (Technical Error)
```json
{
    "success": false,
    "code": "IDENTITY_DOMAIN_MISMATCH",
    "message": "Session contamination detected: domain mismatch.",
    "errors": {}
}
```

**Problem**: User has no idea what this means or how to fix it.

---

## After (User-Friendly Error)
```json
{
    "success": false,
    "code": "IDENTITY_DOMAIN_MISMATCH",
    "message": "You are currently logged in as a customer, but this page requires merchant access. Please log out and sign in with the correct account type.",
    "logoutUrl": "http://localhost:8000/api/v1/auth/logout",
    "action": "logout_required",
    "errors": {}
}
```

**Solution**: Clear message + actionable data for automated handling.

---

## Frontend Implementation Example

### Option 1: Axios Interceptor (Automatic Handling)
```javascript
// axios-config.js
import axios from 'axios';

axios.interceptors.response.use(
  response => response,
  async error => {
    const { data } = error.response || {};
    
    if (data?.code === 'IDENTITY_DOMAIN_MISMATCH' && data?.action === 'logout_required') {
      // Auto-logout user
      try {
        await axios.post(data.logoutUrl);
      } catch (logoutError) {
        console.error('Logout failed:', logoutError);
      }
      
      // Show friendly message
      alert(data.message);
      
      // Redirect to login
      window.location.href = '/login';
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);
```

### Option 2: Manual Handling in Component
```javascript
// MerchantDashboard.jsx
const fetchMerchantData = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/proxy?endpoint=/api/v1/merchant/me');
    const data = await response.json();
    
    if (!data.success && data.code === 'IDENTITY_DOMAIN_MISMATCH') {
      // Handle domain mismatch
      if (data.logoutUrl && data.action === 'logout_required') {
        // Show user-friendly message
        setError({
          title: 'Wrong Account Type',
          message: data.message,
          action: 'logout'
        });
        
        // Optional: Auto-redirect to correct login
        setTimeout(() => {
          window.location.href = '/merchant/login';
        }, 3000);
      }
      return;
    }
    
    setMerchantData(data);
  } catch (error) {
    console.error('Failed to fetch merchant data:', error);
  }
};
```

### Option 3: Global Error Handler (React Context)
```javascript
// ErrorContext.jsx
import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const handleApiError = async (error) => {
    if (error?.code === 'IDENTITY_DOMAIN_MISMATCH' && error?.action === 'logout_required') {
      // Show toast/notification
      toast.error(error.message, { duration: 5000 });
      
      // Auto-logout
      if (error.logoutUrl) {
        await fetch(error.logoutUrl, { method: 'POST' });
      }
      
      // Clear local state
      localStorage.clear();
      
      // Redirect to login
      navigate('/login', { 
        state: { 
          reason: 'domain_mismatch',
          message: error.message 
        }
      });
      
      return true; // Error handled
    }
    
    return false; // Not handled
  };
  
  return (
    <ErrorContext.Provider value={{ handleApiError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorHandler = () => useContext(ErrorContext);
```

---

## User Experience Flow

### Before:
1. User (logged in as customer) clicks merchant dashboard
2. Gets 403 with cryptic error
3. Confused, tries again
4. Still fails
5. Gives up or contacts support

### After:
1. User (logged in as customer) clicks merchant dashboard
2. Gets clear error: "You are currently logged in as a customer, but this page requires merchant access"
3. Auto-logout happens
4. Redirected to correct login page
5. Logs in with correct account type
6. Success!

---

## Benefits

✅ **Automated Recovery**: Frontend can auto-logout and redirect  
✅ **Clear Communication**: User understands the problem  
✅ **Better DX**: Developers can handle this error programmatically  
✅ **Reduced Support Tickets**: Users can self-resolve  
✅ **Consistent UX**: Same error handling across all frontends
