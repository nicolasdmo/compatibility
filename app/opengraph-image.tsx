import { ImageResponse } from 'next/og';

export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt         = '¿Cuánto me conocés? — el test viral';

export default function OgImage() {
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
        {/* Gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: -180, left: -180,
            width: 640, height: 640,
            borderRadius: '50%',
            background: '#FF006E',
            opacity: 0.32,
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
            opacity: 0.34,
            filter: 'blur(140px)',
          }}
        />

        {/* Brand top */}
        <div
          style={{
            position:   'absolute',
            top:        56,
            left:       64,
            display:    'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
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
              background: 'linear-gradient(135deg, #FF006E, #8338EC)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            cuanto.me
          </span>
        </div>

        {/* Hero */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 64,
            right: 64,
            transform: 'translateY(-44%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}
          >
            ¿Cuánto
          </div>
          <div
            style={{
              fontSize: 148,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #FF006E 0%, #8338EC 60%, #06FFA5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            te conocen
          </div>
          <div
            style={{
              color: 'white',
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}>
            de verdad?
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 28,
              marginTop: 24,
              fontWeight: 500,
            }}
          >
            Hacé el test. Mandalo. Vas a saber a quién le importás de verdad.
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
