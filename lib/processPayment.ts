import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export interface PaymentResult {
  email:          string;
  name:           string;

  /** A's archetype — what the compatibility report is about. */
  archetypeCode:  string;

  /** Access token generated for this purchase. */
  accessToken:    string;

  amount:         number;
  currency:       string;
  paymentId:      string;

  /** The attempt this compatibility report covers. */
  attemptId:      string;

  /** true = record already existed (idempotent re-call) */
  alreadyExisted: boolean;
}

/**
 * Verifies a MercadoPago compatibility-report payment and upserts the purchase.
 * Idempotent — same payment_id always returns the same access_token.
 *
 * External reference format: `compat:{attemptId}` (only product type supported).
 */
export async function processApprovedPayment(paymentId: string): Promise<PaymentResult | null> {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error('MP_ACCESS_TOKEN not configured');

  const client  = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(client);
  const data    = await payment.get({ id: paymentId });

  if (data.status !== 'approved') return null;

  const email    = data.payer?.email ?? '';
  const name     = data.payer?.first_name ?? '';
  const amount   = data.transaction_amount ?? 0;
  const currency = data.currency_id ?? 'ARS';
  const extRef   = data.external_reference ?? '';

  if (!extRef.startsWith('compat:')) return null;

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
    // Fetch challenge archetype for return shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: attemptRow } = await (supabase as any)
      .from('attempts')
      .select('challenge_id, challenges!inner(archetype)')
      .eq('id', attemptId)
      .maybeSingle();
    const archetypeCode = attemptRow?.challenges?.archetype ?? '';
    return {
      email, name, amount, currency, paymentId,
      attemptId, archetypeCode,
      accessToken:    (existing as { access_token: string }).access_token,
      alreadyExisted: true,
    };
  }

  // Fetch attempt + challenge
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
      buyer_email:    email || null,
      buyer_name:     name  || attemptRow.guesser_name,
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
    email, name, amount, currency, paymentId,
    attemptId,
    archetypeCode:  challengeRow.archetype,
    accessToken:    (inserted as { access_token: string }).access_token,
    alreadyExisted: false,
  };
}
