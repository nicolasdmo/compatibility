import { notFound, redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';
import { PREMIUM } from '@/data/premiumContent';
import ExitoClient from '@/components/ExitoClient';

interface Props {
  params:       Promise<{ code: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function VerReportePage({ params, searchParams }: Props) {
  const { code }  = await params;
  const { token } = await searchParams;

  const lower     = code?.toLowerCase();
  const archetype = ARCHETYPES[lower as ArchetypeKey];
  const premium   = PREMIUM[lower];
  if (!archetype || !premium) notFound();
  if (!token) redirect(`/reporte/${lower}`);

  // Verify token in Supabase
  let paymentId = 'verified';
  try {
    const supabase = getSupabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('purchases')
      .select('payment_id, archetype_code, payment_status')
      .eq('access_token', token)
      .single();

    if (error || !data) redirect(`/reporte/${lower}?error=token`);
    if (data.payment_status !== 'approved') redirect(`/reporte/${lower}?error=pago`);
    if (data.archetype_code !== lower) redirect(`/reporte/${lower}?error=token`);

    paymentId = data.payment_id;
  } catch {
    redirect(`/reporte/${lower}?error=token`);
  }

  return <ExitoClient code={lower} paymentId={paymentId} />;
}
