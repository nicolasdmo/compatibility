import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';

/**
 * Top nav — server component that branches on auth state.
 *
 * Signed-out: "Ranking" + "Crear reto"
 * Signed-in:  "Ranking" + "Mis retos" + "Salir"
 */
export default async function Nav() {
  let user = null;
  try {
    const ssr = await createClient();
    const { data } = await ssr.auth.getUser();
    user = data.user;
  } catch {
    // anonymous browsing
  }

  return (
    <nav className="flex items-center justify-between px-5 sm:px-10 py-5 relative z-10">
      <Link href="/" className="font-display text-xl gradient-text">
        cuanto.me
      </Link>
      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          href="/ranking"
          className="text-white/70 hover:text-white text-sm font-medium transition-colors"
        >
          🏆 <span className="hidden sm:inline">Ranking</span>
        </Link>
        {user ? (
          <>
            <Link
              href="/mis-retos"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              👤 <span className="hidden sm:inline">Mis retos</span>
            </Link>
            <SignOutButton />
          </>
        ) : (
          <Link
            href="/crear"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-white/8 border border-white/12 text-white text-sm font-semibold hover:bg-white/14 transition-colors"
          >
            Crear reto
          </Link>
        )}
      </div>
    </nav>
  );
}
