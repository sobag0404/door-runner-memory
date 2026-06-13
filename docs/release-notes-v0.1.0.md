# Door Runner Memory v0.1.0

Door Runner Memory is a mobile-first PWA memory arcade game: remember the highlighted door path, keep a combo alive, and push your local best score.

## Highlights

- Vite 8 + React 19 + TypeScript + Tailwind CSS 4 app.
- Regular and Daily Challenge game modes.
- 3/4/5/6 lane configurations.
- Slow, Normal, Fast, and Custom timer modes with progressive speed increase.
- Combo feedback, 20 achievements, local leaderboard, player stats.
- RU/EN localization.
- PWA manifest, service worker, install prompt, and offline-oriented cache layer.
- Web Audio sound packs, haptic feedback, keyboard controls, and swipe input.
- Theme system with Classic, Neon, and Retro visual styles.

## Release Hardening

- Runtime requirements documented for Vite 8:
  - Bun `1.3.14`
  - Node.js `22.12.0` via `.node-version` / `.nvmrc`
  - Supported Node range: `>=20.19.0 <21 || >=22.12.0`
- CI uses `actions/checkout@v6` and `actions/setup-node@v6` for Node 24 readiness.
- CI runs on Ubuntu and Windows with Bun `1.3.14`.
- `bun audit` is part of the release gate.
- Language detection is resilient when `navigator.language` is unavailable in non-browser test environments.
- Render-phase state setters were removed from the game scene's coin feedback path.
- `DoorRunnerScene.tsx` was decomposed into focused scene, runner, door, timer, background, swipe, and input modules.
- Playwright smoke/e2e coverage was added for desktop/mobile game flows and PWA/offline behavior.
- Project docs now distinguish fixed security-review items from remaining release risks.

## Verification Results

GitHub Actions is green on `main` for the release commit pointed to by tag `v0.1.0`.

Latest local verification on `codex/production-hardening` on 2026-06-13:

```bash
bun install --frozen-lockfile
bun run build
bun run lint
bun run test
bun run test:e2e
bun run security:audit
```

Current automated result:

- 112 unit tests passing.
- 14 Playwright tests passing across desktop Chromium and mobile Chrome profiles.
- `bun audit` reports no vulnerabilities.
- Production build output: JS ~439.5 KB / ~133.1 KB gzip, CSS ~46.0 KB / ~8.6 KB gzip.

## Known Issues / Not Yet Release-Blocking For Web Prototype

- Zustand store still owns many side effects.
- Post-v0.1.0 local hardening adds focused Playwright accessibility smoke; a broader axe/manual a11y audit is still not complete.
- Android/Capacitor APK project directory is not generated in this checkout; APK/device performance is not yet verified.
- Netlify deploy status is not verified from this environment; the old anonymous Netlify URL returns 404 and Netlify dashboard/CLI requires login.
- Online leaderboard is intentionally absent. Do not add one without server-side verification and replay protection.

## Upgrade Notes

- Use Bun for the canonical install/build/test workflow.
- Do not use Node 18 for Vite 8.
- Existing localStorage schema is unchanged in this release.
