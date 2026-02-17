import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  console.log('[Callback] OAuth callback received:', { hasCode: !!code, hasError: !!error });

  if (error) {
    console.error('[Callback] OAuth error:', error, searchParams.get('error_description'));
    return NextResponse.redirect(
      new URL(`/login?error=${error}`, request.url)
    );
  }

  if (code) {
    try {
      const supabase = await createClient();
      console.log('[Callback] Exchanging code for session...');
      
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        // Verify session was created
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        console.log('[Callback] Session verification:', { hasSession: !!session, userEmail: session?.user?.email });
        
        if (session) {
          console.log('[Callback] ✓ Session created, redirecting to /dashboard');
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          console.error('[Callback] Session was not created after exchange');
        }
      } else {
        console.error('[Callback] Exchange error:', exchangeError);
      }
    } catch (err) {
      console.error('[Callback] Unexpected error:', err);
    }
  } else {
    console.error('[Callback] No code provided in request');
  }

  // Return error page
  console.log('[Callback] Redirecting to login with error');
  return NextResponse.redirect(
    new URL('/login?error=auth_failed', request.url)
  );
}
