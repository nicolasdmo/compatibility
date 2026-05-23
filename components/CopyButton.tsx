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
      // Fallback: select the text manually
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-line text-ink px-5 py-3 rounded-xl font-mono text-xs tracking-widest uppercase hover:bg-bg-elev transition-colors"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5L5 9.5L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ¡Copiado!
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="4.5" y="1.5" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1.5 4.5H3M1.5 4.5V11.5H9.5V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Copiar link
        </>
      )}
    </button>
  );
}
