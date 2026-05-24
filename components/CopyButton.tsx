'use client';

import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-pill font-mono text-xs tracking-widest uppercase font-semibold transition-all"
      style={{
        background: copied ? 'rgba(6, 255, 165, 0.15)' : 'rgba(255, 255, 255, 0.06)',
        border: copied ? '1px solid #06FFA5' : '1px solid rgba(255, 255, 255, 0.14)',
        color: copied ? '#06FFA5' : 'white',
        boxShadow: copied ? '0 0 24px rgba(6, 255, 165, 0.3)' : 'none',
      }}
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L6 11L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ¡Copiado!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="4.5" y="1.5" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M1.5 4.5H3M1.5 4.5V11.5H9.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Copiar link
        </>
      )}
    </button>
  );
}
