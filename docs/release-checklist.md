# Release Checklist

Target release: `v0.1.0`
Base commit reviewed: `16df0dcb1433a266bdae9b773f34accd83f31f23`
Release branch: `codex/production-hardening`

Current release status: `docs/release-status-v0.1.0.md`

## Required Before Tagging

- [x] Merge release hardening changes to `main`.
- [x] Confirm GitHub Actions is green on the release commit.
- [x] Run `bun install --frozen-lockfile`.
- [x] Run `bun run build`.
- [x] Run `bun run lint`.
- [x] Run `bun run test`.
- [x] Run browser smoke/e2e tests.
- [x] Run PWA/offline smoke tests.
- [x] Review `docs/release-notes-v0.1.0.md`.
- [x] Confirm no secrets are present in source, docs, `.env`, or build output.
- [x] Confirm no scoring, daily sequence, UX copy, or persisted localStorage schema changes were introduced without a separate decision.

## Current Branch Verification

Completed locally on `codex/production-hardening` on 2026-06-13:

- [x] `bun install --frozen-lockfile`
- [x] `bun run build`
- [x] `bun run lint`
- [x] `bun run test` - 112 unit tests passing
- [x] `bun run test:e2e` - 14 Playwright tests passing across desktop Chromium and mobile Chrome profiles

## Manual Browser Smoke

- [ ] Home screen renders.
- [ ] Regular game starts.
- [ ] Tap/click lane input works.
- [ ] Keyboard lane input works.
- [ ] Score can be saved.
- [ ] Local leaderboard shows saved score.
- [ ] Settings persist after reload.

## PWA Smoke

- [ ] `/manifest.json` returns 200 and has app metadata.
- [ ] Service worker script returns 200.
- [ ] Service worker registration does not break the first page load.
- [ ] After first load, offline fallback/reload behavior is checked in a browser.

## Mobile/Performance Checklist

- [ ] BackgroundParticles does not dominate CPU on mobile viewport.
- [ ] VFX effects remain readable and do not obscure doors/HUD.
- [ ] Themes keep sufficient contrast for doors, HUD, and feedback.
- [ ] Reduced-motion preference disables nonessential effects.
- [ ] 10-minute mobile session has no crash or visible memory growth.
- [ ] APK build/device smoke is completed before an Android release.

## GitHub Release Steps

1. Create an annotated tag after all checks pass:
   ```bash
   git tag -a v0.1.0 -m "Door Runner Memory v0.1.0"
   git push origin v0.1.0
   ```
2. Create the GitHub Release from `v0.1.0`.
3. Use `docs/release-notes-v0.1.0.md` as release notes.
4. Attach web build artifacts only if the release process decides to publish static assets from `dist/`.

Status: completed for `v0.1.0`.
