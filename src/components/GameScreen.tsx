'use client';

import { useGameStore } from '@/store/gameStore';
import { ArrowLeft } from 'lucide-react';
import DoorRunnerScene from '@/components/DoorRunnerScene';

export default function GameScreen() {
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-[#0a0a1a]">
      {/* Back button */}
      <button
        onClick={resetGame}
        className="absolute top-3 left-3 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white active:scale-95 transition-all"
        aria-label="Назад"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Game Scene */}
      <DoorRunnerScene />
    </div>
  );
}
