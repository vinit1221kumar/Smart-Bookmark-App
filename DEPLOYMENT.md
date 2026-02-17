# 🚀 Deployment Guide

Complete guide for deploying your Smart Bookmark App to production on Vercel.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ Supabase project set up with database schema
- ✅ Google OAuth credentials configured
- ✅ All environment variables ready
- ✅ Code pushed to GitHub repository
- ✅ Tested app locally

## 🌐 Deploy to Vercel

### Option 1: Quick Deploy (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   \`\`\`

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **"New Project"**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   In Vercel dashboard, add these variables:
   
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   \`\`\`

4. **Deploy**
   - Click **"Deploy"**
   - Wait for build to complete (2-3 minutes)
   - Your app is live! 🎉

### Option 2: Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts to configure project
\`\`\`

## 🔧 Post-Deployment Configuration

### 1. Update Google OAuth Redirect URIs

Go to [Google Cloud Console](https://console.cloud.google.com):

1. Navigate to **APIs & Services → Credentials**
2. Edit your OAuth 2.0 Client ID
3. Add production redirect URI:
   - `https://your-app.vercel.app/api/auth/callback`
4. Add to authorized JavaScript origins:
   - `https://your-app.vercel.app`
5. Save changes

### 2. Update Supabase Auth Settings

In Supabase dashboard:

1. Go to **Authentication → URL Configuration**
2. Update **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/api/auth/callback`
   - `https://your-app.vercel.app/**` (wildcard for all routes)
4. Save changes

### 3. Configure Custom Domain (Optional)

In Vercel:

1. Go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update all OAuth and Supabase URLs to use custom domain

## 🧪 Test Production Deployment

1. **Visit your app**: `https://your-app.vercel.app`
2. **Test authentication**:
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Verify redirect to dashboard
3. **Test bookmarks**:
   - Add a bookmark
   - Delete a bookmark
   - Open in new tab
   - Copy link
4. **Test real-time sync**:
   - Open app in two different tabs
   - Add bookmark in one tab
   - Verify it appears in the other tab
5. **Test dark mode**:
   - Toggle theme
   - Refresh page (should persist)

## 📊 Vercel Configuration

### vercel.json (Optional Advanced Config)

Create `vercel.json` in root directory:

\`\`\`json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
\`\`\`

### Environment Variables Management

**Development vs Production:**

- Development: `.env.local` (not committed)
- Production: Vercel dashboard environment variables

**Best Practices:**
- Never commit `.env.local` to git
- Use different Supabase projects for dev/prod (optional)
- Rotate keys periodically

## 🔒 Security Checklist

Before going live:

- ✅ RLS policies enabled on all tables
- ✅ HTTPS enforced (Vercel does this automatically)
- ✅ Environment variables secured
- ✅ CORS configured in Supabase
- ✅ Rate limiting enabled (if needed)
- ✅ Input validation on all forms
- ✅ Security headers configured

## 📈 Performance Optimization

### Enable Caching

Next.js automatically handles caching, but verify:

\`\`\`typescript
// In your Server Components
export const revalidate = 60 // Revalidate every 60 seconds
\`\`\`

### Monitor Performance

1. **Vercel Analytics** (Optional)
   \`\`\`bash
   npm install @vercel/analytics
   \`\`\`
   
   Add to `app/layout.tsx`:
   \`\`\`typescript
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   \`\`\`

2. **Vercel Speed Insights** (Optional)
   \`\`\`bash
   npm install @vercel/speed-insights
   \`\`\`

### Optimize Images

Images from Google Favicons are already optimized. For custom images:

\`\`\`typescript
import Image from 'next/image'

<Image 
  src="/image.png" 
  width={500} 
  height={500} 
  alt="Description"
/>
\`\`\`

## 🔄 Continuous Deployment

### Auto-Deploy on Push

Vercel automatically deploys when you push to GitHub:

\`\`\`bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically builds and deploys
\`\`\`

### Preview Deployments

Every pull request gets a unique preview URL:
- Branch: `feature-branch` → `https://your-app-git-feature-branch.vercel.app`

### Production vs Preview

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from all other branches

## 📱 Configure for Different Environments

### Multiple Environments

Create separate Vercel projects for:
- **Development**: Connected to `dev` branch
- **Staging**: Connected to `staging` branch  
- **Production**: Connected to `main` branch

Each can have different environment variables.

## 🐛 Troubleshooting Deployment

### Build Fails

**Check build logs** in Vercel dashboard:

Common issues:
- Missing environment variables
- TypeScript errors
- Missing dependencies

**Solutions:**
\`\`\`bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit
\`\`\`

### OAuth Not Working

**Symptoms:** Redirect fails or infinite loop

**Solutions:**
1. Verify redirect URIs match exactly
2. Check NEXT_PUBLIC_SITE_URL is correct
3. Ensure Site URL in Supabase matches
4. Clear cookies and try again

### Realtime Not Syncing

**Symptoms:** Changes don't appear instantly

**Solutions:**
1. Verify Supabase Realtime is enabled
2. Check browser console for WebSocket errors
3. Verify RLS policies allow reads
4. Check network tab for subscription status

### 500 Internal Server Error

**Check Vercel Function Logs:**
1. Go to Vercel dashboard
2. Click **Functions** tab
3. View error logs

**Common causes:**
- Invalid Supabase credentials
- Database connection issues
- Server Action errors

## 🔍 Monitoring & Logging

### Vercel Logs

View real-time logs:
\`\`\`bash
vercel logs <deployment-url>
\`\`\`

### Supabase Logs

Monitor database activity:
1. Go to **Database → Logs**
2. View API requests, errors, and slow queries

### Error Tracking (Optional)

Integrate Sentry for error tracking:

\`\`\`bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
\`\`\`

## 📊 Analytics & Metrics

### Track Key Metrics

Monitor:
- User sign-ups
- Bookmarks created
- Page load times
- Error rates
- Real-time connection status

### Google Analytics (Optional)

Add Google Analytics to track usage:

\`\`\`typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

## 🚀 Going to Production Checklist

- ✅ App deployed and accessible
- ✅ Custom domain configured (optional)
- ✅ OAuth working in production
- ✅ Database operations working
- ✅ Real-time sync functioning
- ✅ Dark mode persisting
- ✅ Mobile responsive tested
- ✅ Performance optimized
- ✅ Error tracking enabled
- ✅ Monitoring set up
- ✅ Backup strategy in place

## 🎯 Post-Launch

### 1. Monitor Performance

First 48 hours:
- Watch error rates
- Monitor response times
- Check user sign-ups
- Verify real-time sync
- Test on different devices

### 2. Collect Feedback

- Create feedback form
- Monitor social media
- Track user behavior
- Identify pain points

### 3. Iterate

- Fix critical bugs immediately
- Plan feature improvements
- Optimize based on metrics
- Update documentation

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Vercel Support](https://vercel.com/support)

## 🎉 You're Live!

Congratulations! Your Smart Bookmark App is now in production.

**Share it with the world:**
- Tweet about it
- Share on LinkedIn
- Post on Reddit
- Add to your portfolio

---

**Need help?** Open an issue on GitHub or reach out to the community.

**Happy deploying! 🚀**
