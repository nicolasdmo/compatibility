'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TestRunner from '@/components/TestRunner';
import type { Answers } from '@/lib/scoring';

type Step = 'name' | 'test' | 'submitting';

export default function CrearFlow() {
  const router = useRouter();
  const [step, setStep]   = useState<Step>('name');
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep('test');
  };

  const handleTestComplete = async (answers: Answers, questionIds: string[]) => {
    setStep('submitting');
    try {
      const res = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          answers,
          questionIds,
        }),
      });
      if (!res.ok) throw new Error('Error');
      const { ownerCode } = await res.json();
      router.push(`/d/${ownerCode}`);
    } catch {
      setError('Algo salió mal. Intentá de nuevo.');
      setStep('name');
    }
  };

  /* ── Test step ─────────────────────────────────────────────── */
  if (step === 'test') {
    return (
      <TestRunner
        mode="adaptive"
        onComplete={handleTestComplete}
        eventName="challenge_created"
      />
    );
  }

  /* ── Submitting step ───────────────────────────────────────── */
  if (step === 'submitting') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-ink-mute tracking-wider">Guardando tu reto...</p>
        </div>
      </main>
    );
  }

  /* ── Name step (default) ───────────────────────────────────── */
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-center mb-8">Crear mi reto</p>

        <h1
          className="font-serif text-4xl sm:text-5xl text-ink text-center mb-10 leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          ¿Cómo<br />te llamás?
        </h1>

        <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            autoFocus
            className="w-full bg-bg-card border-2 border-line rounded-xl px-5 py-4 text-ink text-lg placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email (opcional, para notificaciones)"
            className="w-full bg-bg-card border border-line rounded-xl px-5 py-3.5 text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-ink-soft transition-colors"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-cta mt-2 inline-flex items-center justify-center gap-3 bg-ink text-bg-card px-8 py-4 rounded-pill text-sm font-mono tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Empezar el reto
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-xs text-ink-faint tracking-wider">
          ~12 preguntas · 3 minutos · gratis
        </p>
      </div>
    </main>
  );
}
