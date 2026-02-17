import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard'];
const AUTH_ROUTES = ['/login', '/auth/callback'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Processing: ${pathname}`);

  // Skip middleware for public routes and static files
  if (
    pathname === '/' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/favicon')
  ) {
    console.log(`[Middleware] Skipping public route: ${pathname}`);
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(`[Middleware] Auth check - ${pathname}: user=${!!user}, userEmail=${user?.email || 'none'}`);

    // Protect dashboard routes
    if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
      if (!user) {
        console.log(`[Middleware] ✗ Blocking ${pathname} - user not authenticated, redirecting to /login`);
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      } else {
        console.log(`[Middleware] ✓ Allowing ${pathname} - user authenticated`);
      }
    }

    // Redirect authenticated users away from login
    if (AUTH_ROUTES.includes(pathname) && user) {
      console.log(`[Middleware] Redirecting authenticated user from ${pathname} to /dashboard`);
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  } catch (err) {
    console.error('[Middleware] Error:', err.message);
    // Continue anyway - might be missing env vars
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
