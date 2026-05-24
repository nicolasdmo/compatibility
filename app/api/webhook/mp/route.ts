import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import { SITE_URL } from '@/lib/config';
import { processApprovedPayment } from '@/lib/processPayment';
import ReporteEmail from '@/emails/ReporteEmail';

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
      return NextResponse.json({ ok: true, skipped: 'not approved or invalid' });
    }

    if (result.alreadyExisted) {
      return NextResponse.json({ ok: true, alreadyProcessed: true });
    }

    // ── Email (only for archetype reports for now) ─────────────
    // Compatibility reports give instant access via the success redirect;
    // we'll add an email template later when we have stronger demand signal.
    if (result.productType !== 'archetype_report') {
      return NextResponse.json({ ok: true, productType: result.productType });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.log('[webhook/mp] Resend not configured — skipping email');
      return NextResponse.json({ ok: true, emailSkipped: 'no-resend-key' });
    }

    try {
      const resend    = new Resend(resendKey);
      const archetype = ARCHETYPES[result.archetypeCode as keyof typeof ARCHETYPES];

      const html = await render(
        ReporteEmail({
          code:        result.archetypeCode,
          accessToken: result.accessToken,
          baseUrl:     SITE_URL,
        }) as React.ReactElement
      );

      const fromAddr = process.env.RESEND_DOMAIN
        ? `cuanto.me <reporte@${process.env.RESEND_DOMAIN}>`
        : 'cuanto.me <onboarding@resend.dev>';

      const { error: emailError } = await resend.emails.send({
        from:    fromAddr,
        to:      result.email,
        subject: `Tu Reporte Completo · ${archetype.name}`,
        html,
      });

      if (emailError) {
        console.warn('[webhook/mp] Email send failed:', emailError);
        return NextResponse.json({ ok: true, emailError: 'send-failed' });
      }

      const supabase = getSupabaseAdmin();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('purchases')
        .update({ email_sent: true })
        .eq('payment_id', paymentId);

      return NextResponse.json({ ok: true });

    } catch (err) {
      console.warn('[webhook/mp] Email send error:', err);
      return NextResponse.json({ ok: true, emailError: 'exception' });
    }

  } catch (err: unknown) {
    console.error('[webhook/mp] Fatal:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
