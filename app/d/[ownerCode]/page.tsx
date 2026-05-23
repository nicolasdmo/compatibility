import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import { SITE_URL, PRICE_DISPLAY } from '@/lib/config';
import CopyButton from '@/components/CopyButton';

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
  id:           string;
  guesser_name: string;
  score:        number;
  created_at:   string;
};

export const metadata: Metadata = {
  title: 'Mi reto — ¿Cuánto me conocés?',
  robots: { index: false }, // private dashboard — don't index
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day:    'numeric',
    month:  'short',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

function scoreLabel(score: number): string {
  if (score >= 8) return 'Muy bien';
  if (score >= 6) return 'Bastante';
  if (score >= 4) return 'Un poco';
  return 'Poco';
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
    .select('id, guesser_name, score, created_at')
    .eq('challenge_id', challenge.id)
    .order('created_at', { ascending: false });

  const allAttempts = (rawAttempts as AttemptRow[] | null) ?? [];
  const avgScore    = allAttempts.length > 0
    ? (allAttempts.reduce((s, a) => s + a.score, 0) / allAttempts.length).toFixed(1)
    : null;

  const archetype = ARCHETYPES[challenge.archetype];
  const shareLink = `${SITE_URL}/r/${challenge.shortcode}`;

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 px-6 py-12 max-w-lg mx-auto w-full">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="eyebrow mb-3">Tu reto</p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-ink mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Hola, {challenge.creator_name}
          </h1>
          {archetype && (
            <p className="text-ink-mute text-sm">
              Tu arquetipo:{' '}
              <span className="text-ink font-medium">
                {archetype.emoji} {archetype.name}
              </span>
            </p>
          )}
        </div>

        {/* ── Share link ─────────────────────────────────────── */}
        <div className="bg-bg-card border border-line rounded-2xl p-5 mb-8">
          <p className="eyebrow mb-2">Compartí tu reto</p>
          <p className="text-ink-mute text-sm mb-4 leading-relaxed">
            Mandá este link a tu pareja, amigos, familia. Vemos quién te conoce de verdad.
          </p>
          <div className="bg-bg border border-line rounded-xl px-4 py-3 font-mono text-xs text-ink break-all select-all">
            {shareLink}
          </div>
          <CopyButton text={shareLink} />
        </div>

        {/* ── Stats ──────────────────────────────────────────── */}
        {allAttempts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-bg-card border border-line rounded-2xl p-5 text-center">
              <p
                className="font-serif text-4xl text-ink mb-1"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {allAttempts.length}
              </p>
              <p className="font-mono text-[10px] text-ink-faint tracking-wider uppercase">
                {allAttempts.length === 1 ? 'intento' : 'intentos'}
              </p>
            </div>
            <div className="bg-bg-card border border-line rounded-2xl p-5 text-center">
              <p
                className="font-serif text-4xl text-ink mb-1"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {avgScore}
              </p>
              <p className="font-mono text-[10px] text-ink-faint tracking-wider uppercase">
                Promedio / 10
              </p>
            </div>
          </div>
        )}

        {/* ── Attempts list ──────────────────────────────────── */}
        {allAttempts.length === 0 ? (
          <div className="text-center py-14">
            <p
              className="font-serif text-2xl text-ink mb-3"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Nadie intentó todavía
            </p>
            <p className="text-ink-mute text-sm">Compartí el link de arriba para empezar.</p>
          </div>
        ) : (
          <div className="mb-8">
            <p className="eyebrow mb-3">Intentos</p>
            <div className="flex flex-col gap-2">
              {allAttempts.map((attempt) => (
                <Link
                  key={attempt.id}
                  href={`/match/${attempt.id}`}
                  className="bg-bg-card border border-line rounded-xl px-5 py-4 flex items-center justify-between hover:border-ink-soft transition-colors group"
                >
                  <div>
                    <p className="text-ink text-sm font-medium group-hover:underline">
                      {attempt.guesser_name}
                    </p>
                    <p className="text-ink-faint text-xs mt-0.5 font-mono">
                      {formatDate(attempt.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-serif text-2xl text-ink"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {attempt.score}/10
                    </p>
                    <p className="text-ink-faint text-[11px] font-mono">
                      {scoreLabel(attempt.score)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Premium CTA ────────────────────────────────────── */}
        <div className="border-t border-line pt-8">
          <p className="eyebrow mb-2">Reporte completo</p>
          <p className="text-ink-mute text-sm mb-5 leading-relaxed">
            Descubrí todo sobre tu arquetipo: cómo trabajás, cómo te relacionás,
            tu zona de crecimiento y mucho más.
          </p>
          <Link
            href={`/reporte/${challenge.archetype}`}
            className="btn-cta inline-flex items-center gap-3 bg-ink text-bg-card px-7 py-3.5 rounded-pill text-sm font-mono tracking-widest uppercase hover:scale-[1.03] active:scale-95 transition-transform"
          >
            Ver reporte · {PRICE_DISPLAY}
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
