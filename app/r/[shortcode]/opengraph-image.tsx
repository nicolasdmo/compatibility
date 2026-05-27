import { ImageResponse } from 'next/og';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';

export const runtime     = 'nodejs';
export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt         = '¿Cuánto me conocés?';

type ChallengeRow = {
  creator_name: string;
  archetype:    string;
};

/**
 * Dynamic OG image for each challenge link.
 * Shows the creator's name + a punchy CTA so the social-share preview
 * actually sells the click instead of looking like a bare URL card.
 */
export default async function OgImage({ params }: { params: Promise<{ shortcode: string }> }) {
  const { shortcode } = await params;

  let challenge: ChallengeRow | null = null;
  try {
    const db = getSupabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (db as any)
      .from('challenges')
      .select('creator_name, archetype')
      .eq('shortcode', shortcode.toUpperCase())
      .single();
    challenge = data as ChallengeRow | null;
  } catch {
    // Supabase unavailable — render with fallback values
  }
  const name      = challenge?.creator_name ?? 'alguien';
  const firstName = name.split(' ')[0];
  const archetype = challenge ? ARCHETYPES[challenge.archetype as ArchetypeKey] : null;
  const accent    = archetype?.color ?? '#FF006E';

  return new ImageResponse(
    (
      <div
        style={{
          width:    '100%',
          height:   '100%',
          display:  'flex',
          flexDirection: 'column',
          background: '#0a0612',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orbs (background) */}
        <div
          style={{
            position: 'absolute',
            top: -180, left: -180,
            width: 640, height: 640,
            borderRadius: '50%',
            background: '#FF006E',
            opacity: 0.30,
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200, right: -180,
            width: 720, height: 720,
            borderRadius: '50%',
            background: '#8338EC',
            opacity: 0.32,
            filter: 'blur(140px)',
          }}
        />
        {archetype && (
          <div
            style={{
              position: 'absolute',
              top: '40%', right: '20%',
              width: 320, height: 320,
              borderRadius: '50%',
              background: accent,
              opacity: 0.18,
              filter: 'blur(110px)',
            }}
          />
        )}

        {/* Top bar */}
        <div
          style={{
            position:   'absolute',
            top:        56,
            left:       64,
            right:      64,
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 38, height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #FF006E, #8338EC)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              👀
            </div>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                background: 'linear-gradient(135deg, #FF006E, #8338EC)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              cuanto.me
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              borderRadius: 999,
              background: 'rgba(255, 0, 110, 0.15)',
              border: '1px solid rgba(255, 0, 110, 0.4)',
            }}
          >
            <div
              style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: '#FF006E',
              }}
            />
            <span
              style={{
                color: '#FF006E',
                fontSize: 14,
                letterSpacing: '0.14em',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              RETO EN VIVO
            </span>
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 64,
            right: 64,
            transform: 'translateY(-44%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <div
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            ¿Cuánto conocés a
          </div>
          <div
            style={{
              fontSize: 148,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              background: `linear-gradient(135deg, #FF006E 0%, ${accent === '#FF006E' ? '#8338EC' : accent} 60%, #06FFA5 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              maxWidth: 1070,
            }}
          >
            {firstName}?
          </div>
          <div
            style={{
              color: 'white',
              fontSize: 34,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
              maxWidth: 900,
              marginTop: 10,
            }}
          >
            12 preguntas. 2 minutos.<br />
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Probá si lo conocés de verdad.</span>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #FF006E 0%, #8338EC 50%, #06FFA5 100%)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
