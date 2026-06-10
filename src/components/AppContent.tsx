'use client';

import { useGameStore, GameScreen as GameScreenType } from '@/store/gameStore';
import HomeScreen from '@/components/HomeScreen';
import GameScreen from '@/components/GameScreen';
import GameOverScreen from '@/components/GameOverScreen';

function ScreenRouter({ screen }: { screen: GameScreenType }) {
  switch (screen) {
    case 'home':
      return <HomeScreen />;
    case 'game':
      return <GameScreen />;
    case 'gameOver':
      return <GameOverScreen />;
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
