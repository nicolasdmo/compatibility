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
import GradientOrbs from '@/components/GradientOrbs';

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
  onComplete: (answers: Answers, questionIds: string[]) => void;
  eventName?: string;
};

type FixedProps = {
  mode: 'fixed';
  questions: Question[];
  onComplete: (answers: Answers) => void;
  eventName?: string;
};

type Props = AdaptiveProps | FixedProps;

// ─── Component ────────────────────────────────────────────────────────────────

export default function TestRunner(props: Props) {
  const { eventName = 'test_completed' } = props;

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
  const totalSoFar = queue.length;
  const isLast     = current === totalSoFar - 1;

  const maybeExpandQueue = useCallback(
    (newAnswers: Answers, newQueue: Question[]) => {
      if (props.mode !== 'adaptive') return newQueue;
      const phase1Done = UNIVERSAL_OPEN_IDS.length;
      if (Object.keys(newAnswers).length !== phase1Done) return newQueue;
      const fullIds   = buildQuestionSequence(newAnswers);
      const fullQueue = fullIds.map((id) => QUESTION_MAP[id]).filter(Boolean);
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
    [selected, answers, question, current, queue, maybeExpandQueue, eventName, props]
  );

  const handleBack = () => {
    if (current === 0) return;
    setDirection(-1);
    setCurrent((c) => c - 1);
    setSelected(null);
  };

  const approxTotal = UNIVERSAL_OPEN_IDS.length + TOTAL_ADAPTIVE_SHOWN + UNIVERSAL_CLOSE_IDS.length;

  // Accent colors per option for visual variety
  const OPTION_COLORS = ['#FF006E', '#8338EC', '#3A86FF', '#06FFA5'];

  return (
    <>
      <GradientOrbs />

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ── Progress bar ────────────────────────────────────────── */}
        <div className="flex items-center gap-4 px-5 sm:px-10 py-5 border-b border-white/5">
          <span className="font-mono text-[11px] text-white/50 tracking-widest shrink-0 tabular-nums">
            {current + 1}<span className="text-white/30 mx-1">/</span>{approxTotal}
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
            className="pill-tag shrink-0"
          >
            {CATEGORY_LABELS[question?.category ?? ''] ?? ''}
          </motion.span>
        </div>

        {/* ── Question + options ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-10 py-10">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={question?.id}
                custom={direction}
                variants={{
                  enter:  (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit:   (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                <h2 className="font-display text-3xl sm:text-4xl text-white leading-[1.1] mb-10">
                  {question?.text}
                </h2>

                <div className="flex flex-col gap-3">
                  {question?.options.map((opt, i) => {
                    const isChosen = selected === opt.letter;
                    const isDimmed = selected !== null && !isChosen;
                    const color    = OPTION_COLORS[i % OPTION_COLORS.length];

                    return (
                      <motion.button
                        key={opt.letter}
                        onClick={() => handleSelect(opt.letter)}
                        animate={{
                          opacity: isDimmed ? 0.25 : 1,
                          scale:   isChosen ? 0.98 : 1,
                        }}
                        transition={{ duration: 0.18 }}
                        whileHover={!selected ? { y: -2 } : {}}
                        whileTap={!selected ? { scale: 0.98 } : {}}
                        disabled={selected !== null}
                        className="group relative w-full text-left flex items-center gap-4 px-5 py-5 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden"
                        style={{
                          background: isChosen
                            ? `linear-gradient(135deg, ${color}40 0%, ${color}15 100%)`
                            : 'rgba(255, 255, 255, 0.04)',
                          border: isChosen
                            ? `2px solid ${color}`
                            : '2px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: isChosen
                            ? `0 0 32px ${color}55, inset 0 1px 0 ${color}33`
                            : 'none',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                        }}
                      >
                        {/* Hover glow */}
                        {!selected && (
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                              background: `radial-gradient(circle at 30% 50%, ${color}20 0%, transparent 70%)`,
                            }}
                          />
                        )}

                        <span
                          className="text-2xl shrink-0 relative"
                          style={isChosen ? { filter: `drop-shadow(0 0 8px ${color})` } : undefined}
                        >
                          {opt.emoji}
                        </span>
                        <span className="text-base sm:text-lg leading-snug text-white relative font-medium">
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
        <div className="px-5 sm:px-10 pb-8 flex justify-between items-center max-w-xl mx-auto w-full">
          <button
            onClick={handleBack}
            disabled={current === 0}
            className="font-mono text-xs text-white/40 tracking-wider uppercase hover:text-white transition-colors disabled:opacity-0"
          >
            ← Anterior
          </button>
          <span className="font-mono text-[10px] text-white/30 tracking-wider tabular-nums">
            {Math.max(0, approxTotal - current - 1)} restantes
          </span>
        </div>
      </div>
    </>
  );
}
