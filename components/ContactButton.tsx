'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Floating contact button — bottom-right corner.
 * Opens a small modal; submits to /api/contact which saves to Supabase.
 */
export default function ContactButton() {
  const [open,    setOpen]    = useState(false);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<Status>('idle');

  const reset = () => {
    setName(''); setEmail(''); setMessage(''); setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus('sending');

    const res = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, message }),
    });

    if (res.ok) {
      setStatus('sent');
      setTimeout(() => { setOpen(false); reset(); }, 2200);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const inputStyle: React.CSSProperties = {
    width:           '100%',
    padding:         '10px 12px',
    borderRadius:    8,
    border:          '1px solid rgba(255,255,255,0.12)',
    background:      'rgba(255,255,255,0.05)',
    color:           '#fff',
    fontSize:        13,
    outline:         'none',
    transition:      'border-color 0.15s',
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Contacto"
        style={{
          position:      'fixed',
          bottom:        20,
          right:         20,
          zIndex:        50,
          width:         44,
          height:        44,
          borderRadius:  '50%',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          background:    'rgba(255,255,255,0.07)',
          border:        '1px solid rgba(255,255,255,0.14)',
          cursor:        'pointer',
          transition:    'transform 0.15s, background 0.15s',
          backdropFilter:'blur(8px)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <path
            d="M14 2H2a1 1 0 00-1 1v8a1 1 0 001 1h5l2 2 2-2h3a1 1 0 001-1V3a1 1 0 00-1-1z"
            stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position:       'fixed',
                inset:          0,
                zIndex:         50,
                background:     'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(6px)',
              }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position:     'fixed',
                bottom:       80,
                right:        20,
                zIndex:       50,
                width:        'min(calc(100vw - 2.5rem), 360px)',
                borderRadius: 20,
                border:       '1px solid rgba(255,255,255,0.10)',
                background:   '#13111c',
                boxShadow:    '0 24px 64px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                    Contacto
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 0 }}
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>

                {status === 'sent' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}
                  >
                    <span style={{ fontSize: 24, color: '#06FFA5' }}>✓</span>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Mensaje recibido. Te respondo pronto.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input
                      type="text"
                      placeholder="Nombre (opcional)"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      style={inputStyle}
                    />
                    <input
                      type="email"
                      placeholder="Email (para responderte)"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={inputStyle}
                    />
                    <textarea
                      placeholder="Tu mensaje..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                      rows={3}
                      style={{ ...inputStyle, resize: 'none' }}
                    />

                    {status === 'error' && (
                      <p style={{ fontSize: 12, color: '#f87171' }}>Error al enviar. Intentá de nuevo.</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending' || !message.trim()}
                      style={{
                        width:          '100%',
                        padding:        '11px 0',
                        borderRadius:   8,
                        border:         'none',
                        background:     'linear-gradient(135deg, #FF006E, #8338EC)',
                        color:          '#fff',
                        fontFamily:     'monospace',
                        fontSize:       11,
                        letterSpacing:  '0.14em',
                        textTransform:  'uppercase',
                        fontWeight:     700,
                        cursor:         status === 'sending' || !message.trim() ? 'not-allowed' : 'pointer',
                        opacity:        status === 'sending' || !message.trim() ? 0.5 : 1,
                        transition:     'opacity 0.15s',
                      }}
                    >
                      {status === 'sending' ? 'Enviando…' : 'Enviar'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
