import Link from 'next/link';
import GradientOrbs from '@/components/GradientOrbs';

type Props = { params: Promise<{ attemptId: string }> };

export default async function CompatPendientePage({ params }: Props) {
  const { attemptId } = await params;

  return (
    <>
      <GradientOrbs />
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md flex flex-col items-center gap-6">
          <span className="text-5xl">⏳</span>
          <div>
            <p className="eyebrow mb-3">Pago pendiente</p>
            <h1 className="font-display text-3xl text-white leading-tight mb-3">
              Tu pago se está procesando
            </h1>
            <p className="text-white/55 text-sm leading-relaxed">
              MercadoPago está verificando. Cuando se acredite vas a poder ver tu reporte completo.
            </p>
          </div>
          <Link href={`/match/${attemptId}`} className="btn-secondary">
            ← Volver al puntaje
          </Link>
        </div>
      </main>
    </>
  );
}
