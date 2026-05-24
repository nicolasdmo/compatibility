import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  computeArchetypeScores,
  computeArchetypeKey,
  computeMatchScore,
  type Answers,
} from '@/lib/scoring';
import { resolveQuestions } from '@/lib/adaptive';

type ChallengeRow = {
  id:           string;
  answers:      Record<string, string>;
  question_ids: string[];
  archetype:    string;
};

export async function POST(req: NextRequest) {
  try {
    const { shortcode, guesserName, answers } = await req.json();

    if (!shortcode || !guesserName || !answers) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const db    = getSupabaseAdmin();
    const upper = (shortcode as string).toUpperCase();

    // Fetch the challenge
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawChallenge, error: fetchErr } = await (db as any)
      .from('challenges')
      .select('id, answers, question_ids, archetype')
      .eq('shortcode', upper)
      .single();

    if (fetchErr || !rawChallenge) {
      return NextResponse.json({ error: 'Reto no encontrado' }, { status: 404 });
    }

    const challenge = rawChallenge as ChallengeRow;
    const questions = resolveQuestions(challenge.question_ids ?? []);

    // Score B vs A (exact same-letter match)
    const score            = computeMatchScore(
      challenge.answers as Answers,
      answers as Answers,
      challenge.question_ids ?? []
    );
    // Compute B's apparent archetype from their answers
    const guessedScores    = computeArchetypeScores(answers as Answers, questions);
    const guessedArchetype = computeArchetypeKey(guessedScores);
    const total            = challenge.question_ids?.length ?? questions.length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: attemptRow, error: insertErr } = await (db as any)
      .from('attempts')
      .insert({
        challenge_id:        challenge.id,
        guesser_name:        (guesserName as string).trim(),
        answers,
        score,
        perceived_archetype: guessedArchetype,
      })
      .select('id')
      .single();

    if (insertErr || !attemptRow) {
      console.error('[attempt POST]', insertErr);
      return NextResponse.json({ error: 'Error guardando el intento' }, { status: 500 });
    }

    return NextResponse.json({
      attemptId:        (attemptRow as { id: string }).id,
      score,
      total,
      ownerArchetype:   challenge.archetype,
      guessedArchetype,
    });
  } catch (err) {
    console.error('[attempt POST]', err);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}
