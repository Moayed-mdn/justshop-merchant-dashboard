# Testing Error Logging Fix

## How to Test

1. **Start the development server**
   ```bash
   cd laratenant-commerce
   npm run dev
   ```

2. **Navigate to a Marketing Page Edit Form**
   - Go to CMS Pages section
   - Click edit on any page
   - Or create a new page

3. **Trigger a Validation Error**
   
   Option A - Clear required fields:
   - Clear the title field
   - Try to save
   
   Option B - Create duplicate slug:
   - Use a slug that already exists
   - Try to save

4. **Check Console**

   You should now see detailed error output like:

   ```
   [ERROR] [2026-06-20T11:44:01.170Z] Failed to update marketing page {
     name: 'ApiError',
     message: 'Validation failed',
     status: 422,
     code: '422',
     errors: {
       title: ['The title field is required'],
       slug: ['The slug must already exist']
     },
     stack: 'ApiError: Validation failed\n    at toApiError...'
   }
   ```

   Instead of the previous empty object:
   ```
   [ERROR] [2026-06-20T11:44:01.170Z] Failed to update marketing page {}
   ```

## What to Verify

✅ Error message is visible and clear
✅ HTTP status code (422, 500, etc.) is shown
✅ Validation errors object is populated with field-specific errors
✅ Stack trace is present
✅ Toast notification shows user-friendly error message
✅ No empty `{}` objects in console

## Other Scenarios to Test

### 1. Network Error
- Turn off backend server
- Try to save a form
- Should see network-related error details

### 2. 500 Server Error
- If you can force a server error, do it
- Should see status 500 and error message

### 3. Authentication Error (401)
- Expire your session
- Try an API call
- Should see 401 error and auto-redirect to login

### 4. Permission Error (403)
- Try accessing a resource without permission
- Should see 403 error with details

## Expected Behavior

### Error Properties that Should Always Be Present
- `name`: 'ApiError'
- `message`: Human-readable error message
- `status`: HTTP status code (422, 500, etc.)
- `code`: Error code string
- `errors`: Object with field-level validation errors (for 422 errors)
- `stack`: Full stack trace

### Toast Messages
- Should still show user-friendly error messages
- Should not show technical details to users
- Should be translated if using i18n

## Troubleshooting

If you still see `{}`:

1. **Clear browser cache and reload**
2. **Check you're running the latest code**: `git status`
3. **Rebuild the app**: `npm run build && npm run dev`
4. **Check browser console for other errors**
5. **Verify the backend is returning proper error responses**

## Success Criteria

✅ All error properties are visible in console
✅ Developers can debug issues from console logs
✅ Users see friendly error messages
✅ Stack traces help identify error sources
✅ No empty objects or mysterious errors
