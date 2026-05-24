import Link from 'next/link';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function PendientePage({ params }: Props) {
  const { code } = await params;
  const lower     = code?.toLowerCase();
  const archetype = ARCHETYPES[lower as ArchetypeKey];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
      <span className="text-5xl">⏳</span>
      <div>
        <p className="eyebrow mb-2">Pago pendiente</p>
        <p className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
          Tu pago está siendo procesado
        </p>
        <p className="text-ink-mute text-sm max-w-sm mx-auto">
          MercadoPago está verificando el pago. En cuanto se acredite, vas a recibir una notificación y podrás acceder a tu reporte.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/reporte/${lower}`}
          className="inline-flex items-center gap-2 border border-line text-ink px-6 py-3 rounded-pill font-mono text-xs tracking-widest lowercase hover:bg-bg-elev transition-colors"
        >
          Volver al reporte
        </Link>
        <Link
          href={`/r/${lower}`}
          className="inline-flex items-center gap-2 bg-ink text-bg-card px-6 py-3 rounded-pill font-mono text-xs tracking-widest lowercase hover:opacity-80 transition-opacity"
        >
          Ver mi resultado gratuito
        </Link>
      </div>
      {archetype && (
        <p className="font-mono text-[10px] text-ink-faint tracking-wider mt-4">
          {archetype.emoji} {archetype.name} · {lower}
        </p>
      )}
    </main>
  );
}
