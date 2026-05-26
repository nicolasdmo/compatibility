'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client.
 * Used in client components for sign-in / sign-out / reading session.
 *
 * Reads from NEXT_PUBLIC env vars so the browser can connect.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
