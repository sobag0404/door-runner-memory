import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { t } from '../../lib/i18n';
import type { GameTheme } from '../../lib/themes';

// ─── Swipe Hint Overlay ────────────────────────────────
export function SwipeHint({ pathCount, theme }: { pathCount: number; theme: GameTheme }) {
  const [visible, setVisible] = useState(true);
  const isRunning = useGameStore((s) => s.isRunning);
  const lang = useGameStore((s) => s.settings.lang);
  const [isTouchDevice] = useState(
    () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isRunning || !visible || pathCount < 2) return null;

  const touchHint = (
    <>
      <motion.span
        className="font-bold text-sm"
        style={{ color: theme.textLight, opacity: 0.8 }}
        animate={{ x: [-4, 4, -4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {'< >'}
      </motion.span>
      <span className="text-xs font-medium" style={{ color: theme.textLight, opacity: 0.6 }}>{t('hint.swipe', lang)}</span>
    </>
  );

  const keyboardHint = (
    <>
      <kbd className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: theme.textLight, opacity: 0.8 }}>←</kbd>
      <kbd className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: theme.textLight, opacity: 0.8 }}>→</kbd>
      <span className="text-xs" style={{ color: theme.textLight, opacity: 0.4 }}>/</span>
      <kbd className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: theme.textLight, opacity: 0.8 }}>A</kbd>
      <kbd className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: theme.textLight, opacity: 0.8 }}>D</kbd>
      <span className="text-xs" style={{ color: theme.textLight, opacity: 0.4 }}>•</span>
      <kbd className="inline-flex items-center justify-center px-1.5 h-6 rounded text-[10px] font-bold"
        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: theme.textLight, opacity: 0.8 }}>{t('hint.space', lang)}</kbd>
    </>
  );

  return (
    <motion.div
      className="absolute bottom-28 left-0 right-0 z-30 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="flex items-center gap-2 rounded-2xl backdrop-blur-sm px-4 py-2 border"
        style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.15)' }}>
        {isTouchDevice ? touchHint : keyboardHint}
      </div>
    </motion.div>
  );
}
