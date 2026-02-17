# 🎯 Quick Start Guide

Get your Smart Bookmark App running in **5 minutes**!

## 📦 Step 1: Install Dependencies (1 min)

\`\`\`bash
npm install
\`\`\`

## 🗄️ Step 2: Set Up Supabase (2 min)

1. **Create Project**: Go to [supabase.com](https://supabase.com) → New Project
2. **Run SQL**: Copy and paste this into SQL Editor:

\`\`\`sql
-- Create table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  opens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookmarks" ON bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Create function
CREATE OR REPLACE FUNCTION increment_opens(bookmark_id UUID) RETURNS void AS $$
BEGIN
  UPDATE bookmarks SET opens = opens + 1 WHERE id = bookmark_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

3. **Enable Realtime**: Database → Replication → Enable `bookmarks`

## 🔐 Step 3: Configure Google OAuth (1 min)

1. **Google Console**: [console.cloud.google.com](https://console.cloud.google.com)
   - APIs & Services → Credentials → Create OAuth Client ID
   - Add redirect: `http://localhost:3000/api/auth/callback`
   - Copy Client ID & Secret

2. **Supabase Auth**: Authentication → Providers → Google
   - Paste Client ID & Secret
   - Save

## ⚙️ Step 4: Environment Variables (30 sec)

Create `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

Get these from: Supabase Project Settings → API

## 🚀 Step 5: Run! (30 sec)

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## ✅ Verify It Works

1. Click "Sign in with Google"
2. Authorize the app
3. Add a bookmark
4. Open in two tabs (see real-time sync!)
5. Toggle dark mode

---

## 🐛 Troubleshooting

**"Invalid redirect URI"**
- Add exact redirect URI to Google Console
- Restart dev server

**"Row Level Security" error**
- Verify RLS policies were created
- Check user is authenticated

**Environment variables not working**
- Restart dev server after changing `.env.local`
- Verify no typos in variable names

---

## 📚 Next Steps

- Read [README.md](./README.md) for detailed documentation
- See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for advanced database setup
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to deploy

---

**Need help?** Open an issue or check the documentation files!

**Happy bookmarking! 🔖**
