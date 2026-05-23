import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import ChallengeClient from './ChallengeClient';

type Props = {
  params: Promise<{ shortcode: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shortcode } = await params;
  const db = getSupabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (db as any)
    .from('challenges')
    .select('creator_name')
    .eq('shortcode', shortcode.toUpperCase())
    .single();

  const name = (data as { creator_name: string } | null)?.creator_name ?? 'alguien';
  return {
    title: `¿Cuánto conocés a ${name}? — ¿Cuánto me conocés?`,
    description: `${name} te desafió. Respondé 10 preguntas pensando en ${name} y descubrí cuánto lo/la conocés de verdad.`,
  };
}

export default async function ChallengePage({ params }: Props) {
  const { shortcode } = await params;
  const upper = shortcode.toUpperCase();

  const db = getSupabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawChallenge, error } = await (db as any)
    .from('challenges')
    .select('creator_name')
    .eq('shortcode', upper)
    .single();

  if (error || !rawChallenge) notFound();

  const challenge = rawChallenge as { creator_name: string };

  return (
    <ChallengeClient
      shortcode={upper}
      creatorName={challenge.creator_name}
    />
  );
}
