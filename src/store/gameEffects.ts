import { announce } from '../lib/a11y';
import { hapticFeedback } from '../lib/constants';
import { t, type Lang } from '../lib/i18n';
import {
  playCombo,
  playCorrect,
  playMilestone,
  playStart,
  playTimeout,
  playWrong,
} from '../lib/sounds';

export interface EffectSettings {
  soundEnabled: boolean;
  lang: Lang;
}

export function isComboMilestone(combo: number): boolean {
  return combo >= 3 && (
    combo === 3 ||
    combo === 5 ||
    combo === 7 ||
    combo === 10 ||
    combo % 10 === 0
  );
}

export function runStartEffects(settings: EffectSettings): void {
  if (settings.soundEnabled) playStart();
  announce(t('a11y.newGame', settings.lang));
}

export function runCorrectChoiceEffects(settings: EffectSettings, score: number, combo: number): void {
  if (settings.soundEnabled) {
    playCorrect();
    if (isComboMilestone(combo)) {
      playCombo(combo);
    }
    if (score % 10 === 0) {
      playMilestone();
    }
  }

  hapticFeedback('light');
  announce(t('a11y.correct', settings.lang, { score: String(score) }));

  if (isComboMilestone(combo)) {
    announce(t('a11y.combo', settings.lang, { combo: String(combo) }));
  }
}

export function runWrongChoiceEffects(settings: EffectSettings): void {
  if (settings.soundEnabled) playWrong();
  hapticFeedback('heavy');
  announce(t('a11y.wrong', settings.lang));
}

export function runTimeoutEffects(settings: EffectSettings): void {
  if (settings.soundEnabled) playTimeout();
  hapticFeedback('medium');
}
