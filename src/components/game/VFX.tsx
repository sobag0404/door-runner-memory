// ─── VFX Components ──────────────────────────────────────
// Visual effects: speed lines, particle burst, coin effect, screen flash, runner trail

import { motion } from 'framer-motion';
import type { GameTheme } from '../../lib/themes';

/** Deterministic pseudo-random number generator (LCG) for pure VFX data.
 *  Avoids `Math.random()` inside render, which violates react-hooks/purity. */
function seededRng(seed: number) {
  let s = (seed | 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Pre-computed speed line data (deterministic, no runtime randomness)
const SPEED_LINES = Array.from({ length: 8 }).map((_, i) => {
  const rng = seededRng(i * 37 + 7);
  return {
    id: i, left: 5 + rng() * 90, width: 1 + rng() * 2,
    duration: 0.4 + rng() * 0.4, delay: rng() * 1, opacity: 0.15 + rng() * 0.2,
  };
});

// Pre-computed particle data for each type (deterministic)
function buildParticles(isCorrect: boolean) {
  return Array.from({ length: 24 }).map((_, i) => {
    const rng = seededRng(i * 53 + (isCorrect ? 13 : 71));
    return {
      id: i, x: 20 + rng() * 60, delay: rng() * 0.2,
      duration: 0.5 + rng() * 0.5, size: 4 + rng() * 10,
      angle: -50 + rng() * 100,
      isStar: rng() > 0.4,
      yDrift: 120 + rng() * 80,
      rotation: rng() * 720 - 360,
    };
  });
}

const CORRECT_PARTICLES = buildParticles(true);
const WRONG_PARTICLES = buildParticles(false);

// ─── Speed Lines ───────────────────────────────────────
export function SpeedLines({ theme }: { theme: GameTheme }) {
  const isNeon = theme.id === 'neon';
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {SPEED_LINES.map(l => (
        <div key={l.id} className="absolute top-0 rounded-full"
          style={{
            left: `${l.left}%`,
            width: l.width,
            height: '30%',
            opacity: l.opacity,
            backgroundColor: isNeon ? theme.accent : 'rgba(255,255,255,0.8)',
            boxShadow: isNeon ? `0 0 4px ${theme.accent}60` : undefined,
            animation: `speedLine ${l.duration}s linear ${l.delay}s infinite`,
          }} />
      ))}
    </div>
  );
}

// ─── Particle Burst ────────────────────────────────────
export function ParticleBurst({ type, theme }: { type: 'correct' | 'wrong'; theme: GameTheme }) {
  const particles = type === 'correct' ? CORRECT_PARTICLES : WRONG_PARTICLES;
  const isNeon = theme.id === 'neon';

  // Theme-aware particle colors
  const correctColors = [theme.hudScoreAccent, theme.accent, theme.accent2, '#FFFFFF'];
  const wrongColors = [theme.timerDanger, '#FF6B6B', theme.accent2, '#FFFFFF'];
  const colors = type === 'correct' ? correctColors : wrongColors;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 25 }}>
      {particles.map(p => {
        const color = colors[p.id % colors.length];
        return (
          <motion.div key={p.id} className="absolute"
            style={{ left: `${p.x}%`, bottom: '30%', width: p.size, height: p.size }}
            initial={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
            animate={{ opacity: 0, y: -p.yDrift, x: p.angle * 2.5, scale: 0, rotate: p.rotation }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          >
            {p.isStar ? (
              <div style={{
                color,
                fontSize: p.size,
                lineHeight: 1,
                textShadow: isNeon ? `0 0 6px ${color}` : undefined,
                filter: isNeon ? `brightness(1.3)` : undefined,
              }}>★</div>
            ) : (
              <div className="w-full h-full rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: isNeon ? `0 0 6px ${color}80` : undefined,
                }} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Coin Effect ───────────────────────────────────────
export function CoinEffect({ laneX, theme }: { laneX: number; theme: GameTheme }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 26 }}>
      <motion.div className="absolute font-black text-xl"
        style={{
          left: `${laneX}%`,
          bottom: '38%',
          color: theme.hudScoreAccent,
          textShadow: isNeonTheme(theme) ? `0 0 12px ${theme.accent}, 0 2px 8px ${theme.accent}40` : `0 2px 8px ${theme.accent}80`,
        }}
        initial={{ opacity: 1, y: 0, scale: 0.5 }}
        animate={{ opacity: 0, y: -70, scale: 1.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        +1
      </motion.div>
    </div>
  );
}

// ─── Screen Flash ──────────────────────────────────────
export function ScreenFlash({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-35"
      style={{ backgroundColor: color }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    />
  );
}

// ─── Runner Trail ──────────────────────────────────────
export function RunnerTrail({ pathCount, currentLane, theme }: {
  pathCount: number; currentLane: number; theme: GameTheme;
}) {
  const leftPercent = getLanePercent(currentLane, pathCount);
  const isNeon = theme.id === 'neon';

  return (
    <div className="absolute bottom-[22%] z-19 pointer-events-none"
      style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}>
      {/* Motion blur trail */}
      {isNeon ? (
        // Neon: glowing afterimage
        <>
          <motion.div
            className="absolute w-8 h-20 rounded-lg"
            style={{
              backgroundColor: theme.accent,
              opacity: 0.1,
              boxShadow: `0 0 20px ${theme.accent}40`,
            }}
            animate={{ opacity: [0.1, 0], y: [0, 5], scale: [1, 0.8] }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute w-6 h-16 rounded-lg"
            style={{
              backgroundColor: theme.accent2,
              opacity: 0.08,
              boxShadow: `0 0 15px ${theme.accent2}30`,
            }}
            animate={{ opacity: [0.08, 0], y: [0, 3], scale: [1, 0.7] }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </>
      ) : (
        // Classic/Retro: subtle speed lines
        <>
          {[-1, 0, 1].map((offset) => (
            <motion.div
              key={offset}
              className="absolute w-1 rounded-full"
              style={{
                backgroundColor: theme.runnerDust,
                left: `${offset * 6}px`,
              }}
              animate={{
                height: [8, 20, 4],
                opacity: [0.3, 0.1, 0],
                y: [0, 8],
              }}
              transition={{
                duration: 0.35,
                repeat: Infinity,
                repeatDelay: 0.1,
                ease: 'easeOut',
                delay: Math.abs(offset) * 0.05,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

function getLanePercent(laneIndex: number, pathCount: number): number {
  return ((laneIndex + 0.5) / pathCount) * 100;
}

function isNeonTheme(theme: GameTheme): boolean {
  return theme.id === 'neon';
}
