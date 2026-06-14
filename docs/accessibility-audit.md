# Accessibility Audit Status

Status: focused automated smoke coverage exists; full accessibility audit is not complete.

Audit baseline: `main` commit `d78aa85238fe26d0432093f3ea1dc39bd6535f9b`, after PR #14.

CI gate:

- `bun run test:a11y`
- Test file: `tests/e2e/a11y.spec.ts`
- Browser coverage in CI follows the Playwright project matrix.

## Automated Coverage Matrix

| Area | Automated check | Status |
| --- | --- | --- |
| Keyboard start flow | Tab reaches `PLAY!`, Enter starts the game, number key chooses the correct lane | Covered |
| Home controls | Primary home buttons expose accessible names | Covered |
| Mode and option state | Regular/Daily controls and selected lane/speed `aria-pressed` state are checked | Covered |
| Active game controls | Back button and current door lane buttons expose accessible names | Covered |
| Settings panel | Theme, language, and sound-pack controls are discoverable by accessible text/name | Covered |
| Live announcements | `#game-announcer` has `role="status"`, `aria-live="polite"`, and announces start/correct feedback | Covered |
| Save-score dialog | Dialog is visible, modal, focuses the name input, and exposes share/skip/save controls | Covered |
| Leaderboard navigation | Saved local score appears, heading is visible, and filter/back controls are reachable | Covered |
| Reduced motion | Browser reduced-motion preference is detected and global animation duration is reduced | Covered |
| Reduced-motion game controls | Active game controls remain reachable with reduced motion enabled | Covered |
| Mobile viewport | 390x844 viewport keeps core controls reachable and avoids horizontal overflow | Covered |

## Manual Audit Gaps

These are not completed by the current smoke suite:

- Screen-reader pass with NVDA, VoiceOver, or TalkBack.
- WCAG-oriented review for color contrast across Classic, Neon, and Retro themes.
- Focus order review across every modal, tutorial step, install banner state, and leaderboard filter state.
- Touch target measurement across supported lane counts and small mobile screens.
- Error boundary, offline banner, install banner, achievement modal, and achievement toast review.
- Long-session reduced-motion and animation fatigue review.
- Localization review for RU and EN accessible names, announcements, and truncation.
- Manual verification that visual effects never obscure actionable controls during fast gameplay.

## Reduced-Motion Status

Automated coverage verifies that `prefers-reduced-motion: reduce` is honored globally and that active game controls remain reachable. This is not the same as a full animation audit. Future visual or VFX changes still need reduced-motion review before release claims.

## Keyboard And Screen-Reader Scope

Keyboard smoke currently covers the main start/play loop and selected save/leaderboard navigation. Screen-reader support is inferred from roles, names, and live-region checks; it has not been validated with a real assistive technology pass.

## Release Rule

Release notes may claim focused automated accessibility smoke coverage. They must not claim full accessibility readiness or a completed accessibility audit until the manual gaps above are completed and recorded.
