'use client';

export default function SignOutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className="text-white/45 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
      >
        Salir
      </button>
    </form>
  );
}
