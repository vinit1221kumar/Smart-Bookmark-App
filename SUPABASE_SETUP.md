# 📊 Supabase Setup Guide

Complete guide for setting up your Supabase database, authentication, and security policies.

## 🗄️ Database Setup

### Step 1: Create the Bookmarks Table

Go to your Supabase project's **SQL Editor** and run:

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
\`\`\`

### Step 2: Create Indexes

Improve query performance with indexes:

\`\`\`sql
-- Index for filtering by user
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);

-- Index for sorting by creation date
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
\`\`\`

### Step 3: Enable Row Level Security

\`\`\`sql
-- Enable RLS on bookmarks table
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
\`\`\`

## 🔒 Row Level Security (RLS) Policies

### Why RLS?

Row Level Security ensures users can only access their own data at the database level, even if client-side code is compromised.

### Create RLS Policies

\`\`\`sql
-- Policy: Users can SELECT only their own bookmarks
CREATE POLICY "Users can view own bookmarks"
ON bookmarks FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can INSERT only their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
ON bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE only their own bookmarks
CREATE POLICY "Users can update own bookmarks"
ON bookmarks FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can DELETE only their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
ON bookmarks FOR DELETE
USING (auth.uid() = user_id);
\`\`\`

### Verify RLS Policies

Go to **Database → Tables → bookmarks → Policies** to see all active policies.

## 🔄 Database Functions

### Increment Opens Counter

Create a secure function to increment the opens counter:

\`\`\`sql
CREATE OR REPLACE FUNCTION increment_opens(bookmark_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE bookmarks
  SET opens = opens + 1
  WHERE id = bookmark_id
    AND user_id = auth.uid(); -- Security: only owner can increment
END;
$$;
\`\`\`

## 📡 Enable Realtime

### Step 1: Enable Replication

1. Go to **Database → Replication**
2. Find the `bookmarks` table
3. Toggle **Realtime** to ON
4. Save changes

### Step 2: Configure Realtime Filters (Optional)

For better performance, you can configure filters in your Supabase dashboard:

- Go to **Database → Replication → bookmarks**
- Configure filters if needed (we filter by user_id in the app)

## 🔐 Authentication Setup

### Google OAuth Provider

#### Step 1: Get Google Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Name:** Smart Bookmark App
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (development)
     - `https://your-domain.vercel.app` (production)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback`
     - `https://your-domain.vercel.app/api/auth/callback`
     - Your Supabase callback URL (see below)

#### Step 2: Configure Supabase

1. Go to **Authentication → Providers** in Supabase
2. Find **Google** and enable it
3. Enter your **Client ID** and **Client Secret**
4. Copy the **Callback URL** provided by Supabase
5. Add this callback URL to your Google OAuth configuration
6. Save changes

#### Step 3: Configure URL Settings

Go to **Authentication → URL Configuration**:

- **Site URL:** `https://your-domain.vercel.app` (or localhost for dev)
- **Redirect URLs:** Add both development and production URLs

## 🧪 Testing Your Setup

### Test Database Connection

\`\`\`sql
-- Test: Check if table exists
SELECT * FROM bookmarks LIMIT 1;

-- Test: Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'bookmarks';
-- Should return: rowsecurity = true

-- Test: Check policies exist
SELECT * FROM pg_policies WHERE tablename = 'bookmarks';
-- Should return 4 policies (SELECT, INSERT, UPDATE, DELETE)
\`\`\`

### Test Authentication

1. Run your app: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign in with Google"
4. Authorize the app
5. You should be redirected to the dashboard

### Test RLS Policies

Try accessing data from the SQL Editor while authenticated:

\`\`\`sql
-- This should only return YOUR bookmarks
SELECT * FROM bookmarks;

-- Try to insert a bookmark for another user (should fail)
INSERT INTO bookmarks (user_id, title, url)
VALUES ('00000000-0000-0000-0000-000000000000', 'Test', 'https://test.com');
-- Expected: new row violates row-level security policy
\`\`\`

## 📊 Monitoring & Optimization

### Check Table Size

\`\`\`sql
SELECT 
  pg_size_pretty(pg_total_relation_size('bookmarks')) as total_size;
\`\`\`

### Check Index Usage

\`\`\`sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE tablename = 'bookmarks'
ORDER BY idx_scan DESC;
\`\`\`

### Monitor Active Connections

Go to **Database → Connection Pooling** to monitor connections.

## 🚨 Common Issues

### Issue: "Row Level Security" errors

**Solution:** Ensure RLS policies are created and auth.uid() returns a valid user ID.

\`\`\`sql
-- Check current user
SELECT auth.uid();
\`\`\`

### Issue: Realtime not working

**Solutions:**
1. Verify replication is enabled for the table
2. Check that the table exists in the Replication list
3. Restart your development server

### Issue: OAuth redirect fails

**Solutions:**
1. Double-check redirect URIs match exactly (including http/https)
2. Ensure Google OAuth credentials are correct
3. Check Site URL in Supabase settings
4. Verify callback URLs are added to Google Console

## 🔧 Advanced Configuration

### Enable Soft Deletes (Optional)

\`\`\`sql
-- Add deleted_at column
ALTER TABLE bookmarks ADD COLUMN deleted_at TIMESTAMPTZ;

-- Update policies to exclude soft-deleted items
DROP POLICY IF EXISTS "Users can view own bookmarks" ON bookmarks;

CREATE POLICY "Users can view own bookmarks"
ON bookmarks FOR SELECT
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Create soft delete function
CREATE OR REPLACE FUNCTION soft_delete_bookmark(bookmark_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE bookmarks
  SET deleted_at = NOW()
  WHERE id = bookmark_id
    AND user_id = auth.uid()
    AND deleted_at IS NULL;
END;
$$;
\`\`\`

### Add Full-Text Search (Optional)

\`\`\`sql
-- Add tsvector column for full-text search
ALTER TABLE bookmarks ADD COLUMN search_vector tsvector;

-- Create trigger to update search vector
CREATE OR REPLACE FUNCTION bookmarks_search_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.url, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookmarks_search_update
BEFORE INSERT OR UPDATE ON bookmarks
FOR EACH ROW EXECUTE FUNCTION bookmarks_search_trigger();

-- Create index for search
CREATE INDEX idx_bookmarks_search ON bookmarks USING GIN(search_vector);
\`\`\`

## 📈 Best Practices

1. **Always use RLS** - Never disable it in production
2. **Index foreign keys** - Improves join performance
3. **Monitor query performance** - Use Supabase dashboard
4. **Backup regularly** - Enable Point-in-Time Recovery
5. **Use connection pooling** - For production at scale

## 🔗 Useful Links

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

**Setup Complete! 🎉** Your Supabase backend is now ready for production.
