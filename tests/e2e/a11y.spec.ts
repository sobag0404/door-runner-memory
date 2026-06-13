import { expect, test, type Locator, type Page } from '@playwright/test';
import { chooseCorrectLane, seedCleanState, startRegularGame } from './fixtures';

async function tabTo(page: Page, target: Locator, maxTabs = 20) {
  for (let i = 0; i < maxTabs; i += 1) {
    await page.keyboard.press('Tab');
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }

  throw new Error('Target was not reached with keyboard tab navigation');
}

test.beforeEach(async ({ page }) => {
  await seedCleanState(page);
});

test('keyboard-only flow can start the game and choose a lane', async ({ page }) => {
  await page.goto('/');

  const playButton = page.getByRole('button', { name: 'PLAY!' });
  await tabTo(page, playButton);
  await expect(playButton).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.getByTestId('game-root')).toBeVisible();

  const lane = await page.getByTestId('game-root').getAttribute('data-correct-lane');
  expect(lane).toMatch(/^[1-3]$/);

  await page.keyboard.press(lane!);
  await expect(page.getByTestId('feedback-toast')).toContainText('Correct!');
});

test('primary buttons expose accessible names on home and game screens', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'PLAY!' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'How to play' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Records on this device' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enable sounds' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Regular' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Daily' })).toBeVisible();
  await expect(page.getByRole('button', { name: '3 Lanes' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Normal' })).toHaveAttribute('aria-pressed', 'true');

  await startRegularGame(page);

  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Door 1 (choose this lane)' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Door 2 (choose this lane)' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Door 3 (choose this lane)' })).toBeVisible();
});

test('status region announces game feedback', async ({ page }) => {
  await page.goto('/');

  const status = page.locator('#game-announcer');
  await expect(status).toHaveAttribute('role', 'status');
  await expect(status).toHaveAttribute('aria-live', 'polite');
  await expect(status).toHaveAttribute('aria-atomic', 'true');

  await startRegularGame(page);
  await expect(status).toContainText('New game started!');

  await chooseCorrectLane(page);
  await expect(status).toContainText('Correct! Score: 1');
});

test('reduced motion preference is respected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Door Runner' })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches))
    .toBe(true);

  const animationDurationMs = await page.evaluate(() => {
    const el = document.createElement('div');
    el.style.animation = 'portalPulse 1s infinite';
    document.body.appendChild(el);
    const duration = getComputedStyle(el).animationDuration;
    el.remove();
    return duration.endsWith('ms') ? Number(duration.slice(0, -2)) : Number(duration.slice(0, -1)) * 1000;
  });

  expect(animationDurationMs).toBeLessThanOrEqual(0.01);
});

test('mobile viewport keeps core controls reachable by accessible name', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Door Runner' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'PLAY!' })).toBeVisible();
  await expect(page.getByRole('button', { name: '3 Lanes' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Normal' })).toBeVisible();

  await startRegularGame(page);
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Door 1 (choose this lane)' })).toBeVisible();

  const layout = await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.width);
});
