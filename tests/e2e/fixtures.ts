import type { Page } from '@playwright/test';

export const BASE_SETTINGS = {
  pathCount: 3,
  speed: 'normal',
  soundEnabled: false,
  lang: 'en',
  theme: 'classic',
  soundPack: 'classic',
  customTimerSec: 10,
};

export async function seedCleanState(page: Page) {
  await page.goto('/');
  await page.evaluate((settings) => {
    localStorage.clear();
    localStorage.setItem('drm_lang', 'en');
    localStorage.setItem('drm_tutorialSeen', 'true');
    localStorage.setItem('drm_settings', JSON.stringify(settings));
  }, BASE_SETTINGS);
}

export async function startRegularGame(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'PLAY!' }).click();
  await page.getByTestId('game-root').waitFor();
}

export async function chooseCorrectLane(page: Page) {
  const lane = await page.getByTestId('game-root').getAttribute('data-correct-lane');
  if (!lane) throw new Error('Missing data-correct-lane');
  await page.keyboard.press(lane);
  await page.getByTestId('feedback-toast').getByText('Correct!').waitFor();
  return lane;
}
