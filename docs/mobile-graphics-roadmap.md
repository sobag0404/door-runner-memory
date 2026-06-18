# Mobile Graphics Roadmap After Visual First Pass

Status: supporting roadmap for Android-first visual polish after `codex/mobile-visual-first-pass`

This roadmap extends `docs/visual-direction.md`. It keeps the broad bright mobile-runner energy while preserving the original Door Runner identity: doors, memory choices, lane clarity, and local-only arcade play. It must not copy Subway assets, UI, characters, coins, hoverboards, track layouts, HUD, logos, or recognizable level art.

## Baseline Constraints

- Do not change gameplay rules, scoring, daily sequence behavior, or persisted localStorage schema/keys.
- Do not add online leaderboard, accounts, backend score sync, or anti-cheat work in graphics PRs.
- Keep visual PRs small enough for screenshot review.
- Preserve reduced-motion support and focused accessibility smoke coverage.
- Keep Android release claims factual: debug/emulator evidence exists, but release signing, real-device smoke, and physical-device performance remain open unless later evidence is recorded.
- Keep Vite output compatible with the Android WebView target already documented in `vite.config.ts`.

## Current File Boundaries

The current visual-first pass owns these files and should be allowed to finish before overlapping work starts:

- `src/components/game/SceneBackground.tsx`
- `src/components/game/Doors.tsx`
- `src/index.css`

This roadmap intentionally avoids requiring changes to those files until that PR is merged. Later slices list expected ownership so only one PR edits each high-conflict surface at a time.

## PR Slice 1: Mobile Visual Baseline Evidence

Scope:

- Record current post-visual-first-pass screenshots and notes before more polish.
- Capture desktop and mobile game-screen states across Classic, Neon, and Retro themes.
- Capture 3, 4, 5, and 6 lane counts at a 390x844 mobile viewport and one shorter Android-like viewport such as 360x740.
- Record reduced-motion screenshots for the active game scene.

Likely files:

- `docs/mobile-visual-evidence.md` or a dated evidence doc under `docs/`
- Optional Playwright screenshot helper only if it does not touch the active visual files

Risks:

- Evidence can become stale if captured before the visual-first pass is merged.
- Screenshots can hide Android WebView-specific issues if only desktop Chromium is used.

Checks:

- `bun run build`
- `bun run test:e2e`
- `bun run test:a11y`
- Manual screenshot review for overlap, horizontal overflow, and door readability.

Done when:

- Screenshots or linked artifact paths exist for desktop, 390x844, and 360x740.
- Themes and lane counts are covered.
- Any observed crowding or readability issue is recorded as follow-up instead of silently accepted.

## PR Slice 2: Background And Road Readability

Scope:

- Tune road depth marks, lane beams, speed lines, glows, and background contrast.
- Keep the sense of forward motion without letting decoration pass through or compete with doors.
- Preserve distinct Classic, Neon, and Retro identities.

Likely files:

- `src/components/game/SceneBackground.tsx`
- `src/components/game/VFX.tsx`
- `src/index.css`

Risks:

- Infinite opacity/filter/blend/shadow animations can be expensive in Android WebView.
- Neon/Retro decoration can reduce door readability, especially with 5 or 6 lanes.
- Reduced-motion mode can still look visually noisy even when animations are disabled.

Checks:

- `bun run build`
- `bun run lint`
- `bun run test:e2e`
- `bun run test:a11y`
- Mobile screenshots for 390x844 and 360x740.
- Reduced-motion screenshot review.

Done when:

- Current and next door rows remain the clearest scene elements.
- Background movement supports speed without obscuring active doors, HUD, timer, or lane buttons.
- Reduced-motion state is readable without relying on animation.

## PR Slice 3: Door Readability And High-Lane States

Scope:

- Improve door number contrast, handle/edge readability, active lane state, correct/wrong/hint states, and 6-lane density.
- Keep door hit targets stable and accessible.
- Avoid decorative detail that makes lane identity harder to parse quickly.

Likely files:

- `src/components/game/Doors.tsx`
- Door-related CSS in `src/index.css` only if needed
- Existing e2e/a11y tests if adding non-behavioral visual assertions

Risks:

- Width shrinks at 5-6 lanes, so glow, handles, labels, and numbers can crowd.
- Animated active states can make memory choices less readable at faster timer speeds.
- Styling changes can accidentally affect accessible names or button hit targets.

Checks:

- `bun run build`
- `bun run lint`
- `bun run test`
- `bun run test:e2e`
- `bun run test:a11y`
- Manual screenshots for 3, 4, 5, and 6 lanes.

Done when:

- Door numbers and lane identity are readable at small mobile sizes.
- Correct, wrong, and hint states work without animation-only cues.
- No gameplay, scoring, timing, daily, or persistence diffs are present.

## PR Slice 4: Lower-Third Mobile Layout

Scope:

- Resolve crowding between runner, current door row, swipe hint, keyboard hint, and bottom lane buttons.
- Keep touch targets reachable on Android portrait screens.
- Keep HUD and timer compact without covering the scene.

Likely files:

- `src/components/game/LaneButtons.tsx`
- `src/components/game/SwipeHint.tsx`
- `src/components/game/HUD.tsx`
- `src/components/game/Timer.tsx`
- `src/components/game/Runner.tsx`
- `src/index.css` only if shared spacing variables are needed

Risks:

- Fixes at 390x844 can regress shorter screens or 6-lane mode.
- Hint visibility changes can reduce discoverability of swipe/keyboard controls.
- Z-index fixes can hide feedback effects or modals.

Checks:

- `bun run build`
- `bun run lint`
- `bun run test:e2e`
- `bun run test:a11y`
- Manual Android-like viewport checks at 390x844 and 360x740.

Done when:

- Runner, doors, lane buttons, timer, and HUD do not overlap in active play.
- Lane buttons remain stable touch targets.
- Swipe and keyboard hints do not compete with core controls after the first few seconds.

## PR Slice 5: Android WebView Performance Evidence

Scope:

- Use `docs/android-performance-profile.md` to profile the current visual layer on a physical Android device.
- Record startup, input latency, 10-minute session behavior, jank, memory, battery, thermal, reduced-motion behavior, and filtered logcat.
- Keep this as evidence first; optimize only in a follow-up PR if data shows a concrete issue.

Likely files:

- `docs/android-performance-profile.md` or a dated evidence doc
- Optional small docs update in `docs/android-release.md` if evidence changes release status

Risks:

- Emulator results are useful for debugging but not release-readiness evidence.
- Performance can differ materially by Android WebView version.
- Visual effects may pass desktop Chromium but degrade on physical devices.

Checks:

- Physical-device install from a debug APK or signed test artifact.
- Filtered logcat scan for fatal crashes, syntax/runtime errors, and out-of-memory signals.
- Reduced-motion device check.

Done when:

- Device model, Android version, WebView version, artifact source, commit, and CI run are recorded.
- The 10-minute session result is pass/fail/blocked with concrete notes.
- Any blocker is converted into a scoped follow-up issue or PR slice.

## PR Slice 6: Android Branding Assets And Splash

Scope:

- Move Android icon/splash from debug placeholders toward reviewed project branding.
- Preserve Door Runner-specific visual identity: road, doors, memory lane choice, and original runner motif.
- Record asset provenance.

Likely files:

- `tools/generate-android-brand-assets.ps1`
- `android/app/src/main/res/**`
- `public/icon-192.png`
- `public/icon-512.png`
- `docs/android-icon-splash.md`
- `docs/android-real-device-smoke.md` when evidence is captured

Risks:

- Android adaptive icon masks and themed icons can crop or flatten important details.
- Generated assets can look acceptable in debug but fail app drawer, recents, themed icon, or splash review.
- Any externally sourced asset needs clear license/provenance.

Checks:

- Regenerate density buckets.
- Verify launcher icon, themed icon, app drawer, app info, recents, and splash-to-home on Android 13+ hardware if available.
- Confirm no third-party copied visual identity.

Done when:

- Asset provenance is recorded.
- Density buckets and adaptive icon layers are reviewed.
- Real-device or clearly marked blocked evidence exists for launcher, themed icon, app drawer, recents, app info, and splash-to-home.

## PR Slice 7: Visual Regression And A11y Guards

Scope:

- Add lightweight automated guards for mobile viewport overflow and key element overlap.
- Expand screenshot or bounding-box checks around HUD, timer, current doors, lane buttons, and modal/back controls.
- Keep assertions stable and focused; do not snapshot every decorative pixel.

Likely files:

- `tests/e2e/*.spec.ts`
- `playwright.config.ts` only if a new project/viewport is justified
- Optional docs note in `docs/accessibility-audit.md`

Risks:

- Pixel-perfect tests can become brittle and block harmless polish.
- Bounding-box checks need robust selectors and realistic animation settling.
- Tests can miss Android WebView issues if they only run desktop Chromium.

Checks:

- `bun run test:e2e`
- `bun run test:a11y`
- CI on Ubuntu and Windows.

Done when:

- Tests catch horizontal overflow or obvious core-control overlap.
- Reduced-motion and keyboard/touch accessibility smoke still pass.
- The tests avoid asserting decorative implementation details.

## PR Slice 8: Release Docs Truthfulness Pass

Scope:

- Update release docs after graphics and Android evidence land.
- Keep GitHub Pages, Netlify, Android debug, Android release, real-device, and performance claims separated.
- Do not call Android release-ready until signed artifact, versioning, real-device smoke, and performance evidence are recorded.

Likely files:

- `docs/release-status-v0.2.0.md` or the next release status file
- `docs/release-notes-v0.2.0.md` or the next release notes file
- `docs/android-release.md`
- `docs/netlify-deploy-checklist.md` only if new Netlify evidence exists

Risks:

- Docs can overclaim Android or Netlify readiness.
- Release notes can imply final branding when only debug placeholders exist.
- Netlify remains unverified unless dashboard, CLI, deploy status, or live URL evidence is captured.

Checks:

- `git diff --check`
- Read release notes/status for unsupported claims.
- Confirm referenced CI runs, commits, tags, and URLs are current.

Done when:

- Release docs separate shipped visuals from verified distribution environments.
- Android and Netlify limitations are explicit.
- No secrets, tokens, keystore data, or generated build outputs are committed.

## Safe Parallel Work

Can run in parallel with the current visual-first implementation:

- Docs-only roadmap/status work that does not edit the active visual files.
- Android real-device smoke execution, with only one owner writing the evidence document.
- Android signing/versioning research or docs, without editing visual components.
- Netlify/GitHub Pages verification docs, without deployment claims unless evidence exists.
- Play/internal testing process docs, avoiding simultaneous edits to `docs/android-release.md`.

Should wait until the visual-first PR is merged:

- Any edits to `SceneBackground.tsx`, `Doors.tsx`, or `src/index.css`.
- Background/road polish that changes shared animation or theme CSS.
- Door readability work that changes active/correct/wrong states.
- Layout work that changes runner, door row, and lane button stacking.

Best next split after merge:

- One PR for background/road readability.
- One PR for door readability and high-lane states.
- One PR for lower-third mobile layout.
- One PR for Android branding evidence.
- One PR for real-device performance evidence.
