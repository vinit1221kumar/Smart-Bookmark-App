import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Verify session was created
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session) {
        // Redirect to dashboard - the middleware will allow this
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    console.error('Callback error:', error);
  }

  // Return error page
  return NextResponse.redirect(
    new URL('/login?error=auth_failed', request.url)
  );
}
