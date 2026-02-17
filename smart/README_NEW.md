# 🚀 Smart Bookmark App

A production-ready bookmark manager built with modern web technologies. Manage your bookmarks in one place with real-time sync, Google OAuth authentication, and dark mode support.

## ✨ Features

### Core Features
- ✅ **Google OAuth Authentication** - Secure login with Google
- ✅ **Add/Delete Bookmarks** - Simple bookmark management
- ✅ **Real-time Sync** - Updates instantly across multiple tabs
- ✅ **Row Level Security** - Your bookmarks are private and secure
- ✅ **Dark/Light Mode** - App-wide theme support
- ✅ **Responsive Design** - Works perfectly on mobile and desktop

### Extra Features
- 🔍 **Smart Search** - Filter bookmarks by title or URL
- 🎯 **Auto Favicon** - Automatic favicon extraction from URLs
- 📋 **Copy Link Button** - One-click copy to clipboard
- ⚡ **Optimistic UI** - Instant feedback on actions
- 📊 **Open Counter** - Track how many times you opened each bookmark
- 🎨 **Smooth Animations** - Framer Motion animations throughout
- ⌨️ **Keyboard Shortcuts** - Press `Ctrl+N` to quickly add a bookmark
- 📱 **Mobile-first** - Fully responsive layout
- 💫 **Loading States** - Beautiful skeleton loaders

## 🛠️ Tech Stack

```
Frontend:       Next.js 16 (App Router)
Language:       JavaScript
Styling:        Tailwind CSS v4
Animations:     Framer Motion
Database:       Supabase (PostgreSQL)
Auth:           Supabase Auth + Google OAuth
Real-time:      Supabase Realtime
Deployment:     Vercel
```

## 📋 Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- A Supabase account (free tier works)
- A Google Cloud project for OAuth

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
cd smart
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your **Project URL** and **Anon Key**

#### Create Database Schema
1. In Supabase, go to **SQL Editor**
2. Create a new query and paste the contents of `src/lib/supabase/schemas.sql`
3. Run the query
4. Verify the `bookmarks` table is created with RLS policies enabled

#### Enable Google OAuth
1. In Supabase, go to **Authentication** → **Providers**
2. Enable **Google**
3. Add your Google OAuth credentials (see next section)

### 3. Set Up Google OAuth

#### Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create OAuth 2.0 Client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (local development)
   - `https://yourdomain.com/auth/callback` (production)
7. Copy **Client ID** and **Client Secret**

#### Add Credentials to Supabase
1. In Supabase, go to **Authentication** → **Providers** → **Google**
2. Paste your Google **Client ID** and **Client Secret**
3. Click **Save**

### 4. Configure Environment Variables

Create `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** The Google OAuth credentials are automatically handled by Supabase. Don't include them in .env.local

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Project Structure

```
src/
├── app/                          # App Router routes
│   ├── layout.js                # Root layout with providers
│   ├── page.js                  # Home redirect
│   ├── globals.css              # Global styles
│   ├── (auth)/
│   │   ├── layout.js            # Auth layout
│   │   ├── login/               # Login page
│   │   └── callback/            # OAuth callback handler
│   └── (dashboard)/
│       ├── layout.js            # Dashboard layout
│       └── dashboard/           # Main dashboard page
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── bookmarks/               # Bookmark-specific components
│   ├── navbar/                  # Navigation bar
│   ├── icons/                   # SVG icons
│   ├── layout/                  # Layout components
│   └── providers/               # Context providers
├── lib/
│   ├── supabase/                # Supabase client setup
│   ├── utils/                   # Utility functions
│   ├── hooks/                   # Custom React hooks
│   ├── contexts/                # Context providers
│   └── constants/               # Constants and config
├── types/                       # JSDoc type definitions
├── middleware.js                # Auth middleware
└── types/                       # Type definitions
```

## 🎯 Core Features Explained

### Authentication Flow
1. User clicks "Sign in with Google" on login page
2. Redirected to Google OAuth consent screen
3. After approval, redirected to `/auth/callback`
4. Session established and user redirected to `/dashboard`
5. Middleware protects `/dashboard` routes

### Real-time Updates
- Uses Supabase Realtime subscriptions
- When a bookmark is added/deleted/updated:
  - Database updates immediately
  - All subscribed clients get instant update
  - UI updates without page refresh
- Works across multiple tabs automatically

### Row Level Security
- Every user can only see/modify their own bookmarks
- Policies enforced at database level
- No data leakage between users
- SQL policies defined in `schemas.sql`

### Search & Filter
- Client-side filtering for instant results
- Searches both title and URL
- Debounced input for performance
- Case-insensitive matching

## 🔐 Security Best Practices

✅ **Implemented:**
- Never expose service role key (server-side only)
- Anon key used for client-side operations
- URLs validated before insertion
- XSS protection via React escaping
- CSRF tokens (Next.js built-in)
- Row Level Security on all tables
- Secure session cookies managed by Supabase

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.js` theme extension:
```js
colors: {
  light: { ... },
  dark: { ... }
}
```

### Modify UI Components
All components in `src/components/ui/` are customizable:
- Button variants
- Input styles
- Card designs
- Toast notifications

### Add New Features
1. Create component in appropriate folder
2. Use hooks from `lib/hooks/`
3. Add server actions if needed
4. Update types in `src/types/`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Google OAuth login works
- [ ] Can add bookmarks
- [ ] Can delete bookmarks
- [ ] Real-time sync across tabs
- [ ] Search filters bookmarks
- [ ] Dark mode toggles correctly
- [ ] Mobile layout responsive
- [ ] Copy link button works
- [ ] Keyboard shortcut (Ctrl+N) works
- [ ] Favicon displays correctly

## 📦 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
5. Deploy

### 3. Update Google OAuth
1. Add your Vercel URL to Google Cloud Console:
   - `https://yourdomain.vercel.app/auth/callback`
2. Update in Supabase Google provider settings

### 4. Test Production
- Test GitHub OAuth flow
- Verify bookmarks sync
- Test all features

## 🚨 Troubleshooting

### Issue: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Solution:** Check `.env.local` exists with correct values. Restart dev server.

### Issue: Google OAuth redirect fails
**Solution:** Verify callback URL in Google Cloud Console matches your app URL.

### Issue: Can't see bookmarks
**Solution:** Ensure Supabase schema is deployed correctly. Check RLS policies in Supabase dashboard.

### Issue: Real-time updates not working
**Solution:** Verify Realtime is enabled for `bookmarks` table in Supabase.

### Issue: Bookmarks table doesn't exist
**Solution:** Run the SQL from `src/lib/supabase/schemas.sql` in Supabase SQL Editor.

## 📖 API Reference

### useBookmarks Hook
```js
const { bookmarks, loading, addBookmark, deleteBookmark, incrementOpenCount } = 
  useBookmarks(userId);

// addBookmark(title, url, faviconUrl)
// deleteBookmark(id)
// incrementOpenCount(id)
```

### useAuth Hook
```js
const { user, session, loading, supabase } = useAuth();
```

### useTheme Hook
```js
const { theme, toggleTheme } = useTheme();
// theme: 'light' | 'dark'
```

### useToast Hook
```js
const { showSuccess, showError, showInfo, showWarning } = useToast();
// showSuccess(message, duration?)
```

## 📄 License

MIT - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check Next.js documentation

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
