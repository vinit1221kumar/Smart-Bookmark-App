import { createServerClient } from '@supabase/ssr';
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
      // Create response object to capture cookies
      let response = NextResponse.redirect(new URL('/dashboard', request.url));

      // Create Supabase client with request/response cookie API (like middleware)
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      console.log('[Callback] Exchanging code for session...');
      
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        console.log('[Callback] ✓ Code exchanged successfully');
        
        // Verify session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        console.log('[Callback] Session verification:', { 
          hasSession: !!session, 
          userEmail: session?.user?.email 
        });
        
        if (session) {
          console.log('[Callback] ✓ Session verified, redirecting to /dashboard with cookies set');
          // Return response with cookies set
          return response;
        } else {
          console.error('[Callback] Session verification failed');
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
  console.log('[Callback] ✗ Callback failed, redirecting to login');
  return NextResponse.redirect(
    new URL('/login?error=auth_failed', request.url)
  );
}
