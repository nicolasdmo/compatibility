import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { auth } from '@/lib/auth';
import { computeArchetypeScores, computeArchetypeKey, type Answers } from '@/lib/scoring';
import { resolveQuestions } from '@/lib/adaptive';

// Unambiguous charset — no 0/O, 1/I/L confusion
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode(length: number): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, answers, questionIds } = await req.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'name es requerido' }, { status: 400 });
    }
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'answers es requerido' }, { status: 400 });
    }
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'questionIds es requerido' }, { status: 400 });
    }

    // Link the challenge to the signed-in user by email (trusted, server-side).
    // Falls back to the optional email from the request body for anonymous creators.
    let creatorEmail: string | null = null;
    try {
      const session = await auth();
      creatorEmail = session?.user?.email ?? null;
    } catch {
      // anonymous flow — creatorEmail stays null
    }
    if (!creatorEmail && typeof email === 'string' && email.trim()) {
      creatorEmail = email.trim();
    }

    const questions = resolveQuestions(questionIds as string[]);
    const scores    = computeArchetypeScores(answers as Answers, questions);
    const archetype = computeArchetypeKey(scores);
    const db        = getSupabaseAdmin();

    for (let attempt = 0; attempt < 5; attempt++) {
      const shortcode = randomCode(5);
      const ownerCode = randomCode(7);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (db as any).from('challenges').insert({
        shortcode,
        owner_code:    ownerCode,
        creator_name:  name.trim(),
        creator_email: creatorEmail,
        answers,
        question_ids:  questionIds,
        archetype,
      });

      if (!error) {
        return NextResponse.json({ shortcode, ownerCode });
      }

      if (error.code !== '23505') {
        console.error('[challenge POST]', error);
        return NextResponse.json({ error: 'Error guardando el reto' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'No se pudo generar un código único' }, { status: 500 });
  } catch (err) {
    console.error('[challenge POST]', err);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}
