# Mobile 3D Visual QA

Status: acceptance checklist for Android-mobile review of the Door Runner 3D track

Use this checklist for visual PRs that change the WebGL runner scene, avatar, track depth, portals, or related game-screen framing. It complements `docs/visual-direction.md` and `docs/mobile-graphics-roadmap.md`.

## Non-Copy Guardrails

- The scene may target a bright, kinetic, modern mobile-runner feel, but must remain original Door Runner work.
- Do not copy Subway Surfers characters, outfits, coins, hoverboards, graffiti treatment, track layouts, HUD layout, logos, props, or recognizable environment art.
- Door Runner identity should stay centered on memory choices, colored lanes, portal-doors, local score pressure, and readable tap targets.
- New assets must be original, generated for this project, created in-house, or licensed with provenance recorded.

## Required Evidence

Every 3D visual PR should include:

- Desktop screenshot: active game scene at about 1280x720.
- Mobile screenshot: active game scene at 390x844.
- Short Android-like viewport check: 360x740 or a physical Android device screenshot when available.
- Reduced-motion screenshot or note for any new motion.
- WebGL evidence: `runner-3d-scene` exists, `runner-3d-canvas` exists, canvas is visibly nonblank, and no viewport overflow is detected.
- Theme evidence when visual changes affect colors or lighting: Classic, Neon, and Retro.
- Lane-count evidence when layout changes affect depth or spacing: 3, 4, 5, and 6 lanes.

Recommended local evidence names:

- `door-runner-3d-mobile-390x844.png`
- `door-runner-3d-mobile-360x740.png`
- `door-runner-3d-desktop-1280x720.png`
- `door-runner-3d-reduced-motion-390x844.png`

## Acceptance Checklist

### 1. Runner Avatar

- The runner has a clear silhouette at 390x844.
- Head, torso, arms, legs, shoes, and outfit accents are distinguishable.
- Pose reads as forward running, not a static toy or flat icon.
- Animation has controlled bob/limb motion without jitter or layout shift.
- Feedback states are visible: correct feels positive, wrong/timeout feels distinct.
- The runner does not cover the current door row, HUD, timer, lane buttons, or critical feedback text.
- The runner remains readable in Classic, Neon, and Retro themes.

Reject if:

- The avatar is mostly cropped, hidden behind doors, or visually lost against the track.
- The runner resembles a known third-party character or outfit.
- Motion makes tap targets or door choices harder to read.

### 2. Track Depth And Lane Readability

- The 3D scene creates obvious forward depth through perspective, rails, tiles, lights, or road motion.
- Lane identity remains stable during speed changes and feedback.
- Lane count changes from 3 to 6 do not collapse the track into unreadable clutter.
- Track decoration supports motion but does not compete with active doors.
- The scene is bright and energetic without becoming a one-hue glow field.

Reject if:

- The track reads as flat stripes only.
- Decorative beams, speed marks, or shadows pass through doors in a way that hides choices.
- 5-6 lane mode becomes visually ambiguous on mobile.

### 3. Doors And Portals

- Doors/portals are still the primary gameplay objects.
- Current, future, correct, wrong, and hint states remain clear without relying only on animation.
- Door numbers and lane colors remain readable on 390x844.
- Door hit targets stay stable and accessible.
- Portal effects do not obscure labels, handles, or feedback states.

Reject if:

- Portal glow makes door numbers or lane colors unreadable.
- Correct/wrong feedback depends only on motion.
- Door row spacing overlaps runner, HUD, or lane controls.

### 4. HUD, Timer, And Touch Targets

- HUD, timer, speed indicator, combo badge, swipe hint, and lane buttons fit without overlap.
- Lane buttons remain reachable and stable on 390x844 and 360x740.
- Text does not clip or sit under WebGL canvas elements.
- Back/menu/modals remain above the 3D canvas.
- Pointer events from the 3D layer do not block buttons or lane input.

Reject if:

- Any primary control is hidden, clipped, or hard to tap.
- The WebGL canvas captures input intended for lane controls.
- Feedback text or achievement toasts are covered by 3D elements.

### 5. Motion And Reduced Motion

- Running loop, lane-change motion, road motion, and portal effects feel responsive but controlled.
- Reduced-motion mode disables nonessential motion while preserving static state clarity.
- Correct/wrong/timeout feedback still reads in reduced motion.
- Camera or road motion does not induce excessive shake on mobile.

Reject if:

- Motion is decorative noise rather than gameplay feedback.
- Reduced-motion users lose the ability to identify game state.
- Camera movement makes door memory choices less reliable.

### 6. Android WebView Performance

- Build output size is recorded when Three.js or large visual code changes are added.
- No obvious jank appears during a mobile viewport smoke.
- Physical-device performance evidence should use `docs/android-performance-profile.md` before Android release-readiness claims.
- A 10-minute physical-device session is required before calling Android visual performance ready.
- Logcat should be scanned for `FATAL EXCEPTION`, `SyntaxError`, `Uncaught`, `ReferenceError`, `TypeError`, `ERR_FILE_NOT_FOUND`, and `OutOfMemory`.

Reject or defer release claim if:

- Android WebView shows blank canvas, fatal runtime errors, visible forced close, or persistent severe jank.
- Bundle growth is unexplained after adding 3D assets or libraries.
- Only desktop Chromium evidence exists for an Android release claim.

## Minimum Checks

For docs-only QA updates:

- `git diff --check`

For 3D visual implementation PRs:

- `bun run build`
- `bun run lint`
- `bun run test`
- `bun run test:a11y`
- `git diff --check`
- Mobile and desktop screenshots
- WebGL canvas present/nonblank/no-overflow verification

Add `bun run test:e2e` when the change can affect navigation, input, persistence, service worker behavior, or broader game flow.

## Review Result Template

```text
Commit or PR:
Reviewer:
Viewport/device:
Theme:
Lane count:

Runner avatar: pass / fail / blocked
Track depth/lane readability: pass / fail / blocked
Doors/portals: pass / fail / blocked
HUD/tap targets: pass / fail / blocked
Motion/reduced motion: pass / fail / blocked
Performance/bundle risk: pass / fail / blocked
Originality/non-copy guardrail: pass / fail / blocked

Evidence paths:
- Mobile:
- Desktop:
- Reduced motion:
- Android/device, if any:

Blocking issues:
Follow-up PR:
```

## Current Known Gaps

- The 3D runner avatar is still prototype quality and needs stronger proportions, outfit detail, and mobile framing review.
- The WebGL canvas is verified in browser screenshots, but physical Android visual evidence is still missing.
- Three.js increases the bundle; future 3D PRs should record build output size and consider code splitting or asset optimization if growth continues.
- Real-device Android performance readiness is not claimed until the physical-device smoke and performance templates are completed.
