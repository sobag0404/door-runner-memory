import { expect, test } from '@playwright/test';
import { seedCleanState } from './fixtures';

test.beforeEach(async ({ page }) => {
  await seedCleanState(page);
});

test('manifest exposes installable app metadata', async ({ request }) => {
  const response = await request.get('/manifest.json');
  expect(response.ok()).toBeTruthy();

  const manifest = await response.json();
  expect(manifest.name).toBe('Door Runner Memory');
  expect(manifest.display).toBe('standalone');
  expect(manifest.start_url).toBe('/');
  expect(manifest.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ sizes: '192x192', type: 'image/png' }),
      expect.objectContaining({ sizes: '512x512', type: 'image/png' }),
    ])
  );
});

test('service worker registers on first load', async ({ page }) => {
  await page.goto('/');

  const registration = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return {
      scope: reg.scope,
      scriptURL: reg.active?.scriptURL,
    };
  });

  expect(registration.scope).toContain('/');
  expect(registration.scriptURL).toContain('/sw.js');
});

test('warmed app can reload through offline fallback', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();

  await context.setOffline(true);
  await page.goto('/offline-fallback-check');

  await expect(page.getByRole('heading', { name: 'Door Runner' })).toBeVisible();

  await context.setOffline(false);
});
