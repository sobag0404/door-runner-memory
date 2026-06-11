import { useRef } from 'react';
import { useGameStore, type GameScreen as GameScreenType } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import HomeScreen from './HomeScreen';
import GameScreen from './GameScreen';
import LeaderboardScreen from './LeaderboardScreen';
import OfflineIndicator from './OfflineIndicator';
import ErrorBoundary from './ErrorBoundary';

// ─── Transition variants per screen direction ──────────
// Home → Game: slide from right;  Game → Home: slide from left
// Home ↔ Leaderboard: slide from right / left
const getVariants = (current: GameScreenType, prev: GameScreenType | null) => {
  const goingForward =
    (prev === 'home' && current === 'game') ||
    (prev === 'home' && current === 'leaderboard') ||
    (prev === 'game' && current === 'leaderboard');

  return {
    initial: {
      x: goingForward ? '100%' : '-100%',
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      x: goingForward ? '-30%' : '30%',
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
  };
};

// ─── Animated Screen Wrapper ───────────────────────────
function AnimatedScreen({ screen, screenKey, prevScreen }: { screen: GameScreenType; screenKey: string; prevScreen: GameScreenType | null }) {
  const variants = getVariants(screen, prevScreen);

  return (
    <motion.div
      key={screenKey}
      className="absolute inset-0"
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
    >
      {screen === 'home' && <HomeScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'leaderboard' && <LeaderboardScreen />}
    </motion.div>
  );
}

export default function AppContent() {
  const screen = useGameStore((s) => s.screen);
  const lang = useGameStore((s) => s.settings.lang);
  const prevScreenRef = useRef<GameScreenType | null>(null);

  // Capture previous screen before updating ref
  const prevScreen = prevScreenRef.current;
  prevScreenRef.current = screen;

  return (
    <ErrorBoundary lang={lang}>
      <main className="w-full h-dvh overflow-hidden relative">
        <AnimatePresence mode="wait">
          <AnimatedScreen screen={screen} screenKey={screen} prevScreen={prevScreen} />
        </AnimatePresence>
        <OfflineIndicator lang={lang} />

        {/* Screen reader announcements for game events */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          id="game-announcer"
        />
      </main>
    </ErrorBoundary>
  );
}
