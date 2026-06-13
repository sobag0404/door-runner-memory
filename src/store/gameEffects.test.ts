import { describe, expect, it } from 'vitest';
import { isComboMilestone } from './gameEffects';

describe('isComboMilestone', () => {
  it('matches the combo feedback thresholds', () => {
    expect(isComboMilestone(0)).toBe(false);
    expect(isComboMilestone(2)).toBe(false);
    expect(isComboMilestone(3)).toBe(true);
    expect(isComboMilestone(4)).toBe(false);
    expect(isComboMilestone(5)).toBe(true);
    expect(isComboMilestone(7)).toBe(true);
    expect(isComboMilestone(10)).toBe(true);
    expect(isComboMilestone(20)).toBe(true);
  });
});
