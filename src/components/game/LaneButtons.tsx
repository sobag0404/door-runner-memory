// ─── Lane Buttons Component ─────────────────────────────
// Bottom lane selection buttons

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { LANE_COLORS, LANE_LIGHT } from '../../lib/constants';

export function LaneButtons() {
  const pathCount = useGameStore((s) => s.settings.pathCount);
  const chooseLane = useGameStore((s) => s.chooseLane);
  const isRunning = useGameStore((s) => s.isRunning);
  const feedback = useGameStore((s) => s.feedback);

  const handleLane = useCallback(
    (lane: number) => {
      if (!isRunning || feedback !== null) return;
      chooseLane(lane);
    },
    [isRunning, feedback, chooseLane]
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 p-3 pb-5">
      <div className="grid gap-3 max-w-lg mx-auto"
        style={{ gridTemplateColumns: `repeat(${pathCount}, 1fr)` }}>
        {Array.from({ length: pathCount }).map((_, i) => {
          const color = LANE_COLORS[i % LANE_COLORS.length];
          const light = LANE_LIGHT[i % LANE_LIGHT.length];
          return (
            <motion.button key={i} onClick={() => handleLane(i)}
              disabled={!isRunning || feedback !== null}
              className="h-16 rounded-2xl font-black text-2xl text-white relative overflow-hidden disabled:opacity-40"
              style={{
                background: `linear-gradient(180deg, ${light} 0%, ${color} 100%)`,
                boxShadow: `0 4px 15px ${color}50, inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15)`,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/25 to-transparent rounded-t-2xl" />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/15 to-transparent rounded-b-2xl" />
              <span className="relative">{i + 1}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
