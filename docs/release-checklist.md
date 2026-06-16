# Release Checklist

Target release: `v0.1.0`
Base commit reviewed: `16df0dcb1433a266bdae9b773f34accd83f31f23`
Release branch: `codex/production-hardening`

Current release status: `docs/release-status-v0.1.0.md`
Draft v0.2 status: `docs/release-status-v0.2.0.md`
Draft v0.2 notes: `docs/release-notes-v0.2.0.md`

Post-v0.2.0 production web deploy: GitHub Pages is verified at https://sobag0404.github.io/door-runner-memory/. This happened after the published `v0.2.0` tag and should be treated as post-release evidence unless a patch release is cut.

Post-v0.2.0 Android update: the Capacitor Android project is now committed, a debug APK builds, installs, launches, and renders the home screen on the `DoorRunner_API30_ATD` emulator. Versioning/signing policy is documented, but release signing, signed artifacts, real-device smoke, and performance profiling remain open.

## v0.2.0 Draft Release Checklist

Current baseline for v0.2 planning:

- Release tag target: the commit that receives the `v0.2.0` tag after final release-owner approval.
- Latest verified release-candidate CI is green on Ubuntu and Windows: https://github.com/sobag0404/door-runner-memory/actions/runs/27505679971
- Post-v0.1 hardening PRs through release-readiness docs cleanup are merged before tagging.
- Netlify production deploy remains unverified: no GitHub Netlify commit status, no GitHub deployments, and the old Netlify URL returns 404.
- Android debug APK build/install/launch is verified on an emulator; Android debug Gradle build is covered by CI; versioning/signing policy is documented; release signing, signed artifacts, real-device smoke, and performance profiling remain unverified.
- Focused Playwright a11y smoke is automated, but a full accessibility audit remains incomplete.
- Current accessibility coverage and manual gaps are documented in `docs/accessibility-audit.md`.
- Current local browser/PWA smoke evidence is documented in `docs/manual-smoke-v0.2.md`.
- Current Android readiness evidence and blockers are documented in `docs/android-release.md`.
- Real-device Android smoke procedure and evidence template: `docs/android-real-device-smoke.md`.
- Android 13+ real-device themed icon, launcher, splash-to-home, logcat, and artifact-hash evidence packet: `docs/android-real-device-smoke.md`.
- Android performance profiling procedure and evidence template: `docs/android-performance-profile.md`.
- Play Store/internal testing process template: `docs/android-play-testing.md`.
- Android icon/splash branding checklist: `docs/android-icon-splash.md`.
- Leaderboard remains local-only; there is no online leaderboard, backend, account system, or server-side score verification.

Required automated checks before tagging `v0.2.0`:

- [ ] `bun install --frozen-lockfile`
- [ ] `bun run security:audit`
- [ ] `bun run build`
- [ ] `bun run lint`
- [ ] `bun run test`
- [ ] `bun run test:e2e`
- [ ] `bun run test:a11y`
- [ ] Confirm GitHub Actions is green on the exact release commit for Ubuntu, Windows, and Android debug build.
- [ ] Confirm the Android `android-debug-build` job runs `bun run build`, `bun x cap sync android`, and Gradle `assembleDebug`.

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

- [x] GitHub Pages production web deploy is verified post-v0.2.0; see `docs/github-pages-deploy.md`.
- [x] Android debug APK build is covered by GitHub Actions through the Linux `android-debug-build` job.
- [ ] If a Netlify production URL exists, verify `/`, `/manifest.json`, `/sw.js`, SPA fallback, generated static assets, HTTPS, HSTS, and configured headers. If no credible URL/evidence exists, record Netlify as unverified.
- [ ] If Android release readiness is claimed, configure release signing, apply the documented Android versioning/signing policy, produce a signed APK/AAB, run real-device smoke, and record artifact/device/performance notes. Otherwise record Android as debug-only/emulator-verified.
- [ ] Before a signed Android release candidate is called ready, complete the first signed Android RC checklist in `docs/android-release.md`.
- [ ] Review `docs/android-real-device-smoke.md` and record physical-device model, Android/WebView versions, artifact type, CI run, functional smoke, logcat scan, and performance notes before claiming Android release readiness.
- [ ] Review `docs/android-performance-profile.md` and record startup time, input latency, 10-minute session result, jank, memory, battery, thermal, and runtime error observations before claiming Android performance readiness.
- [ ] Review `docs/android-play-testing.md` and record signed AAB upload, track, versionCode/versionName, commit/tag, CI run, artifact hash, and tester install result before claiming Play distribution readiness.
- [ ] Review `docs/android-icon-splash.md` and record original launcher icon/splash asset provenance, screenshots, and contrast/readability notes before claiming Android branding readiness.
- [ ] Confirm project-specific Android icon and splash placeholders are replaced or explicitly accepted as non-release placeholders before signed APK/AAB or Play/internal testing claims.
- [ ] Confirm the Android `versionCode` is unused in Play Console before upload.
- [ ] Confirm Play App Signing/upload-key status, store listing, app content, data safety, privacy, and app access checks are reviewed before any testing-track submission.
- [ ] Confirm internal testing audience is documented without personal emails, and any testing release is described as internal-only until production rollout evidence exists.
- [ ] Confirm Android signing keys, `keystore.properties`, Play service account JSON, signing passwords, and upload credentials are not committed.
- [ ] Confirm `.jks`, `.keystore`, `.p12`, `.pfx`, `keystore.properties`, Play service account JSON, tokens, and production credentials are ignored or kept outside the repository.
- [ ] If full accessibility readiness is claimed, complete and record a broader accessibility audit. Otherwise state that only focused a11y smoke is automated.
- [ ] Review `docs/accessibility-audit.md` before writing v0.2 accessibility claims.
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
- [ ] Android launcher icon, adaptive icon, round icon, splash assets, app label, and status/system bar colors are reviewed against the visual direction.
- [ ] Reduced-motion preference disables nonessential effects.
- [ ] 10-minute mobile session has no crash or visible memory growth.
- [ ] Real-device Android smoke is recorded with startup, input latency, long-session, battery, and thermal observations.
- [ ] Android performance profile is recorded on a physical device with WebView/runtime error scan and memory observations.
- [ ] Release-signed APK/AAB, documented Android versionCode/versionName, signing approach, artifact path, real-device smoke, and performance profiling are completed before an Android release.

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
