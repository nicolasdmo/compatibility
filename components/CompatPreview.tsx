'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';
import { Analytics } from '@/lib/analytics';
import type { DimensionScore } from '@/lib/compatibility';
import { COMPAT_PRICE_DISPLAY } from '@/lib/config';

type Props = {
  attemptId:     string;
  creatorName:   string;
  guesserName:   string;
  overallScore:  number;
  dimensions:    DimensionScore[];
  verdictColor:  string;
};

/**
 * Locked preview shown on the /match page.
 * Reveals 2 dimensions free, blurs the rest, drives to MP checkout.
 */
export default function CompatPreview({
  attemptId, creatorName, guesserName, overallScore, dimensions, verdictColor,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleUnlock = async () => {
    setLoading(true);
    setError(null);
    track('compat_checkout_started', { attemptId });
    Analytics.checkoutStarted(attemptId);
    try {
      const res  = await fetch('/api/checkout-compat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ attemptId }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data.error ?? 'Error al iniciar el pago');
      }
      window.location.href = data.init_point;
    } catch (err) {
      console.error(err);
      setError('Hubo un problema. Intentá de nuevo.');
      setLoading(false);
    }
  };

  // Show first 2 dimensions fully, blur the rest
  const reveal = 2;

  return (
    <div
      className="card-glass w-full overflow-hidden mb-8 relative"
      style={{
        background: `linear-gradient(135deg, ${verdictColor}10 0%, rgba(131,56,236,0.10) 60%, rgba(58,134,255,0.10) 100%)`,
        borderColor: `${verdictColor}33`,
      }}
    >
      {/* Decorative gradient */}
      <div
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: verdictColor }}
      />

      {/* HEADER */}
      <div className="px-5 pt-5 pb-4 relative">
        <div className="flex items-center justify-between mb-3">
          <p className="eyebrow">🔒 Compatibilidad real</p>
          <span className="badge-live">PREMIUM</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight mb-1">
          {guesserName} <span style={{ color: verdictColor }}>↔</span> {creatorName}
        </h3>
        <p className="text-white/55 text-sm">
          Cómo te llevás con {creatorName} de verdad — más allá de este puntaje.
        </p>
      </div>

      {/* DIMENSION BARS */}
      <div className="px-5 pb-5 flex flex-col gap-2.5 relative">
        {dimensions.map((d, i) => {
          const locked = i >= reveal;
          return (
            <div
              key={d.category}
              className="flex items-center gap-3"
              style={locked ? { filter: 'blur(6px)', userSelect: 'none' } : undefined}
            >
              <span className="text-lg shrink-0 w-6">{d.emoji}</span>
              <span className="text-white/85 text-sm font-medium w-28 shrink-0">
                {d.label}
              </span>
              <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width:      `${locked ? 60 : d.score}%`,
                    background: locked
                      ? 'linear-gradient(90deg, #8338EC, #3A86FF)'
                      : `linear-gradient(90deg, ${verdictColor}, #8338EC)`,
                    boxShadow:  `0 0 12px ${verdictColor}55`,
                  }}
                />
              </div>
              <span
                className="font-mono text-xs tabular-nums w-10 text-right"
                style={{ color: locked ? '#FFFFFF60' : verdictColor }}
              >
                {locked ? '??' : `${d.score}%`}
              </span>
            </div>
          );
        })}
      </div>

      {/* WHAT'S INSIDE */}
      <div className="px-5 pb-5 relative">
        <div
          className="rounded-2xl px-4 py-4"
          style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="text-white/85 text-xs font-mono uppercase tracking-wider mb-3 font-semibold">
            Lo que vas a desbloquear
          </p>
          <ul className="flex flex-col gap-2 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <span className="text-base shrink-0">✨</span>
              <span>Las <strong className="text-white">6 dimensiones</strong> de compatibilidad reales (no solo 2)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base shrink-0">💚</span>
              <span><strong className="text-white">3 puntos donde clickean</strong> — la magia oculta del vínculo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base shrink-0">⚡</span>
              <span><strong className="text-white">Los choques reales</strong> — dónde van a friccionar siempre</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base shrink-0">💬</span>
              <span>Cómo se <strong className="text-white">comunican mejor</strong> (tip concreto)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base shrink-0">🎭</span>
              <span><strong className="text-white">Tu rol en la dinámica</strong> con {creatorName}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-6 relative">
        {error && (
          <p className="text-center text-sm font-medium mb-3" style={{ color: '#FF006E' }}>
            {error}
          </p>
        )}
        <button
          onClick={handleUnlock}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <span>Desbloquear · {COMPAT_PRICE_DISPLAY}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11 6V4a3 3 0 0 0-6 0v2M3 6h10v8H3V6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
        <p className="text-white/35 text-[11px] font-mono uppercase tracking-wider text-center mt-3">
          Pago único · Acceso inmediato · Score real basado en tus respuestas
        </p>
      </div>
    </div>
  );
}
