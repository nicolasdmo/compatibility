import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { computeCode, isAPole, type Answers, type AnswerLetter } from '@/lib/scoring';
import { QUESTIONS } from '@/data/questions';

type ChallengeRow = {
  id:        string;
  answers:   Record<string, string>;
  archetype: string;
};

/**
 * Score: number of questions where A and B land on the same pole.
 * Pole-A = a or b. Pole-B = c or d.
 * Uses poles (not exact letters) because that's what the archetype is based on.
 */
function computeScore(aAnswers: Answers, bAnswers: Answers): number {
  let correct = 0;
  for (const question of QUESTIONS) {
    const aLetter = aAnswers[question.id] as AnswerLetter | undefined;
    const bLetter = bAnswers[question.id] as AnswerLetter | undefined;
    if (aLetter && bLetter && isAPole(aLetter) === isAPole(bLetter)) {
      correct++;
    }
  }
  return correct; // 0 – QUESTIONS.length (10)
}

export async function POST(req: NextRequest) {
  try {
    const { shortcode, guesserName, answers } = await req.json();

    if (!shortcode || !guesserName || !answers) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const db  = getSupabaseAdmin();
    const upper = (shortcode as string).toUpperCase();

    // Fetch the challenge by shortcode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawChallenge, error: fetchErr } = await (db as any)
      .from('challenges')
      .select('id, answers, archetype')
      .eq('shortcode', upper)
      .single();

    if (fetchErr || !rawChallenge) {
      return NextResponse.json({ error: 'Reto no encontrado' }, { status: 404 });
    }

    const challenge = rawChallenge as ChallengeRow;
    const score             = computeScore(challenge.answers as Answers, answers as Answers);
    const guessedArchetype  = computeCode(answers as Answers);

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
      total:            QUESTIONS.length,
      ownerArchetype:   challenge.archetype,
      guessedArchetype,
    });
  } catch (err) {
    console.error('[attempt POST]', err);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}
