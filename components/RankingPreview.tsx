'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ARCHETYPES } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';

type RankItem = {
  name:      string;
  archetype: string;
  shortcode: string;
  attempts:  number;
  avgScore:  number;
};

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * Compact top-5 leaderboard for the homepage.
 * Fetches /api/ranking on mount.
 */
export default function RankingPreview() {
  const [ranking, setRanking] = useState<RankItem[] | null>(null);

  useEffect(() => {
    fetch('/api/ranking')
      .then((r) => r.json())
      .then((d) => setRanking(d.ranking?.slice(0, 5) ?? []))
      .catch(() => setRanking([]));
  }, []);

  if (ranking === null) {
    return (
      <div className="flex flex-col gap-2.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="card-glass h-[68px] animate-pulse"
            style={{ opacity: 0.6 - i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (ranking.length === 0) {
    return (
      <div className="card-glass p-10 text-center">
        <p className="text-4xl mb-3">🌱</p>
        <p className="text-white text-lg font-semibold mb-1">Todavía no hay ranking</p>
        <p className="text-white/50 text-sm">
          Sé el primero — creá tu reto y compartilo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {ranking.map((item, idx) => (
        <RankRow key={item.shortcode} item={item} index={idx} />
      ))}
    </div>
  );
}

function RankRow({ item, index }: { item: RankItem; index: number }) {
  const archetype = ARCHETYPES[item.archetype as ArchetypeKey];
  const medal     = MEDALS[index];

  return (
    <motion.a
      href={`/r/${item.shortcode}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="card-glass flex items-center gap-4 px-5 py-4 group hover:scale-[1.01] transition-transform"
    >
      {/* Rank */}
      <div className="w-10 flex items-center justify-center shrink-0">
        {medal ? (
          <span className="text-2xl">{medal}</span>
        ) : (
          <span className="font-display text-xl text-white/40">#{index + 1}</span>
        )}
      </div>

      {/* Archetype emoji */}
      <span
        className="text-2xl shrink-0"
        style={{ filter: archetype ? `drop-shadow(0 0 8px ${archetype.color}66)` : undefined }}
      >
        {archetype?.emoji ?? '👤'}
      </span>

      {/* Name + archetype */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-base truncate group-hover:underline">
          {item.name}
        </p>
        <p className="text-white/40 text-xs font-mono uppercase tracking-wider truncate">
          {archetype?.name ?? 'arquetipo'}
        </p>
      </div>

      {/* Attempts count */}
      <div className="text-right shrink-0">
        <p className="font-display text-2xl text-white tabular-nums">
          {item.attempts}
        </p>
        <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider">
          intentos
        </p>
      </div>
    </motion.a>
  );
}
