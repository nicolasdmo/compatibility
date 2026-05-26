import { redirect } from 'next/navigation';
import Link from 'next/link';
import { processApprovedPayment } from '@/lib/processPayment';
import GradientOrbs from '@/components/GradientOrbs';

type Props = {
  params:       Promise<{ attemptId: string }>;
  searchParams: Promise<{
    payment_id?:    string;
    collection_id?: string;
    status?:        string;
  }>;
};

/**
 * MercadoPago redirects here after an approved checkout.
 * We verify the payment server-side and immediately redirect to /compat/{id}?token=
 * If verification is slow (webhook race), we show a friendly waiting screen.
 */
export default async function CompatExitoPage({ params, searchParams }: Props) {
  const { attemptId } = await params;
  const sp            = await searchParams;
  const paymentId     = sp.payment_id || sp.collection_id;

  let redirectUrl: string | null  = null;
  let processingError             = false;

  if (paymentId) {
    try {
      const result = await processApprovedPayment(paymentId);
      if (result && result.attemptId === attemptId) {
        redirectUrl = `/compat/${attemptId}?token=${result.accessToken}`;
      }
    } catch (err) {
      console.error('[compat/exito] processPayment error:', err);
      processingError = true;
    }
  }

  if (redirectUrl) redirect(redirectUrl);

  const isPending = sp.status === 'pending' || sp.status === 'in_process';

  return (
    <>
      <GradientOrbs />
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {!processingError && <meta httpEquiv="refresh" content="4" />}

        <div className="max-w-md flex flex-col items-center gap-6">
          <span className="text-5xl">{processingError ? '⚠️' : '⏳'}</span>

          <div>
            <p className="eyebrow mb-3">
              {processingError ? 'Algo no salió bien' : isPending ? 'Pago pendiente' : 'Verificando pago'}
            </p>
            <h1 className="font-display text-4xl text-white leading-[0.95] mb-3">
              {processingError
                ? 'No pudimos confirmar el pago'
                : isPending
                ? 'Tu pago se está procesando'
                : 'Casi listo...'}
            </h1>
            <p className="text-white/55 text-sm leading-relaxed">
              {processingError
                ? 'Si el pago salió bien, refrescá la página en unos segundos. Si el problema persiste, escribinos.'
                : 'Esta página se va a actualizar sola apenas MercadoPago confirme el pago.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link
              href={`/compat/${attemptId}/exito${paymentId ? `?payment_id=${paymentId}` : ''}`}
              className="btn-secondary"
            >
              Refrescar
            </Link>
            <Link
              href={`/match/${attemptId}`}
              className="btn-secondary"
            >
              ← Volver al puntaje
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
