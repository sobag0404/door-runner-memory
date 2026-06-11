import { useGameStore, type GameScreen as GameScreenType } from '../store/gameStore';
import HomeScreen from './HomeScreen';
import GameScreen from './GameScreen';
import LeaderboardScreen from './LeaderboardScreen';

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

  return (
    <main className="w-full h-dvh overflow-hidden">
      <ScreenRouter screen={screen} />
    </main>
  );
}
