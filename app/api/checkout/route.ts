import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';
import { SITE_URL, PRICE_AMOUNT, PRICE_CURRENCY } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const key       = (code as string)?.toLowerCase() as ArchetypeKey;
    const archetype = ARCHETYPES[key];

    if (!archetype) {
      return NextResponse.json({ error: 'Arquetipo inválido' }, { status: 400 });
    }

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
            id:          `reporte-${key}`,
            title:       `Reporte Completo · ${archetype.name}`,
            description: `${archetype.tagline}`,
            quantity:    1,
            unit_price:  Number(process.env.MP_PRICE ?? PRICE_AMOUNT),
            currency_id: process.env.MP_CURRENCY ?? PRICE_CURRENCY,
          },
        ],
        back_urls: {
          success: `${SITE_URL}/reporte/${key}/exito`,
          failure: `${SITE_URL}/reporte/${key}?error=pago`,
          pending: `${SITE_URL}/reporte/${key}/pendiente`,
        },
        auto_return: 'approved',
        external_reference: key,
        statement_descriptor: '¿CUÁNTO ME CONOCÉS?',
      },
    });

    return NextResponse.json({
      init_point: result.init_point,
      id: result.id,
    });
  } catch (err: unknown) {
    console.error('[checkout]', err);
    const msg = err instanceof Error ? err.message : 'Error inesperado';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
