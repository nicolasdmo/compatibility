import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth callback target.
 *
 * Supabase's OAuth flow redirects here with a `?code=...` query param.
 * We exchange the code for a session (which sets the auth cookie) and
 * then redirect to whatever the caller originally wanted.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/crear';

  if (code) {
    const supabase     = await createClient();
    const { error }    = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('[auth/callback] exchange error:', error.message);
  }

  // Anything else — fall through to home with an error flag
  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
