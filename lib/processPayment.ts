import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';

export type ProductType = 'archetype_report' | 'compatibility_report';

export interface PaymentResult {
  /** Which product was bought */
  productType:    ProductType;

  /** Buyer info (from MP payer) */
  email:          string;
  name:           string;

  /** Archetype the report is about (legacy product). For compat reports, this is A's archetype. */
  archetypeCode:  string;

  /** Access token generated for this purchase. */
  accessToken:    string;

  amount:         number;
  currency:       string;
  paymentId:      string;

  /** For compatibility reports — the attempt the report is for. */
  attemptId?:     string;

  /** true = record already existed (idempotent re-call) */
  alreadyExisted: boolean;
}

/**
 * Verifies a MercadoPago payment and upserts the purchase record.
 * Idempotent — same payment_id always returns the same access_token.
 *
 * External reference conventions:
 *  - `compat:{attemptId}` → compatibility A↔B report
 *  - everything else      → legacy archetype report (lowercase archetype key)
 */
export async function processApprovedPayment(paymentId: string): Promise<PaymentResult | null> {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error('MP_ACCESS_TOKEN not configured');

  const client  = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(client);
  const data    = await payment.get({ id: paymentId });

  if (data.status !== 'approved') return null;

  const email     = data.payer?.email ?? '';
  const name      = data.payer?.first_name ?? '';
  const amount    = data.transaction_amount ?? 0;
  const currency  = data.currency_id ?? 'ARS';
  const extRef    = data.external_reference ?? '';

  if (!extRef) return null;

  // Detect product type
  const isCompat = extRef.startsWith('compat:');

  // Compat reports don't need email (access via token URL).
  // Archetype reports email the access link, so they still need one.
  if (!isCompat && !email) return null;

  if (isCompat) {
    return processCompatPayment({ paymentId, email, name, amount, currency, extRef });
  } else {
    return processArchetypePayment({ paymentId, email, name, amount, currency, extRef });
  }
}

// ─── Compatibility A↔B report ────────────────────────────────────────────────

async function processCompatPayment(args: {
  paymentId: string; email: string; name: string;
  amount: number; currency: string; extRef: string;
}): Promise<PaymentResult | null> {
  const { paymentId, email, name, amount, currency, extRef } = args;
  const attemptId = extRef.slice('compat:'.length);
  if (!attemptId) return null;

  const supabase = getSupabaseAdmin();

  // Idempotency check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('purchases')
    .select('access_token')
    .eq('payment_id', paymentId)
    .maybeSingle();

  if (existing) {
    // Need the challenge archetype for the result shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: attemptRow } = await (supabase as any)
      .from('attempts')
      .select('challenge_id, challenges!inner(archetype)')
      .eq('id', attemptId)
      .maybeSingle();
    const archetypeCode = attemptRow?.challenges?.archetype ?? '';
    return {
      productType:    'compatibility_report',
      email, name, amount, currency, paymentId,
      attemptId,
      archetypeCode,
      accessToken:    (existing as { access_token: string }).access_token,
      alreadyExisted: true,
    };
  }

  // Fetch attempt + challenge to enrich the purchase row
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: attemptRow } = await (supabase as any)
    .from('attempts')
    .select('id, challenge_id, guesser_name')
    .eq('id', attemptId)
    .single();
  if (!attemptRow) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: challengeRow } = await (supabase as any)
    .from('challenges')
    .select('id, archetype')
    .eq('id', attemptRow.challenge_id)
    .single();
  if (!challengeRow) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: inserted, error } = await (supabase as any)
    .from('purchases')
    .insert({
      challenge_id:   challengeRow.id,
      attempt_id:     attemptId,
      product_type:   'compatibility_report',
      buyer_email:    email,
      buyer_name:     name || attemptRow.guesser_name,
      buyer_role:     'guesser',
      archetype:      challengeRow.archetype,
      payment_id:     paymentId,
      payment_status: 'approved',
      amount,
      currency,
    })
    .select('access_token')
    .single();

  if (error) throw new Error(`Supabase insert failed: ${error.message}`);

  return {
    productType:    'compatibility_report',
    email, name, amount, currency, paymentId,
    attemptId,
    archetypeCode:  challengeRow.archetype,
    accessToken:    (inserted as { access_token: string }).access_token,
    alreadyExisted: false,
  };
}

// ─── Legacy archetype report ─────────────────────────────────────────────────

async function processArchetypePayment(args: {
  paymentId: string; email: string; name: string;
  amount: number; currency: string; extRef: string;
}): Promise<PaymentResult | null> {
  const { paymentId, email, name, amount, currency, extRef } = args;
  const archetypeCode = extRef.toLowerCase();

  if (!ARCHETYPES[archetypeCode as ArchetypeKey]) return null;

  const supabase = getSupabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('purchases')
    .select('access_token')
    .eq('payment_id', paymentId)
    .maybeSingle();

  if (existing) {
    return {
      productType:    'archetype_report',
      email, name, archetypeCode, amount, currency, paymentId,
      accessToken:    (existing as { access_token: string }).access_token,
      alreadyExisted: true,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: inserted, error } = await (supabase as any)
    .from('purchases')
    .insert({
      buyer_email:    email,
      buyer_name:     name,
      buyer_role:     'owner',
      archetype:      archetypeCode,
      product_type:   'archetype_report',
      payment_id:     paymentId,
      payment_status: 'approved',
      amount,
      currency,
    })
    .select('access_token')
    .single();

  if (error) throw new Error(`Supabase insert failed: ${error.message}`);

  return {
    productType:    'archetype_report',
    email, name, archetypeCode, amount, currency, paymentId,
    accessToken:    (inserted as { access_token: string }).access_token,
    alreadyExisted: false,
  };
}
