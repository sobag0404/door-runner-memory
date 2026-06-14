# Release Checklist

Target release: `v0.1.0`
Base commit reviewed: `16df0dcb1433a266bdae9b773f34accd83f31f23`
Release branch: `codex/production-hardening`

Current release status: `docs/release-status-v0.1.0.md`

## v0.2.0 Draft Release Checklist

Current baseline for v0.2 planning:

- `main` commit under checklist review: `6c7a501dfc898ff39682bd9238a435b2043fee98`.
- Latest `main` CI is green on Ubuntu and Windows: https://github.com/sobag0404/door-runner-memory/actions/runs/27501463256
- PR #2 through PR #12 are merged.
- Netlify production deploy remains unverified: no GitHub Netlify commit status, no GitHub deployments, and the old Netlify URL returns 404.
- Android APK build, Android device smoke, and real-device performance remain unverified.
- Focused Playwright a11y smoke is automated, but a full accessibility audit remains incomplete.
- Leaderboard remains local-only; there is no online leaderboard, backend, account system, or server-side score verification.

Required automated checks before tagging `v0.2.0`:

- [ ] `bun install --frozen-lockfile`
- [ ] `bun run security:audit`
- [ ] `bun run build`
- [ ] `bun run lint`
- [ ] `bun run test`
- [ ] `bun run test:e2e`
- [ ] `bun run test:a11y`
- [ ] Confirm GitHub Actions is green on the exact release commit for Ubuntu and Windows.

Manual browser/PWA smoke before tagging `v0.2.0`:

- [ ] Home screen renders in desktop browser.
- [ ] Regular game starts.
- [ ] Tap/click lane input works.
- [ ] Keyboard lane input works.
- [ ] Score can be saved and appears in the local leaderboard.
- [ ] Language, theme, and sound settings persist after reload.
- [ ] `/manifest.json` returns 200 with expected app metadata.
- [ ] `/sw.js` returns 200.
- [ ] Service worker registration does not break first load.
- [ ] Warmed offline reload or fallback behavior is checked in a browser.
- [ ] Mobile viewport smoke confirms doors, HUD, lane buttons, and feedback remain readable.
- [ ] Reduced-motion mode preserves clear feedback without nonessential motion.

Distribution and readiness gates for `v0.2.0`:

- [ ] If a Netlify production URL exists, verify `/`, `/manifest.json`, `/sw.js`, SPA fallback, generated static assets, HTTPS, HSTS, and configured headers. If no credible URL/evidence exists, record Netlify as unverified.
- [ ] If Android release readiness is claimed, generate or verify the Android project, build an APK, run device smoke, and record device/performance notes. Otherwise record Android as unverified.
- [ ] If full accessibility readiness is claimed, complete and record a broader accessibility audit. Otherwise state that only focused a11y smoke is automated.
- [ ] Confirm no gameplay rules, scoring, daily sequence, or persisted localStorage schema/key changes are included without explicit release approval and regression tests.
- [ ] Confirm no secrets, tokens, `.env` values, or deployment credentials are committed.
- [ ] Confirm release notes/status do not claim Netlify production readiness, Android readiness, full a11y audit completion, or online leaderboard/backend support without evidence.

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

## Post-v0.1.0 Hardening Gates

Added after the published `v0.1.0` baseline:

- [x] Run `bun run test:a11y` in CI as a focused Playwright a11y smoke gate.
- [x] Confirm CI includes the `Accessibility smoke` step.
- [x] Confirm post-hardening `main` CI passed on Ubuntu and Windows: https://github.com/sobag0404/door-runner-memory/actions/runs/27479012083
- [x] Review `docs/android-release.md` before claiming APK readiness.
- [x] Review `docs/netlify-deploy-checklist.md` before claiming production deploy readiness.
- [x] Use `docs/roadmap-v0.2.0.md` for next-release priorities and non-goals.
- [x] Confirm post-v0.1 hardening did not claim gameplay, scoring, daily sequence, or localStorage schema/key changes.

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

- [ ] Focused Playwright a11y smoke passes on desktop Chromium and mobile Chrome profiles.
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
