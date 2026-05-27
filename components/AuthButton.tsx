'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
    <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A9 9 0 0 0 9 18Z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.4 5.4 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A9 9 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/>
  </svg>
);

type Props = {
  redirectTo?: string;
  variant?:   'primary' | 'secondary';
  label?:     string;
};

export default function GoogleSignInButton({
  redirectTo,
  variant = 'secondary',
  label   = 'Continuar con Google',
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    const callbackUrl = redirectTo ?? (typeof window !== 'undefined' ? window.location.pathname : '/crear');
    signIn('google', { callbackUrl });
    // Browser navigates away — no need to reset loading
  };

  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`${baseClass} w-full !bg-white !text-[#1f1f1f] !border-white hover:!bg-white/95`}
      style={{ background: 'white', color: '#1f1f1f', border: '1px solid white' }}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      <span>{loading ? 'Conectando...' : label}</span>
    </button>
  );
}

/** Hook: current NextAuth session user. Drop-in replacement for the old useUser. */
export function useUser() {
  const { data: session, status } = useSession();
  return {
    user:    status === 'authenticated' ? session.user : null,
    loading: status === 'loading',
  };
}
