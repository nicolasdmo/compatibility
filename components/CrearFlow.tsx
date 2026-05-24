'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TestRunner from '@/components/TestRunner';
import GradientOrbs from '@/components/GradientOrbs';
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
      <>
        <GradientOrbs />
        <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-r-transparent animate-spin"
                style={{ borderBottomColor: '#FF006E', borderLeftColor: '#8338EC' }}
              />
            </div>
            <p className="font-display text-2xl text-white mb-2">
              Calculando tu arquetipo
            </p>
            <p className="font-mono text-xs text-white/40 tracking-wider uppercase">
              Esto toma un segundo...
            </p>
          </div>
        </main>
      </>
    );
  }

  /* ── Name step (default) ───────────────────────────────────── */
  return (
    <>
      <GradientOrbs />
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <div className="badge-live mb-6 inline-flex">
              EMPEZAR · 2 MINUTOS
            </div>
            <h1 className="font-display text-5xl sm:text-6xl text-white leading-[0.95] mb-4">
              ¿Cómo<br />
              <span className="gradient-text">te llamás?</span>
            </h1>
            <p className="text-white/55 text-base">
              Tu nombre aparece cuando alguien<br />
              hace tu reto.
            </p>
          </div>

          <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              autoFocus
              maxLength={40}
              className="input-modern"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (opcional)"
              className="input-modern !text-base"
              style={{ paddingTop: 14, paddingBottom: 14 }}
            />

            {error && (
              <p className="text-center text-sm font-medium" style={{ color: '#FF006E' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-primary mt-2"
            >
              <span>Empezar el reto</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-[11px] text-white/40 tracking-wider uppercase">
            12 preguntas · 2 minutos · gratis
          </p>
        </div>
      </main>
    </>
  );
}
