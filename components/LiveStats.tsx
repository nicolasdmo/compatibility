'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Stats = {
  challenges: number;
  attempts:   number;
};

/**
 * Live global stats — animated count-up on mount.
 * Fetches /api/stats once when the component renders.
 */
export default function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((s) => setStats(s))
      .catch(() => setStats({ challenges: 0, attempts: 0 }));
  }, []);

  return (
    <div className="flex items-center gap-6 sm:gap-10 justify-center">
      <StatItem label="retos" value={stats?.challenges ?? 0} color="#FF006E" />
      <div className="w-px h-10 bg-white/10" />
      <StatItem label="intentos" value={stats?.attempts ?? 0} color="#06FFA5" />
    </div>
  );
}

function StatItem({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <span
        className="font-display text-4xl sm:text-5xl tabular-nums"
        style={{ color, textShadow: `0 0 24px ${color}66` }}
      >
        <CountUp end={value} />
      </span>
      <span className="text-xs font-mono uppercase tracking-widest text-white/40 mt-1">
        {label}
      </span>
    </motion.div>
  );
}

function CountUp({ end }: { end: number }) {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (end === 0) return;
    const duration = 1200;
    const start    = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(end * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end]);

  return <>{v.toLocaleString('es-AR')}</>;
}
