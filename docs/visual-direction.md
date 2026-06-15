# Door Runner Memory Visual Direction

Status: implementation brief for future visual polish

## Intent

Door Runner Memory should feel like a colorful, fast, mobile-first runner while staying centered on the memory task: remember the correct door, choose quickly, and keep momentum.

Subway Surfers is only a broad energy reference: saturated color, readable forward motion, playful feedback, and immediate mobile arcade clarity. Do not copy Subway Surfers characters, logos, exact UI, proprietary assets, track layouts, environment art, or recognizable visual identity.

## Art Direction

### Color

- Use a bright arcade palette with clear contrast between road, doors, runner, HUD, and feedback states.
- Keep door colors distinct at small mobile sizes and under motion.
- Avoid a one-hue theme. Use accents deliberately for correct, wrong, combo, timer, and speed feedback.
- Preserve theme support. Classic, Neon, and Retro may evolve, but should remain distinguishable.

### Road And Camera Feel

- The scene should imply forward movement through a lane/road corridor, not a static menu board.
- Perspective can be 2.5D or layered CSS/Framer Motion; do not require 3D or a rewrite.
- Lanes must remain stable enough that memory choices are readable during speed changes.
- Background motion should support momentum without competing with the doors or HUD.

### Doors

- Doors are the primary gameplay objects and must be the clearest visual element.
- Each door needs a stable hit target, accessible name, and readable active/correct/wrong feedback.
- Avoid dense decoration inside doors if it makes lane identity harder to read.
- Door states should work in reduced-motion mode without relying only on animation.

### Runner Feedback

- Runner feedback should be expressive but secondary to door choice clarity.
- Correct/wrong/combo feedback can use pose, squash, glow, particles, or trail accents if they do not obscure doors.
- The runner should not jitter, resize layout, or hide lane controls.
- Failure and timeout feedback should be visible without feeling like a different game mode.

### HUD Density

- HUD must stay compact and scan-friendly: score, combo, timer, speed, and mode should be visible without crowding the lane area.
- Avoid marketing-style hero panels inside the game screen.
- Mobile portrait is the primary layout. Desktop should scale without creating overly wide, empty lanes.

### Motion And Reduced Motion

- Motion should communicate speed and feedback, not decorate every element.
- Reduced-motion mode must disable nonessential movement while preserving clear state feedback.
- Any new animated effect needs a mobile performance check and a reduced-motion fallback.

### Mobile Readability

- All lane controls must remain reachable and readable at 390x844 and similar mobile viewports.
- Text must not overlap buttons, HUD, doors, or feedback toasts.
- Touch targets should remain stable; hover-only affordances are not sufficient.

## Implementation Constraints

- No gameplay, scoring, daily sequence, or persisted localStorage schema/key changes in visual-only PRs.
- No online leaderboard/backend work.
- No Android/Netlify production-readiness claims from visual work.
- Keep visual implementation PRs small enough for screenshot review.
- Prefer CSS/component-level prototypes before larger scene restructuring.

## Android Packaging Art

- Launcher icon and splash art must be original Door Runner Memory branding, generated specifically for this project, created in-house, or licensed for this project with provenance recorded.
- Android icon/splash work may use the same broad arcade energy reference as the app, but must not copy Subway Surfers characters, logos, coins, hoverboards, track layouts, graffiti treatments, HUD layout, or recognizable environment art.
- Generated/default Android assets are acceptable for debug builds only and must not be described as final branding.

## Acceptance Criteria For Future Visual PRs

- Desktop and mobile screenshots are attached or linked for the changed screens.
- CI remains green, including focused a11y smoke.
- Door readability is checked on desktop Chromium and mobile Chrome profile.
- Reduced-motion behavior is verified for new animations.
- No gameplay, scoring, daily sequence, or storage behavior changes are present in the diff.
- Performance risk is checked: visual effects do not dominate CPU or obscure controls during mobile viewport smoke.
- New assets are original, licensed for the project, or generated specifically for this project with provenance recorded.

