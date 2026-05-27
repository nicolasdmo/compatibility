import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { resolveQuestions } from '@/lib/adaptive';
import ChallengeClient from './ChallengeClient';

type Props = {
  params: Promise<{ shortcode: string }>;
};

type ChallengeRow = {
  creator_name: string;
  question_ids: string[];
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
  const firstName = name.split(' ')[0];
  const title = `¿Cuánto conocés a ${firstName}?`;
  const description = `${firstName} te desafió. 12 preguntas, 2 minutos. Probá si lo conocés de verdad.`;

  return {
    title:       `${title} — ¿Cuánto me conocés?`,
    description,
    openGraph: {
      title,
      description,
      type:      'website',
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ChallengePage({ params }: Props) {
  const { shortcode } = await params;
  const upper = shortcode.toUpperCase();

  const db = getSupabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawChallenge, error } = await (db as any)
    .from('challenges')
    .select('creator_name, question_ids')
    .eq('shortcode', upper)
    .single();

  if (error || !rawChallenge) notFound();

  const challenge = rawChallenge as ChallengeRow;
  const questions = resolveQuestions(challenge.question_ids ?? []);

  return (
    <ChallengeClient
      shortcode={upper}
      creatorName={challenge.creator_name}
      questions={questions}
    />
  );
}
