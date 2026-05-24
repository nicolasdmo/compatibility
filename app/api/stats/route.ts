import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // refresh every minute at most

/**
 * Global stats for the homepage live counter.
 * Returns total challenges + total attempts (single round trip each).
 */
export async function GET() {
  try {
    const db = getSupabaseAdmin();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [{ count: challenges }, { count: attempts }] = await Promise.all([
      (db as any).from('challenges').select('id', { count: 'exact', head: true }),
      (db as any).from('attempts').select('id', { count: 'exact', head: true }),
    ]);

    return NextResponse.json(
      {
        challenges: challenges ?? 0,
        attempts:   attempts   ?? 0,
      },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    console.error('[api/stats] error:', err);
    return NextResponse.json({ challenges: 0, attempts: 0 }, { status: 200 });
  }
}
