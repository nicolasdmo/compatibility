'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import CompatPreview from '@/components/CompatPreview';

type Dimension = {
  category: string;
  label:    string;
  emoji:    string;
  score:    number;
};

type Props = {
  attemptId:          string;
  creatorName:        string;
  guesserName:        string;
  overallScore:       number;
  dimensions:         Dimension[];
  verdictColor:       string;
  purchase:           { access_token: string } | null;
  perceivedArchetype: string;
};

export default function MatchAuthGate({
  attemptId,
  creatorName,
  guesserName,
  overallScore,
  dimensions,
  verdictColor,
  purchase,
  perceivedArchetype,
}: Props) {
  const { data: session, status } = useSession();
  const savedRef = useRef(false);

  const doSaveLead = useCallback(
    (email: string, name: string) => {
      if (savedRef.current) return;
      savedRef.current = true;
      fetch('/api/lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, name, archetypeCode: perceivedArchetype }),
      }).catch(() => {});
    },
    [perceivedArchetype],
  );

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      doSaveLead(session.user.email, session.user.name ?? guesserName);
    }
  }, [status, session, doSaveLead, guesserName]);

  /* ── Loading ─────────────────────────────────────────────── */
  if (status === 'loading') {
    return (
      <div className="w-full flex justify-center py-10">
        <span className="inline-block w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Not logged in ───────────────────────────────────────── */
  if (status === 'unauthenticated') {
    return (
      <div
        className="card-glass w-full p-6 mb-8 text-center"
        style={{ borderColor: 'rgba(58,134,255,0.3)' }}
      >
        <p className="font-mono text-xs text-white/40 tracking-wider uppercase mb-3">
          Análisis de compatibilidad
        </p>
        <h3 className="font-display text-2xl text-white mb-2">
          ¿Cuánto combinan realmente?
        </h3>
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Iniciá sesión para ver las 6 dimensiones de compatibilidad,
          dónde conectan y dónde chocan con {creatorName}.
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: window.location.pathname })}
          className="flex items-center justify-center gap-3 w-full bg-white text-[#1f1f1f] px-6 py-3.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Ver mi análisis con Google
        </button>

        <p className="mt-4 font-mono text-[10px] text-white/30 tracking-wider">
          Gratis · Solo para identificarte · No spam
        </p>
      </div>
    );
  }

  /* ── Authenticated ───────────────────────────────────────── */
  return (
    <>
      {purchase ? (
        // Already bought — show unlock card
        <div
          className="card-glass w-full p-5 mb-8 text-center"
          style={{
            background:  'linear-gradient(135deg, rgba(6,255,165,0.10), rgba(58,134,255,0.10))',
            borderColor: 'rgba(6,255,165,0.3)',
          }}
        >
          <span className="badge-live mb-3 inline-flex">DESBLOQUEADO</span>
          <h3 className="font-display text-2xl text-white mb-2">
            Ya tenés tu reporte
          </h3>
          <p className="text-white/65 text-sm mb-4">
            Compatibilidad real con {creatorName} lista para ver.
          </p>
          <Link
            href={`/compat/${attemptId}?token=${purchase.access_token}`}
            className="btn-lime w-full"
          >
            <span>Ver mi reporte completo</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      ) : (
        // Not bought yet — show locked preview
        <CompatPreview
          attemptId={attemptId}
          creatorName={creatorName}
          guesserName={guesserName}
          overallScore={overallScore}
          dimensions={dimensions}
          verdictColor={verdictColor}
        />
      )}
    </>
  );
}
