import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';
import { SITE_URL } from '@/lib/config';

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

function getVerdict(score: number, total: number): { headline: string; sub: string } {
  const pct = score / total;
  if (pct >= 0.9) return { headline: 'Lo conocés muy bien',           sub: '¡Impresionante! Casi perfecto.' };
  if (pct >= 0.7) return { headline: 'Lo conocés bastante',           sub: 'Te faltan algunos detalles.' };
  if (pct >= 0.5) return { headline: 'Lo conocés un poco',            sub: 'Hay más por descubrir.' };
  if (pct >= 0.3) return { headline: 'Todavía lo estás conociendo',   sub: 'Queda mucho por explorar juntos.' };
  return           { headline: 'Casi no lo conocés',                  sub: '¿Son amigos? 😅' };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Tu resultado — ¿Cuánto me conocés?' };
}

export default async function MatchPage({ params }: Props) {
  const { attemptId } = await params;
  const db = getSupabaseAdmin();

  // Fetch attempt
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawAttempt, error: aErr } = await (db as any)
    .from('attempts')
    .select('id, score, perceived_archetype, challenge_id, guesser_name')
    .eq('id', attemptId)
    .single();

  if (aErr || !rawAttempt) notFound();
  const attempt = rawAttempt as AttemptRow;

  // Fetch challenge
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
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 pt-14 pb-16">

        {/* Eyebrow */}
        <p className="eyebrow mb-10">Resultado</p>

        {/* Score circle */}
        <div className="relative w-36 h-36 mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#E8E3D5" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="#16140F"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - scorePct)}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-serif text-4xl text-ink leading-none"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {attempt.score}
            </span>
            <span className="font-mono text-[11px] text-ink-faint tracking-wider">/ {total}</span>
          </div>
        </div>

        {/* Verdict */}
        <h1
          className="font-serif text-3xl sm:text-4xl text-ink text-center leading-snug mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {verdict.headline}
        </h1>
        <p className="text-ink-mute text-sm text-center mb-1">{verdict.sub}</p>
        <p className="text-ink-faint text-xs text-center mb-10 font-mono tracking-wide">
          {attempt.guesser_name} → {challenge.creator_name}
        </p>

        {/* Archetype comparison */}
        {ownerArchetype && guessedArchetype && (
          <div className="w-full max-w-sm bg-bg-card border border-line rounded-2xl overflow-hidden mb-8">
            <div className="px-5 pt-5 pb-4 border-b border-line-soft">
              <p className="eyebrow mb-3">Arquetipo real</p>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{ownerArchetype.emoji}</span>
                <div>
                  <p className="font-mono text-[10px] text-ink-faint tracking-wider uppercase mb-0.5">
                    {challenge.creator_name} es
                  </p>
                  <p className="font-serif text-xl text-ink" style={{ fontFamily: 'var(--font-serif)' }}>
                    {ownerArchetype.name}
                  </p>
                  <p className="text-ink-mute text-xs mt-0.5 leading-relaxed">
                    {ownerArchetype.tagline}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="eyebrow mb-3">Tu lectura</p>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{guessedArchetype.emoji}</span>
                <div>
                  <p className="font-mono text-[10px] text-ink-faint tracking-wider uppercase mb-0.5">
                    Vos creíste que era
                  </p>
                  <p className="font-serif text-xl text-ink" style={{ fontFamily: 'var(--font-serif)' }}>
                    {guessedArchetype.name}
                  </p>
                  <p className="text-ink-mute text-xs mt-0.5 leading-relaxed">
                    {guessedArchetype.tagline}
                  </p>
                </div>
              </div>

              {archetypeMatch && (
                <div className="mt-3 bg-ink/5 rounded-lg px-3 py-2">
                  <p className="text-ink text-xs text-center font-mono tracking-wide">
                    ✓ ¡Adivinaste el arquetipo exacto!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <a
            href={challengeUrl}
            className="inline-flex items-center justify-center gap-2 border border-line text-ink px-6 py-3.5 rounded-pill font-mono text-xs tracking-widest uppercase hover:bg-bg-elev transition-colors"
          >
            Yo también quiero hacer el test
          </a>

          <Link
            href="/crear"
            className="btn-cta inline-flex items-center justify-center gap-3 bg-ink text-bg-card px-8 py-4 rounded-pill text-sm font-mono tracking-widest uppercase"
          >
            Crear mi propio reto
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-line-soft text-center">
        <p className="font-mono text-xs text-ink-faint tracking-wider">
          ¿CUÁNTO ME CONOCÉS? · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
