# Door Runner Memory v0.2.0 Draft Release Notes

Status: draft notes for a future `v0.2.0` tag. This document does not publish the release.

Baseline for these notes:

- Current `main`: `16e30bf0a5e15a25b93fd93a6de1fdc74c79c968`
- Latest `main` CI: https://github.com/sobag0404/door-runner-memory/actions/runs/27505254848
- Draft release status: `docs/release-status-v0.2.0.md`

## Highlights

- Release governance is now explicit for v0.2 planning: checklist, roadmap, release status, manual smoke evidence, Android notes, Netlify notes, accessibility matrix, and visual direction docs are all tracked.
- CI now runs on Ubuntu and Windows with dependency audit, build/type-check, lint, unit tests, e2e/smoke, and focused accessibility smoke.
- Manual local browser/PWA smoke evidence is recorded for desktop, mobile viewport, settings persistence, local leaderboard, manifest, service worker script, and SPA fallback endpoint availability.
- Focused accessibility smoke now covers the main home/game path, settings, score save dialog, leaderboard, mobile viewport, aria-live feedback, keyboard flow, and reduced-motion game controls.
- Android readiness is documented honestly: Capacitor config and web build output are verified, but the native Android project and APK/device checks are still not complete.
- Netlify production status is documented honestly: no credible public production URL, GitHub deployment, or Netlify status evidence is currently verified.

## Quality And Architecture

- Sound, haptic, aria-live announcements, feedback timers, and persistence are isolated behind focused helpers.
- Persistence/localStorage behavior is characterized by unit tests before and after extraction.
- The Zustand store still orchestrates game actions, stats calculations, achievement unlock checks, and leaderboard entry construction.
- Windows Playwright teardown flake risk was reduced with Windows-CI-only timeout headroom.
- No gameplay rules, scoring, daily challenge generation, visible game loop semantics, or persisted localStorage schema/key changes are claimed for v0.2.

## Visual And Product Direction

- `docs/visual-direction.md` defines an original colorful mobile-runner direction.
- Subway Surfers is used only as a broad energy reference. No copied characters, logos, exact UI, proprietary assets, or recognizable level art are included.
- A first low-risk visual polish pass has been merged while keeping gameplay and storage behavior unchanged.

## Verification Snapshot

Current automated verification on `main`:

- `bun install --frozen-lockfile`
- `bun run security:audit`
- `bun run build`
- `bun run lint`
- `bun run test`
- `bun run test:e2e`
- `bun run test:a11y`

GitHub Actions result: green on Ubuntu and Windows for the baseline commit linked above.

Additional recorded evidence:

- Manual browser/PWA smoke: `docs/manual-smoke-v0.2.md`
- Android readiness evidence: `docs/android-release.md`
- Accessibility coverage matrix: `docs/accessibility-audit.md`
- Netlify deploy checklist/status: `docs/netlify-deploy-checklist.md`

## Not Included / Not Verified

- Android release readiness is not verified: no generated `android/` project is present, no APK/AAB was built, no device/emulator smoke was run, and real-device performance is not measured.
- Netlify production readiness is not verified: no confirmed production URL, GitHub deployment, or Netlify status evidence is available from the current environment.
- Full accessibility audit is not complete: focused Playwright smoke is automated, but manual assistive-technology, contrast, focus-order, touch-target, and long-session checks remain open.
- Online leaderboard/backend/server verification is not included.
- No account system, cloud saves, monetization, anti-cheat, or replay protection is included.
- No gameplay/scoring/daily-sequence/localStorage schema changes are included.

## Upgrade Notes

- Use Bun `1.3.14` and Node.js `22.12.0` for the canonical local release workflow.
- Keep using `docs/release-checklist.md` and `docs/release-status-v0.2.0.md` before tagging.
- Do not claim Android, Netlify, or full accessibility readiness in published release text unless new evidence is added before the tag.
