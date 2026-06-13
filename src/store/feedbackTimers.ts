import { CORRECT_FEEDBACK_MS, WRONG_FEEDBACK_MS } from '../core/game/gameConstants';

export type FeedbackTimerKind = 'correct' | 'wrong';

let correctTimeoutId: ReturnType<typeof setTimeout> | null = null;
let wrongTimeoutId: ReturnType<typeof setTimeout> | null = null;

export function clearFeedbackTimers(): void {
  if (correctTimeoutId !== null) {
    clearTimeout(correctTimeoutId);
    correctTimeoutId = null;
  }

  if (wrongTimeoutId !== null) {
    clearTimeout(wrongTimeoutId);
    wrongTimeoutId = null;
  }
}

export function scheduleFeedbackTimer(kind: FeedbackTimerKind, onElapsed: () => void): void {
  clearFeedbackTimers();

  const delay = kind === 'correct' ? CORRECT_FEEDBACK_MS : WRONG_FEEDBACK_MS;
  const timeoutId = setTimeout(() => {
    if (kind === 'correct') {
      correctTimeoutId = null;
    } else {
      wrongTimeoutId = null;
    }
    onElapsed();
  }, delay);

  if (kind === 'correct') {
    correctTimeoutId = timeoutId;
  } else {
    wrongTimeoutId = timeoutId;
  }
}
