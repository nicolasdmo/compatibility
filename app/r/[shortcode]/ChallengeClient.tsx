'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TestRunner from '@/components/TestRunner';
import GradientOrbs from '@/components/GradientOrbs';
import type { Question } from '@/data/questions';
import type { Answers } from '@/lib/scoring';
import { Analytics } from '@/lib/analytics';

type Step = 'intro' | 'test' | 'submitting';

type Props = {
  shortcode:   string;
  creatorName: string;
  questions:   Question[];
};

export default function ChallengeClient({ shortcode, creatorName, questions }: Props) {
  const router = useRouter();
  const [step,        setStep]        = useState<Step>('intro');
  const [guesserName, setGuesserName] = useState('');
  const [error,       setError]       = useState('');

  const handleIntroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guesserName.trim()) return;
    Analytics.challengeStarted(shortcode);
    setStep('test');
  };

  const handleTestComplete = async (answers: Answers) => {
    Analytics.challengeCompleted(shortcode, 0, questions.length);
    setStep('submitting');
    try {
      const res = await fetch('/api/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortcode, guesserName: guesserName.trim(), answers }),
      });
      if (!res.ok) throw new Error('Error');
      const { attemptId } = await res.json();
      router.push(`/match/${attemptId}`);
    } catch {
      setError('Algo salió mal. Intentá de nuevo.');
      setStep('intro');
    }
  };

  /* ── Test step ─────────────────────────────────────────────── */
  if (step === 'test') {
    return (
      <TestRunner
        mode="fixed"
        questions={questions}
        onComplete={handleTestComplete}
        eventName="challenge_answered"
      />
    );
  }

  /* ── Submitting ────────────────────────────────────────────── */
  if (step === 'submitting') {
    return (
      <>
        <GradientOrbs />
        <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-r-transparent animate-spin"
                style={{ borderBottomColor: '#06FFA5', borderLeftColor: '#3A86FF' }}
              />
            </div>
            <p className="font-display text-2xl text-white mb-2">
              Calculando tu puntaje
            </p>
            <p className="font-mono text-xs text-white/40 tracking-wider uppercase">
              ¿Cuánto lo conocés?
            </p>
          </div>
        </main>
      </>
    );
  }

  /* ── Intro (default) ───────────────────────────────────────── */
  return (
    <>
      <GradientOrbs />
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <div className="badge-live mb-6 inline-flex">
              {creatorName.toUpperCase()} TE DESAFIÓ
            </div>
            <h1 className="font-display text-5xl sm:text-6xl text-white leading-[0.95] mb-5">
              ¿Cuánto<br />
              <span className="gradient-text">me conocés?</span>
            </h1>
            <p className="text-white/65 text-base leading-relaxed">
              Respondé <strong className="text-white">{questions.length} preguntas pensando en {creatorName}</strong>.<br />
              Vemos qué tan bien lo/la conocés.
            </p>
          </div>

          <form onSubmit={handleIntroSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={guesserName}
              onChange={(e) => setGuesserName(e.target.value)}
              placeholder="Tu nombre"
              autoFocus
              maxLength={40}
              className="input-modern"
            />

            {error && (
              <p className="text-center text-sm font-medium" style={{ color: '#FF006E' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!guesserName.trim()}
              className="btn-primary mt-2"
            >
              <span>Aceptar el reto</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-[11px] text-white/40 tracking-wider uppercase">
            {questions.length} preguntas · ~2 minutos · gratis
          </p>
        </div>
      </main>
    </>
  );
}
