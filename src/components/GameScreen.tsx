import { useGameStore } from '../store/gameStore';
import { ArrowLeft } from 'lucide-react';
import DoorRunnerScene from './DoorRunnerScene';

export default function GameScreen() {
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-[#5C3D2E]">
      {/* Back button */}
      <button
        onClick={resetGame}
        className="absolute top-3 left-3 z-50 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white/90 hover:text-white hover:bg-white/30 active:scale-90 transition-all shadow-md border border-white/15"
        aria-label="Back"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Game Scene */}
      <DoorRunnerScene />
    </div>
  );
}
