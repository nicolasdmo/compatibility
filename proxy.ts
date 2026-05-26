import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Auth proxy — refreshes the Supabase session cookie on every navigation.
 * Without this, expired sessions persist and the user looks logged-out.
 *
 * Renamed from `middleware.ts` per Next.js 16 file convention (proxy.ts).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  // Touching `getUser` triggers the cookie refresh if needed.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Match everything except _next, image optimization, static files, and webhooks
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/webhook).*)',
  ],
};
