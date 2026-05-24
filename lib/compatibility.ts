/**
 * Compatibility A ↔ B — pure calculation logic.
 *
 * Given A's answers and B's guesses on A, we compute:
 *  - per-dimension scores (% of agreement within each category)
 *  - overall compatibility score (weighted average)
 *
 * "Dimensions" map 1:1 to the question categories so users immediately
 * recognise what they were asked about.
 */

import { QUESTION_MAP, type Category, type Question } from '@/data/questions';
import type { Answers } from '@/lib/scoring';

export type DimensionScore = {
  category: Category;
  label:    string;
  emoji:    string;
  score:    number;   // 0-100 (% match)
  answered: number;   // questions answered in this dimension
};

const CATEGORY_META: Record<Category, { label: string; emoji: string }> = {
  rutinas:      { label: 'Rutinas',      emoji: '🕐' },
  vinculos:     { label: 'Vínculos',     emoji: '💗' },
  emociones:    { label: 'Emociones',    emoji: '🌊' },
  dilemas:      { label: 'Dilemas',      emoji: '⚡' },
  gustos:       { label: 'Gustos',       emoji: '🎨' },
  comunicacion: { label: 'Comunicación', emoji: '💬' },
};

/**
 * Per-dimension match scoring.
 * A dimension's score is the % of questions in that category where B picked
 * the same letter A picked. Dimensions with zero questions answered get 0.
 */
export function computeDimensionScores(
  aAnswers:    Answers,
  bAnswers:    Answers,
  questionIds: string[]
): DimensionScore[] {
  const buckets = new Map<Category, { matched: number; total: number }>();

  for (const id of questionIds) {
    const q: Question | undefined = QUESTION_MAP[id];
    if (!q) continue;

    const cur = buckets.get(q.category) ?? { matched: 0, total: 0 };
    cur.total++;
    if (aAnswers[id] && bAnswers[id] && aAnswers[id] === bAnswers[id]) {
      cur.matched++;
    }
    buckets.set(q.category, cur);
  }

  // Always return all 6 dimensions in canonical order
  const ORDER: Category[] = ['rutinas', 'vinculos', 'emociones', 'dilemas', 'gustos', 'comunicacion'];

  return ORDER.map((category) => {
    const stats = buckets.get(category);
    const score = stats && stats.total > 0
      ? Math.round((stats.matched / stats.total) * 100)
      : 0;
    return {
      category,
      label:    CATEGORY_META[category].label,
      emoji:    CATEGORY_META[category].emoji,
      score,
      answered: stats?.total ?? 0,
    };
  });
}

/**
 * Overall compatibility — weighted average of dimensions actually answered.
 * Dimensions without questions don't drag the score down.
 */
export function computeOverallCompat(dimensions: DimensionScore[]): number {
  const answered = dimensions.filter((d) => d.answered > 0);
  if (answered.length === 0) return 0;
  const weighted = answered.reduce((sum, d) => sum + d.score * d.answered, 0);
  const total    = answered.reduce((sum, d) => sum + d.answered, 0);
  return Math.round(weighted / total);
}

/**
 * Returns a verdict header based on the overall %.
 */
export function compatVerdict(overall: number): { headline: string; tagline: string; color: string } {
  if (overall >= 85) return { headline: 'Almas gemelas',         tagline: 'Se entienden sin hablar.',                color: '#06FFA5' };
  if (overall >= 70) return { headline: 'Mucha sintonía',        tagline: 'Click profundo en lo importante.',        color: '#06FFA5' };
  if (overall >= 55) return { headline: 'Compatibilidad sólida', tagline: 'Se complementan más de lo que parece.',   color: '#FFBE0B' };
  if (overall >= 40) return { headline: 'Mundos distintos',      tagline: 'Diferentes — y hay magia en eso.',         color: '#FB5607' };
  if (overall >= 25) return { headline: 'Polos opuestos',        tagline: 'Algunas chispas, mucho por descubrir.',    color: '#FF006E' };
  return                  { headline: 'Casi sin overlap',      tagline: '¿Qué los junta? Es la pregunta del día.', color: '#FF006E' };
}
