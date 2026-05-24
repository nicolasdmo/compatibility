'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TestRunner from '@/components/TestRunner';
import type { Question } from '@/data/questions';
import type { Answers } from '@/lib/scoring';

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
    setStep('test');
  };

  const handleTestComplete = async (answers: Answers) => {
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

  /* ── Test step (B answers A's exact questions in fixed mode) ── */
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
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-ink-mute tracking-wider">
            Calculando tu resultado...
          </p>
        </div>
      </main>
    );
  }

  /* ── Intro (default) ───────────────────────────────────────── */
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-center mb-8">
          {creatorName} te desafió
        </p>

        <h1
          className="font-serif text-4xl sm:text-5xl text-ink text-center mb-5 leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          ¿Cuánto<br />me conocés?
        </h1>

        <p className="text-ink-mute text-sm text-center mb-10 leading-relaxed">
          Respondé{' '}
          <strong className="text-ink">
            {questions.length} preguntas pensando en {creatorName}
          </strong>
          . El puntaje revela cuánto lo/la conocés de verdad.
        </p>

        <form onSubmit={handleIntroSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={guesserName}
            onChange={(e) => setGuesserName(e.target.value)}
            placeholder="Tu nombre"
            autoFocus
            className="w-full bg-bg-card border-2 border-line rounded-xl px-5 py-4 text-ink text-lg placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={!guesserName.trim()}
            className="btn-cta mt-2 inline-flex items-center justify-center gap-3 bg-ink text-bg-card px-8 py-4 rounded-pill text-sm font-mono tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Aceptar el reto
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-xs text-ink-faint tracking-wider">
          {questions.length} preguntas · ~3 minutos · gratis
        </p>
      </div>
    </main>
  );
}
