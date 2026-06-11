import { useGameStore, type GameScreen as GameScreenType } from '../store/gameStore';
import HomeScreen from './HomeScreen';
import GameScreen from './GameScreen';
import LeaderboardScreen from './LeaderboardScreen';
import OfflineIndicator from './OfflineIndicator';
import ErrorBoundary from './ErrorBoundary';

function ScreenRouter({ screen }: { screen: GameScreenType }) {
  switch (screen) {
    case 'home':
      return <HomeScreen />;
    case 'game':
      return <GameScreen />;
    case 'leaderboard':
      return <LeaderboardScreen />;
    default:
      return <HomeScreen />;
  }
}

export default function AppContent() {
  const screen = useGameStore((s) => s.screen);
  const lang = useGameStore((s) => s.settings.lang);

  return (
    <ErrorBoundary lang={lang}>
      <main className="w-full h-dvh overflow-hidden">
        <ScreenRouter screen={screen} />
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
