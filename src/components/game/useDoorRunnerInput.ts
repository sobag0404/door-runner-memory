import { useCallback, useEffect, useRef, type TouchEvent } from 'react';
import { useGameStore } from '../../store/gameStore';

interface UseDoorRunnerInputArgs {
  isRunning: boolean;
  feedback: 'correct' | 'wrong' | null;
  pathCount: number;
  correctLane: number;
  currentStep: number;
  chooseLane: (lane: number) => void;
}

export function useDoorRunnerInput({
  isRunning,
  feedback,
  pathCount,
  correctLane,
  currentStep,
  chooseLane,
}: UseDoorRunnerInputArgs) {
  const activeLaneRef = useRef(0);
  const swipeStateRef = useRef({
    activeLane: 0,
    touchStartX: 0,
    touchStartY: 0,
    isSwiping: false,
  });

  useEffect(() => {
    if (!isRunning) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState();
      if (!state.isRunning || state.feedback !== null) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= pathCount) {
        activeLaneRef.current = num - 1;
        chooseLane(num - 1);
        return;
      }

      let direction = 0;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') direction = -1;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') direction = 1;

      if (direction !== 0) {
        e.preventDefault();
        const newLane = Math.max(0, Math.min(pathCount - 1, activeLaneRef.current + direction));
        if (newLane !== activeLaneRef.current) {
          activeLaneRef.current = newLane;
          chooseLane(newLane);
        }
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chooseLane(activeLaneRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, pathCount, chooseLane]);

  useEffect(() => {
    if (isRunning && feedback === null) {
      swipeStateRef.current.activeLane = correctLane;
    }
  }, [currentStep, isRunning, feedback, correctLane]);

  const handleChoose = useCallback(
    (lane: number) => {
      if (!isRunning || feedback !== null) return;
      swipeStateRef.current.activeLane = lane;
      chooseLane(lane);
    },
    [isRunning, feedback, chooseLane]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isRunning || feedback !== null) return;
    const touch = e.touches[0];
    swipeStateRef.current.touchStartX = touch.clientX;
    swipeStateRef.current.touchStartY = touch.clientY;
    swipeStateRef.current.isSwiping = false;
  }, [isRunning, feedback]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isRunning || feedback !== null) return;
    const touch = e.touches[0];
    const dx = touch.clientX - swipeStateRef.current.touchStartX;
    const dy = touch.clientY - swipeStateRef.current.touchStartY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30 && !swipeStateRef.current.isSwiping) {
      swipeStateRef.current.isSwiping = true;
      const currentLane = swipeStateRef.current.activeLane;
      const direction = dx > 0 ? 1 : -1;
      const newLane = Math.max(0, Math.min(pathCount - 1, currentLane + direction));

      if (newLane !== currentLane) {
        swipeStateRef.current.activeLane = newLane;
        chooseLane(newLane);
      }
    }
  }, [isRunning, feedback, pathCount, chooseLane]);

  const handleTouchEnd = useCallback(() => {
    swipeStateRef.current.isSwiping = false;
  }, []);

  return {
    handleChoose,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
