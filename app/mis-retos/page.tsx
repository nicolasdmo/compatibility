import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';
import GradientOrbs from '@/components/GradientOrbs';
import SignOutButton from '@/components/SignOutButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mis retos — ¿Cuánto me conocés?',
  robots: { index: false },
};

type ChallengeRow = {
  id:           string;
  owner_code:   string;
  shortcode:    string;
  creator_name: string;
  archetype:    string;
  created_at:   string;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function MisRetosPage() {
  const session = await auth();
  const user = session?.user;
  if (!user?.email) redirect('/crear');
  const email = user.email;

  const db = getSupabaseAdmin();

  // Fetch user's challenges
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawChallenges } = await (db as any)
    .from('challenges')
    .select('id, owner_code, shortcode, creator_name, archetype, created_at')
    .eq('creator_email', email)
    .order('created_at', { ascending: false });

  const challenges = (rawChallenges as ChallengeRow[] | null) ?? [];

  // Fetch attempt counts in one shot
  const ids = challenges.map((c) => c.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawAttempts } = ids.length === 0 ? { data: [] } : await (db as any)
    .from('attempts')
    .select('challenge_id, score')
    .in('challenge_id', ids);

  const attempts = (rawAttempts as Array<{ challenge_id: string; score: number }> | null) ?? [];
  const counts = new Map<string, { count: number; total: number }>();
  for (const a of attempts) {
    const cur = counts.get(a.challenge_id) ?? { count: 0, total: 0 };
    cur.count++;
    cur.total += a.score;
    counts.set(a.challenge_id, cur);
  }

  const displayName = user.name?.split(' ')[0] ?? email.split('@')[0];

  return (
    <>
      <GradientOrbs />

      <main className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-5 sm:px-10 py-5">
          <Link href="/" className="font-display text-xl gradient-text">
            cuanto.me
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/ranking"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              🏆 Ranking
            </Link>
            <SignOutButton />
          </div>
        </nav>

        <div className="flex-1 px-5 sm:px-6 py-8 max-w-2xl mx-auto w-full">

          <div className="text-center mb-10">
            <p className="eyebrow mb-4">Mi cuenta</p>
            <h1 className="font-display text-5xl sm:text-6xl text-white leading-[0.95] mb-3">
              Hola,<br />
              <span className="gradient-text">{displayName}</span>
            </h1>
            <p className="text-white/55 text-base">
              {challenges.length === 0
                ? 'Todavía no creaste ningún reto.'
                : `Tenés ${challenges.length} reto${challenges.length === 1 ? '' : 's'}.`}
            </p>
          </div>

          {challenges.length === 0 ? (
            <div className="card-glass p-12 text-center">
              <p className="text-5xl mb-4 animate-float">🌱</p>
              <h2 className="font-display text-2xl text-white mb-2">Empezá tu primer reto</h2>
              <p className="text-white/50 text-sm mb-6">
                Hacé el test, compartí el link, mirá quién te conoce mejor.
              </p>
              <Link href="/crear" className="btn-primary">
                Crear mi reto
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {challenges.map((c) => {
                const archetype = ARCHETYPES[c.archetype as ArchetypeKey];
                const stats     = counts.get(c.id) ?? { count: 0, total: 0 };
                const avg       = stats.count > 0 ? (stats.total / stats.count).toFixed(1) : null;

                return (
                  <Link
                    key={c.id}
                    href={`/d/${c.owner_code}`}
                    className="card-glass flex items-center gap-4 px-5 py-5 group"
                  >
                    <span
                      className="text-3xl shrink-0"
                      style={{ filter: archetype ? `drop-shadow(0 0 12px ${archetype.color}88)` : undefined }}
                    >
                      {archetype?.emoji ?? '👤'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-base font-semibold truncate group-hover:underline">
                        {c.creator_name}
                      </p>
                      <p className="text-white/45 text-xs font-mono uppercase tracking-wider truncate">
                        {archetype?.name ?? 'arquetipo'} · {formatDate(c.created_at)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-2xl text-white tabular-nums">
                        {stats.count}
                      </p>
                      <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider">
                        {stats.count === 1 ? 'intento' : 'intentos'}
                        {avg && ` · ${avg}/10`}
                      </p>
                    </div>
                  </Link>
                );
              })}
              <Link
                href="/crear"
                className="btn-secondary mt-4"
              >
                + Crear otro reto
              </Link>
            </div>
          )}
        </div>

        <footer className="py-6 px-6 border-t border-white/5 text-center mt-auto">
          <p className="font-mono text-xs text-white/30 tracking-wider">
            cuanto.me · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}
