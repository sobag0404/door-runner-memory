# GitHub Pages Deploy

Status: verified production web deploy path, added after the published `v0.2.0` tag.

Target URL: `https://sobag0404.github.io/door-runner-memory/`

Verified evidence:

- Production URL: `https://sobag0404.github.io/door-runner-memory/`
- Current `main` after Pages enablement: `d301d8c90e0f6dd161e66310b23570f773e0c391`
- Main CI passed on Ubuntu and Windows: https://github.com/sobag0404/door-runner-memory/actions/runs/27508384809
- Pages deploy passed: https://github.com/sobag0404/door-runner-memory/actions/runs/27508384794
- Public checks returned 200 for `/`, `/manifest.json`, `/sw.js`, and generated JS/CSS assets.
- Browser smoke loaded the `Door Runner` heading and registered `sw.js` from `/door-runner-memory/sw.js`.
- A deep link under `/door-runner-memory/` returned GitHub Pages 404 at HTTP level, then `404.html` redirected the browser to the app base path.

## Source Configuration

- Workflow: `.github/workflows/pages.yml`
- Trigger: push to `main` and manual `workflow_dispatch`
- Runtime: Node from `.node-version`, Bun `1.3.14`
- Build command: `GITHUB_PAGES=true bun run build`
- Artifact path: `dist`
- Vite base path under GitHub Pages: `/door-runner-memory/`

## Path Handling

- `vite.config.ts` keeps local/default builds at `/` and switches to `/door-runner-memory/` only when `GITHUB_PAGES=true`.
- `index.html` uses `%BASE_URL%` for manifest and Apple touch icon links.
- `src/main.tsx` registers `sw.js` relative to `import.meta.env.BASE_URL`.
- `public/sw.js` derives cached paths from the service worker scope, so navigation fallback works under the repository subpath.
- `public/manifest.json` uses relative `start_url` and icon paths so it works under both root and subpath deployments.
- `public/404.html` redirects GitHub Pages deep links back to the app base path because GitHub Pages does not support Netlify-style rewrite rules.

## First-Run Requirement

At first, the GitHub Pages API returned `404` for this repository's Pages site, so the first workflow run could not deploy. Pages was then enabled for GitHub Actions deployment, and the rerun succeeded.

If the workflow still fails before deployment, enable Pages in the repository settings:

1. Open GitHub repository settings.
2. Go to Pages.
3. Set Build and deployment source to GitHub Actions.
4. Re-run the `Deploy GitHub Pages` workflow on `main`.

No external secrets are required.

## Post-Deploy Verification

After a successful Pages deployment, verify:

- `https://sobag0404.github.io/door-runner-memory/` returns the app shell.
- `https://sobag0404.github.io/door-runner-memory/manifest.json` returns 200.
- `https://sobag0404.github.io/door-runner-memory/sw.js` returns 200.
- Generated JS/CSS asset URLs from `index.html` return 200.
- A made-up route under `/door-runner-memory/` redirects back to the app base path.
- Service worker registration does not break first load.
- Home screen, game start, lane input, score save, leaderboard, and settings persistence still work on the public URL.

## Still Unrelated / Unverified

- Netlify production deploy remains unverified.
- Android APK/device/performance remains unverified.
- Full accessibility audit remains incomplete.
- No online leaderboard/backend/server verification exists.
