import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

type ChallengeRow = {
  id:            string;
  creator_name:  string;
  archetype:     string;
  shortcode:     string;
  created_at:    string;
};

type AttemptCount = {
  challenge_id: string;
  count:        number;
};

/**
 * Public leaderboard — top creators by attempt count.
 * Anonymous-friendly: shows first name only.
 */
export async function GET() {
  try {
    const db = getSupabaseAdmin();

    // Fetch all challenges
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawChallenges } = await (db as any)
      .from('challenges')
      .select('id, creator_name, archetype, shortcode, created_at');

    const challenges = (rawChallenges as ChallengeRow[] | null) ?? [];
    if (challenges.length === 0) return NextResponse.json({ ranking: [] });

    // Fetch attempt counts per challenge
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawAttempts } = await (db as any)
      .from('attempts')
      .select('challenge_id, score');

    const attempts = (rawAttempts as Array<{ challenge_id: string; score: number }> | null) ?? [];

    // Aggregate by challenge_id
    const counts = new Map<string, { count: number; avg: number; total: number }>();
    for (const a of attempts) {
      const cur = counts.get(a.challenge_id) ?? { count: 0, avg: 0, total: 0 };
      cur.count++;
      cur.total += a.score;
      cur.avg = cur.total / cur.count;
      counts.set(a.challenge_id, cur);
    }

    // Build ranking
    const ranking = challenges
      .map((c) => {
        const stats = counts.get(c.id) ?? { count: 0, avg: 0 };
        return {
          name:       c.creator_name.split(' ')[0], // first name only
          archetype:  c.archetype,
          shortcode:  c.shortcode,
          attempts:   stats.count,
          avgScore:   Math.round(stats.avg * 10) / 10,
          createdAt:  c.created_at,
        };
      })
      .filter((c) => c.attempts > 0)        // only challenges with at least 1 attempt
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 20);                         // top 20

    return NextResponse.json(
      { ranking },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    console.error('[api/ranking] error:', err);
    return NextResponse.json({ ranking: [] }, { status: 200 });
  }
}
