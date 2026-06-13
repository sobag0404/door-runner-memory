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
- `bun run security:audit` passes with no vulnerabilities.
- CI runs on `ubuntu-latest` and `windows-latest` with Bun `1.3.14`.
- `DoorRunnerScene.tsx` is now 133 lines.
- Timer, input, background, runner, doors, and swipe hint were extracted into `src/components/game/`.
- Browser smoke/e2e and PWA/offline checks live in `tests/e2e/`.
- No scoring, daily sequence, visible UX copy, or persisted localStorage schema changes were introduced as part of the release hardening work.

## Remaining Non-Blocking Risks

- Zustand still owns many side effects.
- Dedicated automated a11y audit is not yet a release gate.
- Android/Capacitor APK and real-device performance are not verified in this checkout.

## Netlify Deploy Check

- `netlify.toml` exists and is configured with `bun run build` and `dist`.
- GitHub shows the Netlify GitHub App installed for the repository.
- The old URL recorded in `worklog.md` (`https://cute-salamander-2682c7.netlify.app`) returns 404.
- The latest GitHub commit status shows only the GitHub Actions CI check; no Netlify deploy status is attached to the commit.
- Netlify dashboard and CLI status require Netlify login in this environment, so production deploy status is not verified yet.
