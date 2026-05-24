import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';
import { resolveQuestions } from '@/lib/adaptive';
import {
  computeDimensionScores,
  computeOverallCompat,
  compatVerdict,
} from '@/lib/compatibility';
import { getCompatInsights } from '@/lib/compatibilityContent';
import type { Answers } from '@/lib/scoring';
import GradientOrbs from '@/components/GradientOrbs';

type Props = {
  params:       Promise<{ attemptId: string }>;
  searchParams: Promise<{ token?: string }>;
};

type AttemptRow = {
  id:                  string;
  guesser_name:        string;
  answers:             Record<string, string>;
  challenge_id:        string;
  perceived_archetype: string;
};

type ChallengeRow = {
  creator_name: string;
  archetype:    string;
  answers:      Record<string, string>;
  question_ids: string[];
};

type PurchaseRow = {
  access_token:   string;
  attempt_id:     string;
  payment_status: string;
};

export const metadata: Metadata = {
  title: 'Tu compatibilidad — ¿Cuánto me conocés?',
  robots: { index: false },
};

export default async function CompatReportPage({ params, searchParams }: Props) {
  const { attemptId } = await params;
  const { token }     = await searchParams;

  if (!token) redirect(`/match/${attemptId}`);

  const db = getSupabaseAdmin();

  // Validate token → must match a paid purchase tied to this attempt
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawPurchase } = await (db as any)
    .from('purchases')
    .select('access_token, attempt_id, payment_status')
    .eq('access_token', token)
    .maybeSingle();

  const purchase = rawPurchase as PurchaseRow | null;
  if (!purchase || purchase.payment_status !== 'approved' || purchase.attempt_id !== attemptId) {
    redirect(`/match/${attemptId}?error=token`);
  }

  // Load attempt
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawAttempt } = await (db as any)
    .from('attempts')
    .select('id, guesser_name, answers, challenge_id, perceived_archetype')
    .eq('id', attemptId)
    .single();

  if (!rawAttempt) notFound();
  const attempt = rawAttempt as AttemptRow;

  // Load challenge
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawChallenge } = await (db as any)
    .from('challenges')
    .select('creator_name, archetype, answers, question_ids')
    .eq('id', attempt.challenge_id)
    .single();

  if (!rawChallenge) notFound();
  const challenge = rawChallenge as ChallengeRow;

  // Compute everything fresh
  const questions  = resolveQuestions(challenge.question_ids ?? []);
  const dimensions = computeDimensionScores(
    challenge.answers as Answers,
    attempt.answers   as Answers,
    challenge.question_ids ?? []
  );
  const overall  = computeOverallCompat(dimensions);
  const verdict  = compatVerdict(overall);
  const insights = getCompatInsights(
    challenge.archetype as ArchetypeKey,
    attempt.perceived_archetype as ArchetypeKey
  );

  const A = ARCHETYPES[challenge.archetype as ArchetypeKey];
  const B = ARCHETYPES[attempt.perceived_archetype as ArchetypeKey];

  return (
    <>
      <GradientOrbs />

      <main className="relative z-10 flex flex-col min-h-screen">

        {/* NAV */}
        <nav className="flex items-center justify-between px-5 sm:px-10 py-5">
          <Link href="/" className="font-display text-xl gradient-text">
            cuanto.me
          </Link>
          <span className="badge-live">DESBLOQUEADO</span>
        </nav>

        <div className="flex-1 px-5 sm:px-6 pt-4 pb-16 max-w-xl mx-auto w-full">

          {/* HEADER + OVERALL */}
          <p className="eyebrow text-center mb-4">Compatibilidad real</p>

          <h1 className="font-display text-4xl sm:text-5xl text-white text-center leading-[0.95] mb-3">
            {attempt.guesser_name}<br />
            <span style={{ color: verdict.color }}>↔</span><br />
            {challenge.creator_name}
          </h1>

          {/* Big % score */}
          <div className="flex flex-col items-center my-10">
            <div className="relative w-48 h-48 animate-pop-in">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="grad-compat" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor={verdict.color} />
                    <stop offset="100%" stopColor="#8338EC" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="44"
                  fill="none"
                  stroke="url(#grad-compat)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - overall / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="font-display text-6xl leading-none tabular-nums"
                  style={{ color: verdict.color, textShadow: `0 0 24px ${verdict.color}` }}
                >
                  {overall}
                  <span className="text-3xl">%</span>
                </span>
              </div>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-white mt-5 text-center">
              {verdict.headline}
            </h2>
            <p className="text-white/55 text-base mt-1 text-center">{verdict.tagline}</p>
          </div>

          {/* DIMENSIONS */}
          <div className="card-glass p-5 mb-6">
            <p className="eyebrow mb-4">📊 Las 6 dimensiones</p>
            <div className="flex flex-col gap-3">
              {dimensions.map((d) => (
                <div key={d.category} className="flex items-center gap-3">
                  <span className="text-xl shrink-0 w-8">{d.emoji}</span>
                  <span className="text-white text-sm font-semibold w-32 shrink-0">{d.label}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${d.score}%`,
                        background: `linear-gradient(90deg, ${verdict.color}, #8338EC)`,
                        boxShadow: `0 0 8px ${verdict.color}80`,
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-sm tabular-nums w-12 text-right font-semibold"
                    style={{ color: verdict.color }}
                  >
                    {d.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ARCHETYPE PAIR */}
          {A && B && (
            <div className="card-glass p-5 mb-6">
              <p className="eyebrow mb-4">🎭 Sus dos arquetipos</p>
              <div className="flex items-center justify-around gap-4">
                <div className="text-center flex-1">
                  <div className="text-4xl mb-2" style={{ filter: `drop-shadow(0 0 12px ${A.color}88)` }}>
                    {A.emoji}
                  </div>
                  <p className="font-display text-base text-white">{A.name}</p>
                  <p className="text-white/45 text-xs font-mono uppercase tracking-wider mt-1">
                    {challenge.creator_name}
                  </p>
                </div>
                <div style={{ color: verdict.color }} className="font-display text-3xl">↔</div>
                <div className="text-center flex-1">
                  <div className="text-4xl mb-2" style={{ filter: `drop-shadow(0 0 12px ${B.color}88)` }}>
                    {B.emoji}
                  </div>
                  <p className="font-display text-base text-white">{B.name}</p>
                  <p className="text-white/45 text-xs font-mono uppercase tracking-wider mt-1">
                    {attempt.guesser_name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CLICKS */}
          <div className="card-glass p-5 mb-6" style={{ borderColor: 'rgba(6,255,165,0.25)' }}>
            <p className="eyebrow mb-4" style={{ color: '#06FFA5' }}>💚 Dónde clickean</p>
            <ul className="flex flex-col gap-3">
              {insights.clicks.map((click, i) => (
                <li key={i} className="flex items-start gap-3 text-white/90 text-sm leading-relaxed">
                  <span className="text-base shrink-0 mt-0.5">·</span>
                  <span>{click}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CLASHES */}
          <div className="card-glass p-5 mb-6" style={{ borderColor: 'rgba(251,86,7,0.25)' }}>
            <p className="eyebrow mb-4" style={{ color: '#FB5607' }}>⚡ Dónde chocan</p>
            <ul className="flex flex-col gap-3">
              {insights.clashes.map((clash, i) => (
                <li key={i} className="flex items-start gap-3 text-white/90 text-sm leading-relaxed">
                  <span className="text-base shrink-0 mt-0.5">·</span>
                  <span>{clash}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* COMMUNICATION */}
          <div className="card-glass p-5 mb-6" style={{ borderColor: 'rgba(58,134,255,0.25)' }}>
            <p className="eyebrow mb-3" style={{ color: '#3A86FF' }}>💬 Cómo comunicarse mejor</p>
            <p className="text-white/90 text-sm leading-relaxed">{insights.communication}</p>
          </div>

          {/* ROLE */}
          <div className="card-glass p-5 mb-8" style={{ borderColor: 'rgba(131,56,236,0.3)' }}>
            <p className="eyebrow mb-3" style={{ color: '#B86BFF' }}>
              🎯 Tu rol con {challenge.creator_name}
            </p>
            <p className="text-white/90 text-sm leading-relaxed">{insights.role}</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link href="/crear" className="btn-primary">
              <span>Crear mi propio reto</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href={`/match/${attemptId}`} className="btn-secondary">
              ← Volver al puntaje
            </Link>
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
