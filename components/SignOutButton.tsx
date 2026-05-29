'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-white/45 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
    >
      Salir
    </button>
  );
}
