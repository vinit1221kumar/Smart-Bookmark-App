# Login Flow & Authentication Testing Guide

## Overview
The Smart Bookmark App uses Supabase Authentication with Google OAuth. After successful login, users are automatically redirected to the dashboard.

## Auth Flow Sequence

### 1. **Login Page** (`/login`)
- User arrives at login page
- Displays "Sign in with Google" button
- Clicking button initiates OAuth flow via Supabase

### 2. **Google OAuth** (Handled by Supabase)
- User is redirected to Google login
- User authenticates with Google account
- Google redirects back to `/auth/callback?code=<auth_code>`

### 3. **Callback Handler** (`/auth/callback`)
- Server-side route processes OAuth code
- Exchanges code for session using `supabase.auth.exchangeCodeForSession(code)`
- Session is stored in cookies (secure, httpOnly)
- **Redirects to `/dashboard`**

### 4. **Middleware Protection** (`src/middleware.js`)
- Checks if user is authenticated (via session cookie)
- Protects `/dashboard` route - redirects unauthenticated users to `/login`
- Redirects authenticated users away from `/login` → `/dashboard`

### 5. **AuthContext Updates** (`src/lib/contexts/AuthContext.js`)
- On app load, fetches initial session
- Sets up `onAuthStateChange` listener
- Monitors for login/logout events
- Updates `user`, `session`, `loading` state

### 6. **Dashboard Navigation** (`src/app/page.js`)
- Home page checks if user is authenticated
- If user exists → redirects to `/dashboard`
- If no user → redirects to `/login`
- Shows loading spinner while checking auth status

## Key Integration Points

### Session Management
- **Initial Load**: AuthContext fetches session, onAuthStateChange listener set up
- **After Login**: Middleware redirect → AuthContext detects new session → updates state
- **Router Navigation**: Home and login pages respond to user state changes

### Why Redirect to Dashboard Works
1. User completes Google OAuth
2. Callback handler exchanges code for session ✓
3. Session stored in cookies (middleware can read it)
4. Redirect to `/dashboard` happens
5. Middleware checks cookies - user is authenticated ✓
6. /dashboard page renders successfully

## Configuration Required

### 1. Create Supabase Project
```
https://supabase.com/dashboard
- Create new project
- Go to Settings > API
- Copy Project URL and Anon Key
```

### 2. Set Up Environment Variables
```bash
# Create .env.local in z:\Smart-Bookmark-App\smart\
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configure Google OAuth in Supabase
```
Supabase Dashboard > Authentication > Providers > Google
1. Enable Google provider
2. Add OAuth credentials from Google Cloud Console
3. Set redirect URL: http://localhost:3000/auth/callback
```

### 4. Deploy Schema
```bash
# Execute SQL from src/lib/supabase/schemas.sql in Supabase SQL Editor
# Creates bookmarks table with RLS policies
```

## Testing Authentication Flow

### Test 1: Unauthenticated User
```
1. Open http://localhost:3000
2. Should redirect to /login automatically
3. Should show login page with "Sign in with Google" button
```

### Test 2: Successful Login (requires Supabase + Google OAuth)
```
1. Click "Sign in with Google"
2. Complete Google authentication
3. Should redirect to http://localhost:3000/dashboard
4. Should see "My Bookmarks" page
5. Should see navbar with user email
```

### Test 3: Session Persistence
```
1. Log in successfully
2. Refresh page
3. Should stay on dashboard (session restored from cookies)
4. User should remain logged in
```

### Test 4: Logout
```
1. Click user avatar in navbar
2. Click "Sign out"
3. Should redirect to /login
4. Session should be cleared
```

## Debugging Auth Issues

### Check Browser Console
```javascript
// Look for these console logs:
"Auth state changed: { event: '...', hasSession: true/false }"
```

### Check Cookies
```
DevTools > Application > Cookies > localhost:3000
Look for:
- sb-<project-id>-auth-token (session)
- sb-<project-id>-auth-token-code-verifier
- sb-<project-id>-auth-token.2 (refresh token)
```

### Monitor Network Requests
```
DevTools > Network
1. Click "Sign in with Google"
2. Watch for POST to /auth/callback
3. Should see redirect to /dashboard
```

### Check Middleware Execution
```
DevTools > Network > middleware route
Should show: 200 response (user allowed) or 307 redirect (auth check)
```

## Common Issues & Solutions

### Issue: Stuck on Login After OAuth
**Problem**: Callback completes but doesn't redirect to dashboard

**Solution**:
1. Check Supabase credentials in `.env.local`
2. Verify callback URL in Supabase matches: `http://localhost:3000/auth/callback`
3. Check browser console for errors
4. Verify cookies are being set (DevTools > Application > Cookies)

### Issue: Getting Logged Out After Refresh
**Problem**: Session lost when refreshing page

**Solution**:
1. Check if session cookie exists
2. Verify middleware is running (check network tab for 200 response)
3. Restart dev server: `npm run dev`
4. Clear browser cache and cookies

### Issue: Middleware Not Finding User
**Problem**: Middleware says user not authenticated even after login

**Solution**:
1. Verify middleware.js is in `src/` (not in app/)
2. Check matcher config in middleware exports
3. Ensure Supabase env vars are in `.env.local` (middleware needs them)
4. Restart dev server for env changes to take effect

## Architecture Diagram

```
User Browser
    ↓
GET /login  ← Home page redirects if not authenticated
    ↓
[Login Page] ← Shows "Sign in with Google"
    ↓
Click OAuth Button
    ↓
Google OAuth Flow ← Handled by Supabase
    ↓
POST /auth/callback?code=xxx
    ↓
[Callback Route] ← Server validates code with Supabase
    ↓
exchangeCodeForSession(code)
    ↓
Session stored in cookies (secure)
    ↓
Redirect to /dashboard
    ↓
[Middleware] ← Checks cookies, user is authenticated ✓
    ↓
[Dashboard Page]
    ↓
AuthContext detects session update
    ↓
User state updated → renders navbar with user email
```

## Files Involved

| File | Purpose |
|------|---------|
| `src/app/page.js` | Home redirect logic |
| `src/app/(auth)/login/page.js` | Login UI |
| `src/app/(auth)/callback/route.js` | OAuth code exchange |
| `src/middleware.js` | Route protection & auth checks |
| `src/lib/contexts/AuthContext.js` | Auth state management |
| `next.config.mjs` | Security headers |
| `.env.local` | Supabase credentials |

## Next Steps

1. **Create Supabase Project** - Get URL and Anon Key
2. **Configure Environment** - Copy to `.env.local`
3. **Set Up Google OAuth** - In Supabase dashboard
4. **Deploy Schema** - Run SQL script
5. **Test Flow** - Follow testing steps above
6. **Deploy to Vercel** - Update callback URL to production domain
