import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { processApprovedPayment } from '@/lib/processPayment';

/**
 * Verifies the webhook came from MercadoPago via x-signature HMAC.
 * Skipped (returns true) when MP_WEBHOOK_SECRET is not set.
 */
function verifyMpSignature(req: NextRequest, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;

  const signature = req.headers.get('x-signature') ?? '';
  const requestId = req.headers.get('x-request-id') ?? '';

  const parts: Record<string, string> = {};
  for (const piece of signature.split(',')) {
    const [k, v] = piece.split('=');
    if (k && v) parts[k.trim()] = v.trim();
  }
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const hmac     = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
  } catch {
    return false;
  }
}

/**
 * MercadoPago webhook for compatibility-report purchases.
 * Persists the purchase + access token; no email is sent — buyers get instant
 * access through the success-page redirect (`/compat/[id]/exito`).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true, skipped: 'not a payment event' });
    }

    const paymentId = String(body.data?.id);
    if (!paymentId) return NextResponse.json({ error: 'No payment id' }, { status: 400 });

    if (!verifyMpSignature(req, paymentId)) {
      console.error('[webhook/mp] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const result = await processApprovedPayment(paymentId);
    if (!result) {
      return NextResponse.json({ ok: true, skipped: 'not approved or unknown product' });
    }

    return NextResponse.json({
      ok: true,
      alreadyProcessed: result.alreadyExisted,
    });
  } catch (err: unknown) {
    console.error('[webhook/mp] Fatal:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
