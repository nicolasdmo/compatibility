import Link from 'next/link';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';
import GradientOrbs from '@/components/GradientOrbs';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Ranking — ¿Cuánto me conocés?',
  description: 'Los retos más respondidos de todos los tiempos.',
};

type ChallengeRow = {
  id:            string;
  creator_name:  string;
  archetype:     string;
  shortcode:     string;
  created_at:    string;
};

const MEDALS = ['🥇', '🥈', '🥉'];

export default async function RankingPage() {
  const db = getSupabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawChallenges } = await (db as any)
    .from('challenges')
    .select('id, creator_name, archetype, shortcode, created_at');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawAttempts } = await (db as any)
    .from('attempts')
    .select('challenge_id, score');

  const challenges = (rawChallenges as ChallengeRow[] | null) ?? [];
  const attempts   = (rawAttempts as Array<{ challenge_id: string; score: number }> | null) ?? [];

  // Aggregate
  const counts = new Map<string, { count: number; total: number }>();
  for (const a of attempts) {
    const cur = counts.get(a.challenge_id) ?? { count: 0, total: 0 };
    cur.count++;
    cur.total += a.score;
    counts.set(a.challenge_id, cur);
  }

  const ranking = challenges
    .map((c) => {
      const stats = counts.get(c.id) ?? { count: 0, total: 0 };
      return {
        name:       c.creator_name.split(' ')[0],
        archetype:  c.archetype,
        shortcode:  c.shortcode,
        attempts:   stats.count,
        avgScore:   stats.count > 0 ? Math.round((stats.total / stats.count) * 10) / 10 : 0,
      };
    })
    .filter((c) => c.attempts > 0)
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 30);

  return (
    <>
      <GradientOrbs />

      <main className="relative z-10 flex flex-col min-h-screen">
        {/* NAV */}
        <nav className="flex items-center justify-between px-5 sm:px-10 py-5">
          <Link href="/" className="font-display text-xl gradient-text">
            cuanto.me
          </Link>
          <Link
            href="/crear"
            className="btn-secondary !py-2 !px-4 text-sm"
          >
            Crear mi reto
          </Link>
        </nav>

        {/* HEADER */}
        <section className="px-6 pt-8 pb-12 text-center max-w-2xl mx-auto w-full">
          <div className="badge-live mb-6">
            ACTUALIZADO HACE UN MOMENTO
          </div>
          <h1 className="font-display text-5xl sm:text-7xl leading-[0.95] mb-4">
            <span className="gradient-text-hot">Ranking</span><br />
            de todos los tiempos
          </h1>
          <p className="text-white/55 text-base sm:text-lg max-w-md mx-auto">
            Los retos con más intentos. ¿Querés estar acá? Creá el tuyo y compartilo.
          </p>
        </section>

        {/* LEADERBOARD */}
        <section className="px-5 sm:px-6 pb-20 max-w-2xl mx-auto w-full">
          {ranking.length === 0 ? (
            <div className="card-glass p-12 text-center">
              <p className="text-6xl mb-4">🌱</p>
              <h2 className="font-display text-2xl mb-2">Ranking vacío</h2>
              <p className="text-white/50 text-sm mb-6">
                Todavía no hay retos con intentos. Sé el primero.
              </p>
              <Link href="/crear" className="btn-primary">
                Crear mi reto
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {ranking.map((item, idx) => {
                const archetype = ARCHETYPES[item.archetype as ArchetypeKey];
                const medal     = MEDALS[idx];
                const isTop3    = idx < 3;

                return (
                  <a
                    key={item.shortcode}
                    href={`/r/${item.shortcode}`}
                    className={`card-glass flex items-center gap-4 px-5 py-5 group hover:scale-[1.01] transition-transform ${
                      isTop3 ? 'border-white/15' : ''
                    }`}
                    style={isTop3 ? {
                      background: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, ${archetype?.color ?? '#FF006E'}15 100%)`,
                    } : undefined}
                  >
                    {/* Rank */}
                    <div className="w-12 flex items-center justify-center shrink-0">
                      {medal ? (
                        <span className="text-3xl">{medal}</span>
                      ) : (
                        <span className="font-display text-2xl text-white/40">#{idx + 1}</span>
                      )}
                    </div>

                    {/* Emoji */}
                    <span
                      className="text-3xl shrink-0"
                      style={{ filter: archetype ? `drop-shadow(0 0 12px ${archetype.color}88)` : undefined }}
                    >
                      {archetype?.emoji ?? '👤'}
                    </span>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-lg truncate group-hover:underline">
                        {item.name}
                      </p>
                      <p className="text-white/50 text-xs font-mono uppercase tracking-wider truncate">
                        {archetype?.name ?? 'arquetipo'} · Promedio {item.avgScore}/10
                      </p>
                    </div>

                    {/* Count */}
                    <div className="text-right shrink-0">
                      <p className="font-display text-3xl text-white tabular-nums">
                        {item.attempts}
                      </p>
                      <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider">
                        intentos
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/50 text-sm mb-5">
              ¿Querés aparecer acá?
            </p>
            <Link href="/crear" className="btn-primary">
              <span>Crear mi reto</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 px-6 border-t border-white/5 text-center mt-auto">
          <p className="font-mono text-xs text-white/30 tracking-wider">
            cuanto.me · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}
