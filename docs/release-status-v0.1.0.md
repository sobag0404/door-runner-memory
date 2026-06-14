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

- Zustand still orchestrates game actions, stats calculations, achievement unlock checks, and leaderboard entry construction. Sound/haptic/aria effects, feedback timers, and persistence are now isolated behind focused helpers.
- Focused Playwright accessibility smoke exists, but a full accessibility audit is still not complete.
- Android/Capacitor APK and real-device performance are not verified in this checkout.
- Netlify production deploy status is not verified from this environment.

## Post-v0.1.0 Hardening Added Locally

- Sound, haptics, and aria announcements are isolated behind `src/store/gameEffects.ts`.
- Focused Playwright accessibility smoke was added in `tests/e2e/a11y.spec.ts`.
- `bun run test:a11y` was added as a focused local/CI smoke check.
- CI now includes an explicit `Accessibility smoke` step.
- Android release assumptions are documented in `docs/android-release.md`.
- Netlify deploy verification is documented in `docs/netlify-deploy-checklist.md`.
- Next-release priorities are documented in `docs/roadmap-v0.2.0.md`.
- Persistence/localStorage characterization tests were added in `src/__tests__/persistence.test.ts`.
- Game persistence was extracted to `src/store/gamePersistence.ts` without claiming gameplay, scoring, daily sequence, or localStorage schema/key changes.
- Current post-hardening `main` is `b4832b03adcd12f6ef8a3f31d0bbca21335e7a48`.
- Post-merge `main` CI is green on Ubuntu and Windows: https://github.com/sobag0404/door-runner-memory/actions/runs/27495057484

## Netlify Deploy Check

- `netlify.toml` exists and is configured with `bun run build` and `dist`.
- The old URL recorded in `worklog.md` (`https://cute-salamander-2682c7.netlify.app`) returns 404.
- GitHub commit status API for `b4832b03adcd12f6ef8a3f31d0bbca21335e7a48` returned no commit statuses.
- GitHub check runs for that commit show only GitHub Actions CI jobs; no Netlify check run is attached.
- GitHub deployments API returned no deployments for the latest commit and no repository deployments.
- Netlify dashboard and CLI status require Netlify login or a public deploy URL in this environment, so production deploy status is not verified yet.
