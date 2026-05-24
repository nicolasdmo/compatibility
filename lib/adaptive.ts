/**
 * Adaptive question selection engine.
 *
 * Flow:
 *  Phase 1 (universal-open):  4 fixed questions — same for everyone.
 *  Phase 2 (adaptive):        6 questions chosen to best differentiate the
 *                             top-2 archetypes after Phase 1.
 *  Phase 3 (universal-close): 2 fixed wrap-up questions — same for everyone.
 *  Total: 12 questions per person.
 *
 * B always answers A's exact sequence (stored in challenge.question_ids).
 */

import type { ArchetypeKey, Question } from '@/data/questions';
import {
  ADAPTIVE_POOL,
  QUESTION_MAP,
  UNIVERSAL_CLOSE_IDS,
  UNIVERSAL_OPEN_IDS,
  TOTAL_ADAPTIVE_SHOWN,
} from '@/data/questions';
import { computeArchetypeScores, computeArchetypeKey, type Answers } from '@/lib/scoring';

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Build the complete ordered list of question IDs for A's adaptive test.
 * Call this once A has finished answering all Phase 1 questions.
 *
 * @param phase1Answers  Answers to the 4 universal-open questions.
 * @returns              Full ordered question ID array (length = 12).
 */
export function buildQuestionSequence(phase1Answers: Answers): string[] {
  const phase1Questions = UNIVERSAL_OPEN_IDS.map((id) => QUESTION_MAP[id]);
  const scores          = computeArchetypeScores(phase1Answers, phase1Questions);
  const adaptiveIds     = selectAdaptiveQuestions(scores, [...UNIVERSAL_OPEN_IDS]);

  return [
    ...UNIVERSAL_OPEN_IDS,
    ...adaptiveIds,
    ...UNIVERSAL_CLOSE_IDS,
  ];
}

/**
 * Resolve an ordered array of question IDs to full Question objects.
 * Safe to call on the server (no side effects).
 */
export function resolveQuestions(questionIds: string[]): Question[] {
  return questionIds.map((id) => QUESTION_MAP[id]).filter(Boolean);
}

// ─── Internals ────────────────────────────────────────────────────────────────

/**
 * Select TOTAL_ADAPTIVE_SHOWN questions from ADAPTIVE_POOL that best
 * differentiate the top-2 archetypes.
 */
function selectAdaptiveQuestions(
  scores: Record<ArchetypeKey, number>,
  alreadyShown: readonly string[]
): string[] {
  // Rank archetypes
  const ranked = (Object.entries(scores) as [ArchetypeKey, number][])
    .sort((a, b) => b[1] - a[1]);

  const top1 = ranked[0][0];
  const top2 = ranked[1][0];

  // Differentiation score: how well a question separates top1 from top2.
  // = sum of |optionScores[top1] - optionScores[top2]| across all options.
  function diffScore(q: Question): number {
    return q.options.reduce((sum, opt) => {
      const s1 = opt.scores[top1] ?? 0;
      const s2 = opt.scores[top2] ?? 0;
      return sum + Math.abs(s1 - s2);
    }, 0);
  }

  // Filter out already-shown questions, sort by differentiation descending
  const candidates = ADAPTIVE_POOL
    .filter((q) => !alreadyShown.includes(q.id))
    .sort((a, b) => diffScore(b) - diffScore(a));

  const selected: string[] = [];
  const usedCategories: string[] = [];

  // First pass: pick highest-scoring questions, prefer category diversity
  for (const q of candidates) {
    if (selected.length >= TOTAL_ADAPTIVE_SHOWN) break;
    if (!usedCategories.includes(q.category) || selected.length < TOTAL_ADAPTIVE_SHOWN - 2) {
      selected.push(q.id);
      if (!usedCategories.includes(q.category)) usedCategories.push(q.category);
    }
  }

  // Second pass: fill remaining slots if diversity pass left gaps
  if (selected.length < TOTAL_ADAPTIVE_SHOWN) {
    for (const q of candidates) {
      if (selected.length >= TOTAL_ADAPTIVE_SHOWN) break;
      if (!selected.includes(q.id)) selected.push(q.id);
    }
  }

  return selected.slice(0, TOTAL_ADAPTIVE_SHOWN);
}
