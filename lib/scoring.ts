import type { ArchetypeKey, Question, QuestionOption } from '@/data/questions';
import { ARCHETYPE_KEYS } from '@/data/archetypes';

export type Answers = Record<string, 'a' | 'b' | 'c' | 'd'>;

/**
 * Compute cumulative archetype scores given a set of answers and the
 * questions that were shown.
 */
export function computeArchetypeScores(
  answers: Answers,
  questions: Question[]
): Record<ArchetypeKey, number> {
  const scores: Record<ArchetypeKey, number> = {
    planificador: 0,
    espontaneo:   0,
    cuidador:     0,
    directo:      0,
    reflexivo:    0,
    intenso:      0,
  };

  for (const question of questions) {
    const letter = answers[question.id];
    if (!letter) continue;
    const opt = question.options.find((o) => o.letter === letter);
    if (!opt) continue;
    for (const [key, pts] of Object.entries(opt.scores)) {
      scores[key as ArchetypeKey] += pts as number;
    }
  }

  return scores;
}

/**
 * Returns the archetype key with the highest score.
 * Tie-breaks by order of ARCHETYPE_KEYS.
 */
export function computeArchetypeKey(scores: Record<ArchetypeKey, number>): ArchetypeKey {
  let best: ArchetypeKey = ARCHETYPE_KEYS[0];
  for (const key of ARCHETYPE_KEYS) {
    if (scores[key] > scores[best]) best = key;
  }
  return best;
}

/**
 * Score B's answers against A's:
 * +1 point for each question where B picked the exact same option as A.
 * Returns a number from 0 to the number of shared questions.
 */
export function computeMatchScore(
  aAnswers: Answers,
  bAnswers: Answers,
  questionIds: string[]
): number {
  let correct = 0;
  for (const id of questionIds) {
    if (aAnswers[id] && bAnswers[id] && aAnswers[id] === bAnswers[id]) {
      correct++;
    }
  }
  return correct;
}
