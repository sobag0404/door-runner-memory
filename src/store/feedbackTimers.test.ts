import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CORRECT_FEEDBACK_MS, WRONG_FEEDBACK_MS } from '../core/game/gameConstants';
import { clearFeedbackTimers, scheduleFeedbackTimer } from './feedbackTimers';

describe('feedbackTimers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearFeedbackTimers();
    vi.useRealTimers();
  });

  it('runs correct feedback callback after the correct duration', () => {
    const onElapsed = vi.fn();
    scheduleFeedbackTimer('correct', onElapsed);

    vi.advanceTimersByTime(CORRECT_FEEDBACK_MS - 1);
    expect(onElapsed).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onElapsed).toHaveBeenCalledTimes(1);
  });

  it('runs wrong feedback callback after the wrong duration', () => {
    const onElapsed = vi.fn();
    scheduleFeedbackTimer('wrong', onElapsed);

    vi.advanceTimersByTime(WRONG_FEEDBACK_MS);
    expect(onElapsed).toHaveBeenCalledTimes(1);
  });

  it('clears pending timers', () => {
    const onElapsed = vi.fn();
    scheduleFeedbackTimer('correct', onElapsed);
    clearFeedbackTimers();

    vi.advanceTimersByTime(CORRECT_FEEDBACK_MS);
    expect(onElapsed).not.toHaveBeenCalled();
  });

  it('scheduling a new feedback timer cancels the previous one', () => {
    const correct = vi.fn();
    const wrong = vi.fn();

    scheduleFeedbackTimer('correct', correct);
    scheduleFeedbackTimer('wrong', wrong);

    vi.advanceTimersByTime(CORRECT_FEEDBACK_MS);
    expect(correct).not.toHaveBeenCalled();
    expect(wrong).not.toHaveBeenCalled();

    vi.advanceTimersByTime(WRONG_FEEDBACK_MS - CORRECT_FEEDBACK_MS);
    expect(wrong).toHaveBeenCalledTimes(1);
  });
});
