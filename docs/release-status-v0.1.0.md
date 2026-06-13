# Release Status v0.1.0

Published release: https://github.com/sobag0404/door-runner-memory/releases/tag/v0.1.0

Release commit: the commit pointed to by tag `v0.1.0`

GitHub Actions on `main`: https://github.com/sobag0404/door-runner-memory/actions/runs/27470770885

## Completed

- Release hardening PR merged: https://github.com/sobag0404/door-runner-memory/pull/1
- Annotated tag `v0.1.0` published.
- GitHub Release `v0.1.0` published and marked latest.
- `bun install --frozen-lockfile` passes.
- `bun run build`, `bun run lint`, and `bun run test` pass through `bun run quality`.
- `bun run test:e2e` passes with 14 Playwright tests across desktop Chromium and mobile Chrome profiles.
- `DoorRunnerScene.tsx` is now 133 lines.
- Timer, input, background, runner, doors, and swipe hint were extracted into `src/components/game/`.
- Browser smoke/e2e and PWA/offline checks live in `tests/e2e/`.
- No scoring, daily sequence, visible UX copy, or persisted localStorage schema changes were introduced as part of the release hardening work.

## Remaining Non-Blocking Risks

- Zustand still owns many side effects.
- Dedicated automated a11y audit is not yet a release gate.
- Android/Capacitor APK and real-device performance are not verified in this checkout.
