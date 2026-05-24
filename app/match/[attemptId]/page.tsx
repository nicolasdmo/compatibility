import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';
import { SITE_URL } from '@/lib/config';
import GradientOrbs from '@/components/GradientOrbs';

type Props = {
  params: Promise<{ attemptId: string }>;
};

type AttemptRow = {
  id:                  string;
  score:               number;
  perceived_archetype: string;
  challenge_id:        string;
  guesser_name:        string;
};

type ChallengeRow = {
  creator_name: string;
  archetype:    string;
  shortcode:    string;
};

function getVerdict(score: number, total: number): { headline: string; sub: string; emoji: string; color: string } {
  const pct = score / total;
  if (pct >= 0.9) return { headline: 'Lo conocés a fondo',            sub: '¡Casi perfecto! Pocos llegan acá.', emoji: '🔥', color: '#06FFA5' };
  if (pct >= 0.7) return { headline: 'Lo conocés bastante',           sub: 'Te faltaron algunos detalles.',       emoji: '✨', color: '#FFBE0B' };
  if (pct >= 0.5) return { headline: 'Lo conocés un poco',            sub: 'Hay más por descubrir.',              emoji: '🤔', color: '#FB5607' };
  if (pct >= 0.3) return { headline: 'Recién lo estás conociendo',   sub: 'Queda mucho por explorar.',           emoji: '🌱', color: '#8338EC' };
  return           { headline: 'Casi no lo conocés',                  sub: '¿Son amigos? 😅',                    emoji: '💀', color: '#FF006E' };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Tu resultado — ¿Cuánto me conocés?' };
}

export default async function MatchPage({ params }: Props) {
  const { attemptId } = await params;
  const db = getSupabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawAttempt, error: aErr } = await (db as any)
    .from('attempts')
    .select('id, score, perceived_archetype, challenge_id, guesser_name')
    .eq('id', attemptId)
    .single();

  if (aErr || !rawAttempt) notFound();
  const attempt = rawAttempt as AttemptRow;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawChallenge, error: cErr } = await (db as any)
    .from('challenges')
    .select('creator_name, archetype, shortcode')
    .eq('id', attempt.challenge_id)
    .single();

  if (cErr || !rawChallenge) notFound();
  const challenge = rawChallenge as ChallengeRow;

  const total            = 10;
  const ownerArchetype   = ARCHETYPES[challenge.archetype as ArchetypeKey];
  const guessedArchetype = ARCHETYPES[attempt.perceived_archetype as ArchetypeKey];
  const archetypeMatch   = challenge.archetype === attempt.perceived_archetype;
  const verdict          = getVerdict(attempt.score, total);
  const challengeUrl     = `${SITE_URL}/r/${challenge.shortcode}`;
  const scorePct         = attempt.score / total;

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

        <div className="flex-1 flex flex-col items-center px-5 sm:px-6 pt-6 pb-16 max-w-md mx-auto w-full">

          {/* Header */}
          <p className="eyebrow mb-2">Tu resultado</p>
          <p className="font-mono text-xs text-white/40 tracking-wide mb-8 text-center">
            {attempt.guesser_name} → {challenge.creator_name}
          </p>

          {/* Big Score Circle */}
          <div className="relative w-52 h-52 mb-6 animate-pop-in">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <defs>
                <linearGradient id="grad-score" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor={verdict.color} />
                  <stop offset="100%" stopColor="#8338EC" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="url(#grad-score)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - scorePct)}`}
                filter="url(#glow)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-display text-7xl leading-none tabular-nums"
                style={{ color: verdict.color, textShadow: `0 0 24px ${verdict.color}` }}
              >
                {attempt.score}
              </span>
              <span className="font-mono text-xs text-white/40 tracking-wider mt-1">
                de {total}
              </span>
            </div>
          </div>

          {/* Verdict */}
          <div className="text-center mb-10">
            <p className="text-3xl mb-3">{verdict.emoji}</p>
            <h1 className="font-display text-4xl sm:text-5xl text-white leading-[0.95] mb-3">
              {verdict.headline}
            </h1>
            <p className="text-white/60 text-base">{verdict.sub}</p>
          </div>

          {/* Archetype comparison */}
          {ownerArchetype && guessedArchetype && (
            <div className="card-glass w-full overflow-hidden mb-8">
              {/* Real archetype */}
              <div
                className="px-5 py-5 border-b border-white/5 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${ownerArchetype.color}15 0%, transparent 100%)`,
                }}
              >
                <p className="eyebrow mb-3">Es realmente</p>
                <div className="flex items-start gap-4">
                  <span
                    className="text-4xl mt-0.5 shrink-0"
                    style={{ filter: `drop-shadow(0 0 12px ${ownerArchetype.color}88)` }}
                  >
                    {ownerArchetype.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-2xl text-white mb-1">
                      {ownerArchetype.name}
                    </p>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {ownerArchetype.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Your guess */}
              <div className="px-5 py-5">
                <p className="eyebrow mb-3">Tu lectura</p>
                <div className="flex items-start gap-4">
                  <span className="text-4xl mt-0.5 shrink-0 opacity-90">
                    {guessedArchetype.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-2xl text-white mb-1">
                      {guessedArchetype.name}
                    </p>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {guessedArchetype.tagline}
                    </p>
                  </div>
                </div>

                {archetypeMatch && (
                  <div
                    className="mt-4 px-4 py-3 rounded-xl text-center"
                    style={{
                      background: 'rgba(6,255,165,0.1)',
                      border: '1px solid rgba(6,255,165,0.3)',
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: '#06FFA5' }}>
                      🎯 ¡Acertaste el arquetipo exacto!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="w-full flex flex-col gap-3">
            <Link href="/crear" className="btn-primary">
              <span>Crear mi propio reto</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <a
              href={challengeUrl}
              className="btn-secondary"
            >
              Hacer el test de {challenge.creator_name} de nuevo
            </a>
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
