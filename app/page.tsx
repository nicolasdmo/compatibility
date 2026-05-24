import Link from 'next/link';
import GradientOrbs from '@/components/GradientOrbs';
import LiveStats from '@/components/LiveStats';
import RankingPreview from '@/components/RankingPreview';

export default function LandingPage() {
  return (
    <>
      <GradientOrbs />

      <main className="relative z-10 flex flex-col min-h-screen">

        {/* ── NAV ────────────────────────────────────────────── */}
        <nav className="flex items-center justify-between px-5 sm:px-10 py-5">
          <Link href="/" className="font-display text-xl gradient-text">
            cuanto.me
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/ranking"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              🏆 Ranking
            </Link>
            <Link
              href="/crear"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-white/8 border border-white/12 text-white text-sm font-semibold hover:bg-white/14 transition-colors"
            >
              Crear reto
            </Link>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center flex-1 px-6 pt-8 pb-16 text-center">

          {/* Live badge */}
          <div className="badge-live mb-8 animate-pop-in">
            EN VIVO · TEST VIRAL
          </div>

          {/* Big headline */}
          <h1 className="font-display text-[clamp(3rem,12vw,7rem)] leading-[0.9] tracking-tight mb-6 max-w-4xl">
            ¿Cuánto<br />
            <span className="gradient-text">te conocen</span><br />
            de verdad?
          </h1>

          <p className="text-white/65 text-lg sm:text-xl max-w-md mb-10 leading-relaxed">
            Hacé el test. Mandá el link.<br />
            Descubrí <span className="text-white font-semibold">quién te conoce mejor.</span>
          </p>

          {/* CTA */}
          <Link href="/crear" className="btn-primary mb-4">
            <span>Empezar el reto</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-14">
            12 preguntas · 2 minutos · gratis
          </p>

          {/* Live stats */}
          <LiveStats />
        </section>

        {/* ── DIVIDER ─────────────────────────────────────────── */}
        <div className="h-px bg-white/5 mx-6 sm:mx-16" />

        {/* ── HOW IT WORKS ────────────────────────────────────── */}
        <section className="py-20 px-6 max-w-content mx-auto w-full">
          <p className="eyebrow text-center mb-3">Cómo funciona</p>
          <h2 className="font-display text-4xl sm:text-5xl text-center mb-14">
            En <span className="gradient-text-hot">3 pasos</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { n: '01', emoji: '🧠', title: 'Hacés el test', text: 'Doce preguntas adaptadas a vos. Tu mapa interior queda guardado.', color: '#FF006E' },
              { n: '02', emoji: '🔗', title: 'Mandás el link', text: 'A tu pareja, mejor amigo, hermana, mamá. A quien te animes.', color: '#8338EC' },
              { n: '03', emoji: '🎯', title: 'Te adivinan', text: 'Contestan pensando en vos. Ves el puntaje y dónde se equivocaron.', color: '#06FFA5' },
            ].map(({ n, emoji, title, text, color }) => (
              <div
                key={n}
                className="card-glass p-7 flex flex-col gap-4 relative overflow-hidden group"
              >
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-30 blur-3xl group-hover:opacity-50 transition-opacity"
                  style={{ background: color }}
                />
                <div className="flex items-center justify-between relative">
                  <span className="font-mono text-xs text-white/35 tracking-wider">{n}</span>
                  <span className="text-3xl animate-float">{emoji}</span>
                </div>
                <h3 className="font-display text-2xl text-white relative">{title}</h3>
                <p className="text-white/55 text-sm leading-relaxed relative">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIVIDER ─────────────────────────────────────────── */}
        <div className="h-px bg-white/5 mx-6 sm:mx-16" />

        {/* ── LEADERBOARD PREVIEW ─────────────────────────────── */}
        <section className="py-20 px-6 max-w-content mx-auto w-full">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-3">🔥 Ranking en vivo</p>
              <h2 className="font-display text-4xl sm:text-5xl">
                A quién <span className="gradient-text">le responden</span><br />más
              </h2>
            </div>
            <Link
              href="/ranking"
              className="btn-secondary"
            >
              Ver ranking completo
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <RankingPreview />
        </section>

        {/* ── DIVIDER ─────────────────────────────────────────── */}
        <div className="h-px bg-white/5 mx-6 sm:mx-16" />

        {/* ── EMOTIONAL HOOK ──────────────────────────────────── */}
        <section className="py-24 px-6 max-w-3xl mx-auto w-full text-center relative">
          <h2 className="font-display text-4xl sm:text-6xl text-white leading-tight mb-6">
            El que más te conoce<br />
            <span className="gradient-text-hot">no siempre</span> es el que pensás.
          </h2>
          <p className="text-white/55 text-base sm:text-lg max-w-md mx-auto">
            A veces sorprende. A veces duele. <br />
            Siempre da para conversar.
          </p>
        </section>

        {/* ── FOOTER CTA ──────────────────────────────────────── */}
        <section className="py-20 px-6 text-center relative">
          <h2 className="font-display text-5xl sm:text-6xl mb-8">
            ¿Te <span className="gradient-text">animás</span>?
          </h2>
          <Link href="/crear" className="btn-primary">
            <span>Crear mi reto</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <footer className="py-8 px-6 border-t border-white/5 text-center">
          <p className="font-mono text-xs text-white/30 tracking-wider">
            cuanto.me · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}
