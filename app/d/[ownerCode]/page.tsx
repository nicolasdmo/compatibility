import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';
import { SITE_URL } from '@/lib/config';
import ShareButtons from '@/components/ShareButtons';
import GradientOrbs from '@/components/GradientOrbs';

type Props = {
  params: Promise<{ ownerCode: string }>;
};

type ChallengeRow = {
  id:           string;
  creator_name: string;
  archetype:    string;
  shortcode:    string;
};

type AttemptRow = {
  id:                  string;
  guesser_name:        string;
  score:               number;
  perceived_archetype: string;
  created_at:          string;
};

export const metadata: Metadata = {
  title: 'Mi reto — ¿Cuánto me conocés?',
  robots: { index: false },
};

function formatDate(dateStr: string): string {
  const d   = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60)         return 'recién';
  if (diff < 3600)       return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400)      return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 7)  return `hace ${Math.floor(diff / 86400)} d`;
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

function scoreColor(score: number): string {
  if (score >= 8) return '#06FFA5';
  if (score >= 6) return '#FFBE0B';
  if (score >= 4) return '#FB5607';
  return '#FF006E';
}

export default async function DashboardPage({ params }: Props) {
  const { ownerCode } = await params;
  const upper = ownerCode.toUpperCase();

  const db = getSupabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawChallenge, error: cErr } = await (db as any)
    .from('challenges')
    .select('id, creator_name, archetype, shortcode')
    .eq('owner_code', upper)
    .single();

  if (cErr || !rawChallenge) notFound();
  const challenge = rawChallenge as ChallengeRow;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawAttempts } = await (db as any)
    .from('attempts')
    .select('id, guesser_name, score, perceived_archetype, created_at')
    .eq('challenge_id', challenge.id)
    .order('created_at', { ascending: false });

  const allAttempts = (rawAttempts as AttemptRow[] | null) ?? [];
  const avgScore    = allAttempts.length > 0
    ? (allAttempts.reduce((s, a) => s + a.score, 0) / allAttempts.length).toFixed(1)
    : null;
  const bestScore   = allAttempts.length > 0
    ? Math.max(...allAttempts.map((a) => a.score))
    : 0;
  const bestAttempt = allAttempts.find((a) => a.score === bestScore);

  const archetype = ARCHETYPES[challenge.archetype as ArchetypeKey];
  const shareLink = `${SITE_URL}/r/${challenge.shortcode}`;

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
            href="/ranking"
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            🏆 Ranking
          </Link>
        </nav>

        <div className="flex-1 px-5 sm:px-6 py-8 max-w-xl mx-auto w-full">

          {/* HEADER */}
          <div className="text-center mb-10">
            <p className="eyebrow mb-4">Tu reto está vivo</p>
            <h1 className="font-display text-5xl sm:text-6xl text-white mb-4 leading-[0.95]">
              Hola,<br />
              <span className="gradient-text">{challenge.creator_name}</span>
            </h1>
            {archetype && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-pill"
                style={{
                  background: `${archetype.color}15`,
                  border: `1px solid ${archetype.color}40`,
                }}
              >
                <span className="text-xl">{archetype.emoji}</span>
                <span className="text-white text-sm font-semibold">{archetype.name}</span>
              </div>
            )}
          </div>

          {/* SHARE CARD */}
          <div className="card-glass p-6 mb-8 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-30 blur-3xl"
              style={{ background: '#FF006E' }}
            />
            <p className="eyebrow mb-2 relative">📲 Compartí tu reto</p>
            <p className="text-white/60 text-sm mb-5 leading-relaxed relative">
              Mandalo por donde quieras. El mensaje ya va con tu nombre y el reto.
              Vemos quién te conoce de verdad.
            </p>
            <div
              className="rounded-xl px-4 py-3.5 font-mono text-xs text-white break-all select-all mb-4 relative"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {shareLink}
            </div>
            <div className="relative">
              <ShareButtons creatorName={challenge.creator_name} shareLink={shareLink} />
            </div>
          </div>

          {/* STATS */}
          {allAttempts.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              <StatBox label="Intentos" value={`${allAttempts.length}`}    color="#FF006E" />
              <StatBox label="Mejor"    value={`${bestScore}/10`}           color="#06FFA5" />
              <StatBox label="Promedio" value={`${avgScore}`}               color="#3A86FF" />
            </div>
          )}

          {/* BEST ATTEMPT HIGHLIGHT */}
          {bestAttempt && bestScore >= 7 && (
            <div
              className="card-glass p-5 mb-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(6,255,165,0.08) 0%, rgba(58,134,255,0.08) 100%)',
                borderColor: 'rgba(6,255,165,0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-float">👑</span>
                <div className="flex-1">
                  <p className="text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                    Te conoce mejor
                  </p>
                  <p className="text-white text-lg font-semibold">
                    {bestAttempt.guesser_name}
                  </p>
                </div>
                <span className="font-display text-3xl" style={{ color: '#06FFA5' }}>
                  {bestScore}/10
                </span>
              </div>
            </div>
          )}

          {/* ATTEMPTS LIST */}
          {allAttempts.length === 0 ? (
            <div className="card-glass p-12 text-center">
              <p className="text-5xl mb-4 animate-float">🌱</p>
              <p className="font-display text-2xl text-white mb-2">
                Nadie intentó todavía
              </p>
              <p className="text-white/50 text-sm">
                Compartí el link de arriba para empezar.
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <p className="eyebrow mb-4">Todos los intentos</p>
              <div className="flex flex-col gap-2.5">
                {allAttempts.map((attempt) => {
                  const color = scoreColor(attempt.score);
                  return (
                    <Link
                      key={attempt.id}
                      href={`/match/${attempt.id}`}
                      className="card-glass flex items-center justify-between px-5 py-4 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-display text-base"
                          style={{
                            background: `${color}25`,
                            color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          {attempt.guesser_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-base font-semibold truncate group-hover:underline">
                            {attempt.guesser_name}
                          </p>
                          <p className="text-white/40 text-xs font-mono">
                            {formatDate(attempt.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className="font-display text-2xl tabular-nums"
                          style={{ color }}
                        >
                          {attempt.score}/10
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="card-glass p-6 text-center">
            <p className="text-3xl mb-3 animate-float">🚀</p>
            <h3 className="font-display text-xl text-white mb-2">
              ¿Querés más respuestas?
            </h3>
            <p className="text-white/55 text-sm mb-5">
              Mandalo a tres personas más. Te van a sorprender.
            </p>
            <ShareButtons creatorName={challenge.creator_name} shareLink={shareLink} compact />
          </div>
        </div>

        {/* FOOTER */}
        <footer className="py-6 px-6 border-t border-white/5 text-center">
          <p className="font-mono text-xs text-white/30 tracking-wider">
            cuanto.me · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}

function StatBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div
      className="card-glass p-4 text-center relative overflow-hidden"
      style={{ borderColor: `${color}30` }}
    >
      <div
        className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-30 blur-2xl"
        style={{ background: color }}
      />
      <p
        className="font-display text-3xl mb-0.5 tabular-nums relative"
        style={{ color, textShadow: `0 0 16px ${color}55` }}
      >
        {value}
      </p>
      <p className="font-mono text-[10px] text-white/50 tracking-wider uppercase relative">
        {label}
      </p>
    </div>
  );
}
