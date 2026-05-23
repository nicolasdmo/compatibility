import Link from 'next/link';

export const metadata = { title: 'Crear mi reto — ¿Cuánto me conocés?' };

// Stub: el flujo real (TestRunner + creación de challenge) se construye en la próxima iteración.
export default function CrearPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-4">Próximamente</p>
      <h1
        className="font-serif text-4xl text-ink mb-4"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Estamos preparando esto
      </h1>
      <p className="text-ink-mute text-sm max-w-sm mb-8">
        El flujo del reto se está construyendo. Volvé en unos días.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 border border-line text-ink px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:bg-bg-elev transition-colors"
      >
        ← Volver
      </Link>
    </main>
  );
}
