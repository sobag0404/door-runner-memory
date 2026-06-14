# Release Status v0.2.0 Draft

Status: draft release-readiness snapshot, not a published release.

Baseline checked:

- Release tag target: the commit that receives the `v0.2.0` tag after final release-owner approval.
- Latest verified release-candidate CI: https://github.com/sobag0404/door-runner-memory/actions/runs/27505679971
- CI result: green on Ubuntu and Windows with dependency audit, build/type-check, lint, unit tests, e2e/smoke, and focused accessibility smoke.
- Merged post-v0.1 hardening scope: release-readiness PRs through the final docs cleanup before tagging.

## Completed Since v0.1.0

- CI hardening: Ubuntu and Windows matrix, dependency audit, build/type-check, lint, unit, e2e/smoke, and focused a11y smoke gates.
- Focused accessibility smoke expanded across home/game, settings, save-score dialog, leaderboard, mobile viewport, aria-live, keyboard flow, and reduced-motion controls.
- Accessibility coverage matrix added in `docs/accessibility-audit.md`.
- Manual local browser/PWA smoke evidence recorded in `docs/manual-smoke-v0.2.md`.
- Android readiness evidence recorded in `docs/android-release.md`.
- Netlify no-login status checks recorded in `docs/netlify-deploy-checklist.md`.
- Visual direction documented in `docs/visual-direction.md`; implementation remains original and uses Subway Surfers only as a broad energy reference.
- Game side-effect boundaries were partially extracted: `gameEffects`, `feedbackTimers`, and `gamePersistence`.
- Persistence/localStorage characterization tests were added before persistence extraction.
- Windows Playwright teardown flake was mitigated with Windows-CI-only timeout headroom.
- v0.2 planning and release checklist docs were refreshed.
- Draft v0.2 release notes were added in `docs/release-notes-v0.2.0.md`.

## Verified For This Draft

- Release-candidate CI is green, and the release tag should point at the final approved commit after any docs-only cleanup merges.
- Local browser/PWA smoke evidence covers desktop home, regular game start, tap/click lane input, keyboard lane input, score save, local leaderboard, settings reload persistence, mobile viewport, `/manifest.json`, `/sw.js`, and SPA fallback endpoint availability.
- Android config evidence covers Capacitor config parsing, `dist` build output, Capacitor CLI availability, absent `android/` project, and the expected `cap sync android` blocker before platform generation.
- No release doc claims gameplay, scoring, daily sequence, or persisted localStorage schema/key changes.
- Leaderboard remains local-only.

## Not Verified / Not Ready To Claim

- Netlify production deploy is not verified. No credible public production URL, GitHub deployment, or Netlify status evidence is available from the current environment.
- Android release readiness is not verified. `android/` is absent, no APK/AAB was built, no device/emulator smoke was run, and real-device performance is not measured.
- Full accessibility audit is not complete. Focused Playwright smoke is automated, but manual assistive-technology, contrast, focus-order, touch-target, and long-session checks remain open.
- No online leaderboard, backend, account system, server-side score verification, anti-cheat, or replay protection exists.
- Extended mobile performance is not verified beyond current CI, visual checks, and local smoke evidence.

## Release Decision Notes

- A v0.2.0 tag should only be cut after release owner review of this status, `docs/release-checklist.md`, and the current `main` CI result.
- If Android, Netlify, or full accessibility readiness is mentioned in release notes, it must be explicitly marked unverified unless new evidence is added before tagging.
- If `android/` remains generated-only, decide whether to add it to `.gitignore` before running `bun x cap add android` in a source-clean branch.
