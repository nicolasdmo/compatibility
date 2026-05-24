import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { SITE_URL, COMPAT_PRICE_AMOUNT, PRICE_CURRENCY } from '@/lib/config';

/**
 * Compatibility A↔B report checkout.
 * Creates a MercadoPago preference tied to a specific attempt.
 *
 * External reference format: `compat:{attemptId}` — the webhook uses
 * this to know which product and which match to deliver.
 */
export async function POST(req: NextRequest) {
  try {
    const { attemptId } = await req.json();

    if (!attemptId) {
      return NextResponse.json({ error: 'Falta attemptId' }, { status: 400 });
    }

    // Validate the attempt actually exists before creating a charge
    const db = getSupabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: attempt, error } = await (db as any)
      .from('attempts')
      .select('id, guesser_name, challenge_id')
      .eq('id', attemptId)
      .single();

    if (error || !attempt) {
      return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 });
    }

    // Fetch the creator name for nicer copy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: challenge } = await (db as any)
      .from('challenges')
      .select('creator_name')
      .eq('id', attempt.challenge_id)
      .single();

    const creatorName = challenge?.creator_name ?? 'tu match';
    const guesserName = attempt.guesser_name;

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'MP no configurado' }, { status: 500 });
    }

    const client     = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id:          `compat-${attemptId}`,
            title:       `Compatibilidad con ${creatorName}`,
            description: `Reporte de compatibilidad real entre ${guesserName} y ${creatorName}`,
            quantity:    1,
            unit_price:  Number(process.env.MP_COMPAT_PRICE ?? COMPAT_PRICE_AMOUNT),
            currency_id: process.env.MP_CURRENCY ?? PRICE_CURRENCY,
          },
        ],
        back_urls: {
          success: `${SITE_URL}/compat/${attemptId}/exito`,
          failure: `${SITE_URL}/match/${attemptId}?error=pago`,
          pending: `${SITE_URL}/compat/${attemptId}/pendiente`,
        },
        auto_return:          'approved',
        external_reference:   `compat:${attemptId}`,
        statement_descriptor: 'CUANTO ME CONOCES',
      },
    });

    return NextResponse.json({
      init_point: result.init_point,
      id:         result.id,
    });
  } catch (err: unknown) {
    console.error('[checkout-compat]', err);
    const msg = err instanceof Error ? err.message : 'Error inesperado';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
