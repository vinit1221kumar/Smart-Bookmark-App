# 🚀 Smart Bookmark App

A production-ready bookmark management application built with **Next.js 14**, **Supabase**, and **TypeScript**. Features real-time synchronization, Google OAuth authentication, and a beautiful dark mode UI.

![Smart Bookmark App](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)

## ✨ Features

### Core Features
- 🔐 **Google OAuth Authentication** - Secure login with Supabase Auth
- 📚 **Bookmark Management** - Add, delete, and organize bookmarks
- 🔄 **Real-time Sync** - Changes sync instantly across all devices
- 🔒 **Row Level Security** - Database-level security with RLS policies
- 🌐 **Protected Routes** - Middleware-based authentication

### Premium Features
- 🔍 **Instant Search** - Filter bookmarks in real-time
- 🎨 **Dark/Light Mode** - Beautiful theme switching
- 🖼️ **Auto Favicons** - Automatic website icons
- 📋 **Copy to Clipboard** - One-click link copying
- 📊 **Open Counter** - Track bookmark usage
- ⚡ **Optimistic UI** - Instant feedback on actions
- ⌨️ **Keyboard Shortcuts** - Press "N" to add bookmark
- 🎭 **Smooth Animations** - Framer Motion powered
- 📱 **Fully Responsive** - Mobile-first design

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase (Postgres + Auth + Realtime)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** Sonner

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- A **Supabase** account ([sign up here](https://supabase.com))
- **Google OAuth credentials** (we'll set this up)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd smart-bookmark-app
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

#### a) Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be provisioned

#### b) Create the Database Schema

1. Go to the **SQL Editor** in your Supabase dashboard
2. Run the following SQL:

\`\`\`sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  opens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
ON bookmarks FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
ON bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own bookmarks
CREATE POLICY "Users can update own bookmarks"
ON bookmarks FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
ON bookmarks FOR DELETE
USING (auth.uid() = user_id);

-- Function to increment opens counter
CREATE OR REPLACE FUNCTION increment_opens(bookmark_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE bookmarks
  SET opens = opens + 1
  WHERE id = bookmark_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

#### c) Enable Realtime

1. Go to **Database → Replication**
2. Enable replication for the `bookmarks` table

### 4. Set Up Google OAuth

#### a) Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://your-domain.com/api/auth/callback`
7. Copy your **Client ID** and **Client Secret**

#### b) Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication → Providers**
2. Enable **Google** provider
3. Paste your Google **Client ID** and **Client Secret**
4. Save changes

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Get these from Supabase Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Your site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 6. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

\`\`\`
smart-bookmark-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth group
│   │   ├── login/           # Login page
│   │   └── layout.tsx       # Auth layout
│   ├── dashboard/           # Protected dashboard
│   │   ├── page.tsx         # Main dashboard
│   │   └── loading.tsx      # Loading state
│   ├── api/auth/callback/   # OAuth callback
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── bookmark-card.tsx    # Bookmark card component
│   ├── bookmark-list.tsx    # List with real-time
│   ├── add-bookmark-form.tsx# Add bookmark form
│   ├── navbar.tsx           # Navigation bar
│   ├── theme-toggle.tsx     # Dark mode toggle
│   ├── empty-state.tsx      # Empty state
│   └── providers.tsx        # Context providers
├── lib/                     # Utilities & libraries
│   ├── supabase/           # Supabase clients
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   └── middleware.ts   # Middleware client
│   ├── actions.ts          # Server Actions
│   └── utils.ts            # Helper functions
├── types/                   # TypeScript types
│   └── database.ts         # Database types
├── middleware.ts           # Route protection
└── package.json            # Dependencies
\`\`\`

## 🔐 Security Features

- **Row Level Security (RLS)** - Database-level security
- **httpOnly Cookies** - Secure session storage
- **Input Validation** - Zod schema validation
- **Protected Routes** - Middleware authentication
- **CSRF Protection** - Built-in with Supabase

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.ts` to customize colors:

\`\`\`typescript
theme: {
  extend: {
    colors: {
      primary: 'hsl(your-color)',
      // ... more colors
    }
  }
}
\`\`\`

### Adding New Features

1. Create Server Action in `lib/actions.ts`
2. Add component in `components/`
3. Update types in `types/database.ts`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Connect your GitHub repository
3. Add environment variables
4. Deploy!

## 🐛 Troubleshooting

### Common Issues

**Authentication not working:**
- Verify Google OAuth credentials
- Check redirect URIs match exactly
- Ensure Supabase provider is enabled

**Bookmarks not syncing:**
- Verify RLS policies are created
- Check Realtime is enabled for bookmarks table
- Ensure user is authenticated

**Build errors:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📄 License

MIT License - feel free to use this project for learning or production!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Show Your Support

If you found this project helpful, please give it a star!

---

**Built with ❤️ using Next.js 14 and Supabase**
