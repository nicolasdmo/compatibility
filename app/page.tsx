import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 pt-20 pb-16 text-center">

        <p className="eyebrow mb-8">Test viral · 2 minutos</p>

        {/* Big question as visual */}
        <div className="mb-10 flex items-center justify-center">
          <span
            className="font-serif text-[6rem] sm:text-[8rem] leading-none text-ink"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            ?
          </span>
        </div>

        <h1
          className="font-serif text-5xl sm:text-6xl md:text-7xl text-ink leading-tight mb-6"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          ¿Cuánto<br />te conocen?
        </h1>

        <p className="text-ink-soft text-lg sm:text-xl max-w-md mb-10 leading-relaxed">
          Hacé el test, mandale el link a tu pareja, amigos o familia. Vemos quién te conoce de verdad.
        </p>

        <Link
          href="/crear"
          className="btn-cta inline-flex items-center gap-3 bg-ink text-bg-card px-9 py-4 rounded-pill text-sm font-mono tracking-widest uppercase hover:scale-[1.03] active:scale-95 transition-transform"
        >
          Empezar el reto
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <p className="mt-5 text-ink-faint font-mono text-xs tracking-wider">
          10 preguntas · gratis · sin registro
        </p>
      </section>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="h-px bg-line mx-6 sm:mx-16" />

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-content mx-auto w-full">
        <p className="eyebrow text-center mb-12">Cómo funciona</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { n: '01', title: 'Hacés el test', text: 'Diez preguntas en dos minutos. Tu mapa interior queda guardado.' },
            { n: '02', title: 'Mandás el link', text: 'A tu novia, mejor amigo, mamá, ex, jefe. A quien te animes.' },
            { n: '03', title: 'Te adivinan', text: 'Ellos contestan pensando en vos. Ves cuánto te conocen y dónde se equivocaron.' },
          ].map(({ n, title, text }) => (
            <div key={n} className="flex flex-col gap-3">
              <span className="font-mono text-xs text-ink-faint tracking-wider">{n}</span>
              <h3 className="font-serif text-2xl text-ink" style={{ fontFamily: 'var(--font-serif)' }}>{title}</h3>
              <p className="text-ink-mute text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="h-px bg-line mx-6 sm:mx-16" />

      {/* ── Emotional hook ───────────────────────────────────── */}
      <section className="py-20 px-6 max-w-content mx-auto w-full text-center">
        <h2
          className="font-serif text-3xl sm:text-4xl text-ink leading-snug mb-5"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          El que más te conoce<br />no siempre es el que pensás.
        </h2>
        <p className="text-ink-mute text-base sm:text-lg max-w-md mx-auto mb-3">
          A veces sorprende. A veces duele. Siempre da para conversar.
        </p>
        <p className="text-ink-faint text-sm">
          Funciona con parejas, amigos, familia, equipo de trabajo.
        </p>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <section className="py-16 px-6 text-center border-t border-line">
        <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
          ¿Te animás?
        </h2>
        <Link
          href="/crear"
          className="btn-cta inline-flex items-center gap-3 bg-ink text-bg-card px-9 py-4 rounded-pill text-sm font-mono tracking-widest uppercase hover:scale-[1.03] active:scale-95 transition-transform"
        >
          Crear mi reto
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-6 px-6 border-t border-line-soft text-center">
        <p className="font-mono text-xs text-ink-faint tracking-wider">
          ¿CUÁNTO ME CONOCÉS? · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
