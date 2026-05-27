import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Auth proxy — refreshes the Supabase session cookie on every navigation.
 * Without this, expired sessions persist and the user looks logged-out.
 *
 * Renamed from `middleware.ts` per Next.js 16 file convention (proxy.ts).
 */
export async function proxy(request: NextRequest) {
  // Skip auth refresh for OG image routes — they never need a session
  if (request.nextUrl.pathname.includes('opengraph-image')) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Skip if env vars are missing (e.g. in CI or edge cases)
    if (!url || !key) return response;

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Touching `getUser` triggers the cookie refresh if needed.
    await supabase.auth.getUser();
  } catch {
    // If Supabase is unavailable, continue without session refresh
  }

  return response;
}

export const config = {
  matcher: [
    // Match everything except _next, static files, and webhooks
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/webhook).*)',
  ],
};
