'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@vercel/analytics';
import {
  QUESTION_MAP,
  UNIVERSAL_OPEN_IDS,
  UNIVERSAL_CLOSE_IDS,
  TOTAL_ADAPTIVE_SHOWN,
  type Question,
} from '@/data/questions';
import { computeArchetypeScores, computeArchetypeKey, type Answers } from '@/lib/scoring';
import { buildQuestionSequence } from '@/lib/adaptive';

const CATEGORY_LABELS: Record<string, string> = {
  rutinas:      'Rutinas',
  vinculos:     'Vínculos',
  emociones:    'Emociones',
  dilemas:      'Dilemas',
  gustos:       'Gustos',
  comunicacion: 'Comunicación',
};

// ─── Prop types ───────────────────────────────────────────────────────────────

type AdaptiveProps = {
  mode: 'adaptive';
  /** Called when all questions are answered. */
  onComplete: (answers: Answers, questionIds: string[]) => void;
  eventName?: string;
};

type FixedProps = {
  mode: 'fixed';
  /** The exact questions to show (A's personalised set). */
  questions: Question[];
  onComplete: (answers: Answers) => void;
  eventName?: string;
};

type Props = AdaptiveProps | FixedProps;

// ─── Component ────────────────────────────────────────────────────────────────

export default function TestRunner(props: Props) {
  const { onComplete, eventName = 'test_completed' } = props;

  // ── Queue initialisation ──────────────────────────────────────────────────
  // Adaptive: start with Phase 1 (universal-open) questions only.
  // Fixed: start with all passed questions.
  const initialQueue: Question[] =
    props.mode === 'fixed'
      ? props.questions
      : UNIVERSAL_OPEN_IDS.map((id) => QUESTION_MAP[id]);

  const [queue,     setQueue]     = useState<Question[]>(initialQueue);
  const [current,   setCurrent]   = useState(0);
  const [answers,   setAnswers]   = useState<Answers>({});
  const [selected,  setSelected]  = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [direction, setDirection] = useState(1);

  const question   = queue[current];
  const totalSoFar = queue.length; // may grow during adaptive
  const progress   = current / (UNIVERSAL_OPEN_IDS.length + TOTAL_ADAPTIVE_SHOWN + UNIVERSAL_CLOSE_IDS.length);
  const isLast     = current === totalSoFar - 1;

  // After Phase 1 answers, build the full adaptive sequence and expand the queue.
  const maybeExpandQueue = useCallback(
    (newAnswers: Answers, newQueue: Question[]) => {
      if (props.mode !== 'adaptive') return newQueue;
      const phase1Done = UNIVERSAL_OPEN_IDS.length;
      if (Object.keys(newAnswers).length !== phase1Done) return newQueue;

      // We now have all Phase 1 answers — build the full sequence.
      const fullIds     = buildQuestionSequence(newAnswers);
      const fullQueue   = fullIds.map((id) => QUESTION_MAP[id]).filter(Boolean);
      setQueue(fullQueue);
      return fullQueue;
    },
    [props.mode]
  );

  const handleSelect = useCallback(
    (letter: 'a' | 'b' | 'c' | 'd') => {
      if (selected) return;
      setSelected(letter);

      const newAnswers = { ...answers, [question.id]: letter };
      setAnswers(newAnswers);

      setTimeout(() => {
        const expandedQueue = maybeExpandQueue(newAnswers, queue);
        const last          = current === expandedQueue.length - 1;

        if (last) {
          const archetypeKey = computeArchetypeKey(
            computeArchetypeScores(newAnswers, expandedQueue)
          );
          track(eventName, { archetype: archetypeKey });

          if (props.mode === 'adaptive') {
            (props.onComplete as AdaptiveProps['onComplete'])(
              newAnswers,
              expandedQueue.map((q) => q.id)
            );
          } else {
            (props.onComplete as FixedProps['onComplete'])(newAnswers);
          }
        } else {
          setDirection(1);
          setCurrent((c) => c + 1);
          setSelected(null);
        }
      }, 380);
    },
    [selected, answers, question, current, queue, maybeExpandQueue, onComplete, eventName, props.mode]
  );

  const handleBack = () => {
    if (current === 0) return;
    setDirection(-1);
    setCurrent((c) => c - 1);
    setSelected(null);
  };

  // Approximate total for progress bar
  const approxTotal = UNIVERSAL_OPEN_IDS.length + TOTAL_ADAPTIVE_SHOWN + UNIVERSAL_CLOSE_IDS.length;

  return (
    <div className="min-h-screen flex flex-col bg-bg">

      {/* ── Progress bar ────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-5 sm:px-10 py-4 border-b border-line-soft">
        <span className="font-mono text-[11px] text-ink-mute tracking-widest shrink-0">
          {current + 1}&thinsp;/&thinsp;{approxTotal}
        </span>
        <div className="progress-track flex-1">
          <motion.div
            className="progress-fill"
            animate={{ width: `${((current + 1) / approxTotal) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
        <motion.span
          key={question?.category}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow shrink-0"
        >
          {CATEGORY_LABELS[question?.category ?? ''] ?? ''}
        </motion.span>
      </div>

      {/* ── Question + options ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-10 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question?.id}
              custom={direction}
              variants={{
                enter:  (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit:   (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2
                className="font-serif text-2xl sm:text-3xl text-ink leading-snug mb-7"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {question?.text}
              </h2>

              <div className="flex flex-col gap-2.5">
                {question?.options.map((opt) => {
                  const isChosen = selected === opt.letter;
                  const isDimmed = selected !== null && !isChosen;

                  return (
                    <motion.button
                      key={opt.letter}
                      onClick={() => handleSelect(opt.letter)}
                      animate={{ opacity: isDimmed ? 0.22 : 1, scale: isChosen ? 0.98 : 1 }}
                      transition={{ duration: 0.16 }}
                      whileHover={!selected ? { scale: 1.005 } : {}}
                      disabled={selected !== null}
                      className={`
                        w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border-2
                        transition-all duration-150 cursor-pointer
                        ${isChosen
                          ? 'bg-ink border-ink text-bg-card shadow-sm'
                          : 'bg-bg-card border-line hover:border-ink-soft hover:shadow-sm'
                        }
                      `}
                    >
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className={`text-sm leading-snug ${isChosen ? 'text-bg-card' : 'text-ink'}`}>
                        {opt.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Back / counter ──────────────────────────────────────── */}
      <div className="px-5 sm:px-10 pb-6 flex justify-between items-center max-w-lg mx-auto w-full">
        <button
          onClick={handleBack}
          disabled={current === 0}
          className="font-mono text-xs text-ink-faint tracking-wider uppercase hover:text-ink transition-colors disabled:opacity-0"
        >
          ← Anterior
        </button>
        <span className="font-mono text-[10px] text-ink-faint tracking-wider">
          {Math.max(0, approxTotal - current - 1)} restantes
        </span>
      </div>
    </div>
  );
}
