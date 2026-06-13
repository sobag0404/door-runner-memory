import { expect, test } from '@playwright/test';
import { chooseCorrectLane, seedCleanState, startRegularGame } from './fixtures';

test.beforeEach(async ({ page }) => {
  await seedCleanState(page);
});

test('home renders and starts regular game', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Door Runner' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Memory' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'PLAY!' })).toBeVisible();

  await page.getByRole('button', { name: 'PLAY!' }).click();

  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
  await expect(page.getByTestId('game-root')).toBeVisible();
});

test('tap lane and keyboard lane input both produce feedback', async ({ page }) => {
  await startRegularGame(page);

  await page.getByRole('button', { name: 'Door 1 (choose this lane)' }).click();
  await expect(page.getByTestId('feedback-toast')).toContainText(/Correct!|Wrong!/);

  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Skip' }).click();

  await startRegularGame(page);
  await chooseCorrectLane(page);
});

test('saves score and shows it on local leaderboard', async ({ page }) => {
  await startRegularGame(page);
  await chooseCorrectLane(page);

  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('dialog', { name: 'Save Your Score!' })).toBeVisible();
  await page.getByPlaceholder('Your name...').fill('E2E Player');
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByTestId('open-leaderboard').click();

  await expect(page.getByRole('heading', { name: 'Records on this device' })).toBeVisible();
  await expect(page.getByText('E2E Player')).toBeVisible();
});

test('settings persist after reload', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Neon' }).click();
  await page.getByRole('button', { name: '4 Lanes' }).click();
  await page.getByRole('button', { name: 'Fast' }).click();
  await page.reload();

  const settings = await page.evaluate(() => JSON.parse(localStorage.getItem('drm_settings') || '{}'));
  expect(settings.theme).toBe('neon');
  expect(settings.pathCount).toBe(4);
  expect(settings.speed).toBe('fast');
});
