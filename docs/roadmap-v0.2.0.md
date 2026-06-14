# Door Runner Memory v0.2.0 Roadmap

Status: draft next-release plan
Baseline: `v0.1.0` published release and current release docs
Scope: web/PWA hardening, release governance, and verified readiness gates

Current post-v0.1 hardening baseline: PR #2 through PR #12 are merged into `main` at `6c7a501dfc898ff39682bd9238a435b2043fee98`. The post-merge CI run passed on Ubuntu and Windows with dependency audit, build/type-check, lint, unit tests, e2e/smoke, and focused a11y smoke: https://github.com/sobag0404/door-runner-memory/actions/runs/27501463256.

## Release Intent

v0.2.0 should move Door Runner Memory from a hardened web prototype toward a more repeatable release train. The release should prioritize verification quality, honest deployment status, and controlled technical debt reduction before adding broad gameplay or distribution commitments.

This plan intentionally does not claim Android APK, real-device performance, or Netlify production readiness until those checks are completed and recorded.

## Baseline From v0.1.0

Verified in the v0.1.0 release docs:

- GitHub Release `v0.1.0` is published.
- GitHub Actions is green on `main` for the release commit.
- `bun install --frozen-lockfile`, `bun run build`, `bun run lint`, `bun run test`, `bun run test:e2e`, and `bun run security:audit` pass in the documented release baseline.
- 112 unit tests pass.
- 14 Playwright tests pass across desktop Chromium and mobile Chrome profiles.
- `bun audit` reports no vulnerabilities.
- The app is a local-score, mobile-first PWA prototype with RU/EN localization, themes, sound packs, achievements, local leaderboard, PWA manifest, service worker, and offline-oriented checks.

Known unverified or incomplete areas carried into v0.2.0:

- Android/Capacitor APK project directory is not generated in this checkout.
- APK build, Android device smoke, and real-device performance are not verified.
- Netlify production deploy status is not verified from the current environment.
- Focused Playwright accessibility smoke is now a release gate, but a full accessibility audit is not complete.
- Sound/haptic/aria effects, feedback timers, and persistence have been extracted from the Zustand store. The store still orchestrates game actions, stats calculations, achievement unlock checks, and leaderboard entry construction.
- Leaderboard remains local-only; no online leaderboard/backend/server verification exists.

## P0 - Release Gates And Verified Distribution Status

P0 work must be completed before tagging v0.2.0.

### P0.1 Release Checklist Refresh

Update the release process for v0.2.0 so it can be followed without relying on stale v0.1.0 assumptions.

Acceptance criteria:

- A v0.2.0 release checklist exists or the current checklist is updated to target v0.2.0. The current draft section lives in `docs/release-checklist.md`.
- Required commands are explicit: `bun install --frozen-lockfile`, `bun run build`, `bun run lint`, `bun run test`, `bun run test:e2e`, and `bun run security:audit`.
- The checklist separates automated checks, manual browser smoke, PWA smoke, Android checks, and deploy checks.
- Any skipped check has an owner-visible reason and is reflected in release notes/status.

### P0.2 Netlify Status Verification

Establish the real production deploy state without assuming the old anonymous URL is valid.

Acceptance criteria:

- Confirm whether the repository has an active Netlify site connected to the release branch or `main`.
- Record the verified production URL only after dashboard, CLI, or commit status confirms it.
- If Netlify cannot be verified, document it as unverified and avoid release wording that implies production deployment.
- If a deploy is created, verify the deployed app loads, static assets return 200, and the app version/status is traceable to the v0.2.0 release commit.

Latest evidence note: the 2026-06-14 no-login verification against `38ec84071e0a504328418a0711d0cb8cac1bc284` found no GitHub Netlify commit status, no GitHub deployments, and no credible live Netlify URL. `docs/netlify-deploy-checklist.md` records the checked evidence; Netlify production status remains unverified.

### P0.3 Browser And PWA Release Smoke

Keep the web/PWA release baseline reproducible and visible.

Acceptance criteria:

- Home screen renders in a browser.
- Regular game starts.
- Tap/click lane input works.
- Keyboard lane input works.
- Score save and local leaderboard visibility work.
- Settings persist after reload.
- `/manifest.json` returns 200 with expected app metadata.
- Service worker registration does not break first load.
- Warmed offline reload or fallback behavior is verified in a browser.

### P0.4 Release Notes And Status Truthfulness

Publish v0.2.0 docs that distinguish shipped features from verified environments.

Acceptance criteria:

- Release notes describe only completed changes.
- Release status names the exact commit/tag under verification.
- Android/APK, real-device, and Netlify production status are each marked verified or unverified with supporting notes.
- No doc claims online leaderboard, server-side anti-cheat, Android release readiness, device performance readiness, or Netlify production readiness without evidence.

## P1 - Quality, Accessibility, And Maintainability

P1 work should be targeted for v0.2.0 if it does not endanger the P0 release gates.

### P1.1 Expanded Accessibility Audit

Expand the existing focused Playwright accessibility smoke into a broader accessibility audit.

Acceptance criteria:

- Automated a11y coverage runs against at least the home screen, settings path, active game screen, and score/leaderboard flow.
- Keyboard-only navigation is checked for the main start/play/save loop.
- Reduced-motion behavior is covered by either automated or documented manual verification.
- Known false positives or deferred issues are documented with rationale.

### P1.2 Side-Effect Reduction In Game State

Continue moving game behavior toward isolated, testable units without changing rules accidentally.

Acceptance criteria:

- Any extracted logic has focused unit tests.
- Scoring, daily challenge generation, sequence behavior, and persisted localStorage schema remain unchanged unless the release explicitly approves and tests the change.
- Current extracted helpers include `gameEffects`, `feedbackTimers`, and `gamePersistence`; remaining work should target store orchestration seams such as stats, achievements, and leaderboard entry construction.
- Regression tests cover any migrated behavior.

### P1.3 Mobile Performance Budget For Web/PWA

Define and verify a lightweight browser performance target for mobile viewports.

Acceptance criteria:

- A documented mobile browser smoke includes at least a 10-minute session check or a shorter repeatable substitute with rationale.
- Background particles and visual effects do not obscure doors or HUD in mobile viewport checks.
- Reduced-motion mode disables nonessential motion.
- Any observed memory growth, dropped-frame risk, or thermal concern is recorded as a release risk rather than hidden.

## P2 - Optional Product Polish

P2 work is optional for v0.2.0 and should not delay P0 release readiness.

### P2.1 Release Metadata In UI Or Diagnostics

Make it easier to connect a running build to a release commit.

Acceptance criteria:

- A nonintrusive version or build identifier is available in diagnostics, settings, or docs-linked output.
- The identifier does not expose secrets or environment internals.
- The release process explains how to verify the identifier after deployment.

### P2.2 Documentation Encoding Cleanup

Some existing docs display mojibake in this checkout. Clean up documentation encoding only where ownership and review scope allow it.

Acceptance criteria:

- Any encoding cleanup is reviewed as a docs-only change.
- Technical meaning is preserved.
- Release docs remain readable in a standard UTF-8 editor.

### P2.3 Controlled Gameplay Polish

Small UX/gameplay polish may be included if it is separately reviewed and tested.

Acceptance criteria:

- Changes are small, documented, and covered by unit or e2e tests as appropriate.
- No scoring, sequence generation, daily challenge, or localStorage schema change ships without explicit release approval.
- Visible copy changes remain consistent across RU/EN localization.

### P2.4 Visual Direction Spike

Define an original art direction for a brighter mobile runner presentation, using Subway Surfers only as a broad energy reference. The current brief lives in `docs/visual-direction.md`.

Acceptance criteria:

- A short visual brief defines color, camera/road feel, door readability, runner feedback, HUD density, and reduced-motion behavior.
- Reference language avoids copying Subway Surfers characters, logos, exact UI, proprietary assets, or recognizable level art.
- Any implementation plan starts with low-risk CSS/component prototypes and screenshot checks across desktop and mobile.
- Door readability, keyboard/touch input clarity, a11y smoke coverage, and performance budget remain release constraints.

## Non-Goals For v0.2.0

- Do not claim Android release readiness unless the Android platform is generated, APK build is completed, and device smoke/performance checks are recorded.
- Do not claim Netlify production readiness unless the production deploy is verified and documented.
- Do not add an online leaderboard without server-side verification, replay protection, and abuse controls.
- Do not introduce server accounts, cloud saves, or monetization.
- Do not rewrite the game scene or state store in one large unreviewable change.
- Do not change scoring, daily challenge rules, sequence generation, or persisted localStorage schema without explicit approval and regression tests.
- Do not store tokens, PATs, `.env` values, or deployment secrets in source or docs.

## Suggested Release Exit Criteria

v0.2.0 is ready to tag when:

- All P0 items are complete or explicitly deferred in release status.
- CI is green on the release commit.
- Local release verification commands pass on the release branch.
- Manual browser/PWA smoke is recorded.
- Release notes and release status are reviewed for truthful readiness claims.
- Any Android/device/Netlify claims are backed by recorded verification, otherwise marked unverified.
