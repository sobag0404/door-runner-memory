# Release Status v0.2.0 Draft

Status: historical release-readiness snapshot for the published `v0.2.0` release.

Post-v0.2.0 note: the `v0.2.0` GitHub Release was published from an earlier commit. GitHub Pages production deploy, Android debug APK build/install/launch evidence, and Android debug CI build coverage were verified afterward on current `main` work, so they should be treated as post-v0.2.0 evidence unless a patch release is cut.

Baseline checked:

- Release tag target: the commit that receives the `v0.2.0` tag after final release-owner approval.
- Latest verified release-candidate CI: https://github.com/sobag0404/door-runner-memory/actions/runs/27505679971
- CI result: green on Ubuntu and Windows with dependency audit, build/type-check, lint, unit tests, e2e/smoke, and focused accessibility smoke.
- Merged post-v0.1 hardening scope: release-readiness PRs through the final docs cleanup before tagging.

## Completed Since v0.1.0

- CI hardening: Ubuntu and Windows matrix, dependency audit, build/type-check, lint, unit, e2e/smoke, focused a11y smoke gates, and post-v0.2 Android debug build coverage.
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
- Android evidence covers the committed Capacitor Android project, debug APK build, emulator install/launch smoke, settings/local leaderboard persistence smoke, and post-v0.2 CI debug build coverage.
- No release doc claims gameplay, scoring, daily sequence, or persisted localStorage schema/key changes.
- Leaderboard remains local-only.

## Not Verified / Not Ready To Claim

- Netlify production deploy is not verified. No credible public production URL, GitHub deployment, or Netlify status evidence is available from the current environment.
- Android release readiness is not verified. Post-v0.2.0 work added a committed Android project and emulator-verified debug APK, but release signing, real-device smoke, and real-device performance remain unverified.
- Full accessibility audit is not complete. Focused Playwright smoke is automated, but manual assistive-technology, contrast, focus-order, touch-target, and long-session checks remain open.
- No online leaderboard, backend, account system, server-side score verification, anti-cheat, or replay protection exists.
- Extended mobile performance is not verified beyond current CI, visual checks, and local smoke evidence.

## Release Decision Notes

- A v0.2.0 tag should only be cut after release owner review of this status, `docs/release-checklist.md`, and the current `main` CI result.
- If Android, Netlify, or full accessibility readiness is mentioned in release notes, it must be explicitly marked unverified unless new evidence is added before tagging.
- Post-v0.2.0, `android/` is committed as the native app project; do not treat it as generated-only release scratch space.

## Post-v0.2.0 Production Web Deploy Evidence

- GitHub Pages URL: https://sobag0404.github.io/door-runner-memory/
- Verified on `main`: `d301d8c90e0f6dd161e66310b23570f773e0c391`
- Main CI: https://github.com/sobag0404/door-runner-memory/actions/runs/27508384809
- Pages deploy: https://github.com/sobag0404/door-runner-memory/actions/runs/27508384794
- Public checks returned 200 for `/`, `/manifest.json`, `/sw.js`, and generated JS/CSS assets.
- Browser smoke confirmed the app shell loads, service worker registration uses `/door-runner-memory/sw.js`, and GitHub Pages deep-link 404 redirects back to the app base path.

## Post-v0.2.0 Android Debug Evidence

- Capacitor Android project is committed in `android/`.
- Debug APK builds at `android/app/build/outputs/apk/debug/app-debug.apk`.
- GitHub Actions includes a Linux Android debug build lane for web build, Capacitor sync, and Gradle `assembleDebug`.
- The APK installs and launches on the `DoorRunner_API30_ATD` emulator.
- WebView DevTools DOM confirmed the home screen renders at `https://localhost/`.
- Android release signing, real-device smoke, and performance profiling remain unverified.
