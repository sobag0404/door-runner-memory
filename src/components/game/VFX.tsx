// ─── VFX Components ──────────────────────────────────────
// Visual effects: speed lines, particle burst, coin effect

import { useMemo } from 'react';
import { motion } from 'framer-motion';

// ─── Speed Lines ───────────────────────────────────────
export function SpeedLines() {
  const lines = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: i, left: 5 + Math.random() * 90, width: 1 + Math.random() * 2,
      duration: 0.4 + Math.random() * 0.4, delay: Math.random() * 1, opacity: 0.15 + Math.random() * 0.2,
    })), []
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {lines.map(l => (
        <div key={l.id} className="absolute top-0 rounded-full bg-white"
          style={{ left: `${l.left}%`, width: l.width, height: '30%', opacity: l.opacity, animation: `speedLine ${l.duration}s linear ${l.delay}s infinite` }} />
      ))}
    </div>
  );
}

// ─── Particle Burst ────────────────────────────────────
export function ParticleBurst({ type }: { type: 'correct' | 'wrong' }) {
  const isCorrect = type === 'correct';
  const particles = useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i, x: 25 + Math.random() * 50, delay: Math.random() * 0.25,
      duration: 0.5 + Math.random() * 0.5, size: 4 + Math.random() * 8,
      angle: -40 + Math.random() * 80,
      color: isCorrect ? ['#FFD23F', '#FF6B35', '#06D6A0', '#FFF'][i % 4] : ['#EF476F', '#FF6B6B', '#FF9F43', '#FFF'][i % 4],
      isStar: Math.random() > 0.5,
    })), [isCorrect]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 25 }}>
      {particles.map(p => (
        <motion.div key={p.id} className="absolute"
          style={{ left: `${p.x}%`, bottom: '30%', width: p.size, height: p.size }}
          initial={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
          animate={{ opacity: 0, y: -120 - Math.random() * 80, x: p.angle * 2.5, scale: 0, rotate: 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        >
          {p.isStar ? (
            <div style={{ color: p.color, fontSize: p.size, lineHeight: 1 }}>*</div>
          ) : (
            <div className="w-full h-full rounded-full" style={{ backgroundColor: p.color }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Coin Effect ───────────────────────────────────────
export function CoinEffect({ laneX }: { laneX: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 26 }}>
      <motion.div className="absolute font-black text-xl text-[#FFD23F]"
        style={{ left: `${laneX}%`, bottom: '38%', textShadow: '0 2px 8px #FF6B3580' }}
        initial={{ opacity: 1, y: 0, scale: 0.5 }}
        animate={{ opacity: 0, y: -70, scale: 1.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        +1
      </motion.div>
    </div>
  );
}
