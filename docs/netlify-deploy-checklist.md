# Netlify Deploy Verification Checklist

Audit date: 2026-06-14

## Current Verification Snapshot

Checked from `main` commit `faaa82f2df4cd3663243c3db29b1fc394ee973cf` without Netlify login, dashboard access, tokens, or secret changes.

Evidence gathered:

- `netlify.toml` exists at the repo root.
- Build command is `bun run build`.
- Publish directory is `dist`.
- Security headers and SPA fallback redirect are declared in `netlify.toml`.
- There is no root `_headers` file; Netlify should use `netlify.toml` headers.
- `.node-version` and `.nvmrc` are `22.12.0`.
- `package.json` allows Node `>=20.19.0 <21 || >=22.12.0` and pins Bun `1.3.14`.
- `dist/index.html`, `dist/assets/`, `dist/manifest.json`, `dist/sw.js`, `dist/icon-192.png`, and `dist/icon-512.png` are present in this checkout.
- GitHub commit status API for `faaa82f2df4cd3663243c3db29b1fc394ee973cf` returned `total_count: 0`; no Netlify commit status is attached.
- GitHub check runs for that commit are only GitHub Actions `build-and-test (ubuntu-latest)` and `build-and-test (windows-latest)`.
- GitHub deployments API returned no deployments for the latest commit and no repository deployments.
- The old URL recorded in `worklog.md`, `https://cute-salamander-2682c7.netlify.app/`, returns HTTP `404 Not Found`.

Current conclusion:

- Netlify configuration is present and reviewable in source.
- No credible public production deploy URL, GitHub deployment, or Netlify status evidence was found without Netlify access.
- Netlify production deploy status remains unverified.
- Live URL checks for app load, assets, SPA fallback, HTTPS/HSTS, and response headers cannot be completed until a production URL or Netlify dashboard/CLI evidence is available.

## Repo Configuration

- [x] Confirm `netlify.toml` is present at the repo root.
- [x] Confirm Netlify build command is `bun run build`.
- [x] Confirm Netlify publish directory is `dist`.
- [x] Confirm the app builds as a static Vite app; `vite.config.ts` does not override `build.outDir`, so `dist` is expected.
- [x] Confirm Node runtime compatibility: `.node-version` and `.nvmrc` are `22.12.0`; `package.json` allows `>=20.19.0 <21 || >=22.12.0`.
- [x] Confirm Bun compatibility: `packageManager` and `engines.bun` both pin `bun@1.3.14`.

## Headers And Redirects

- [x] Confirm security headers are declared in `netlify.toml` under `[[headers]]` for `/*`.
- [x] Confirm there is no separate `_headers` file; Netlify should use the headers from `netlify.toml`.
- [x] Confirm configured headers include:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `Content-Security-Policy` limited to same-origin scripts, images, fonts, connections, and manifest, with inline styles allowed.
- [x] Confirm SPA fallback redirect is declared: `/*` to `/index.html` with status `200`.
- [ ] After deploy, verify a deep route returns the app shell rather than a Netlify 404.

## Verifiable Without Netlify Login

- [ ] Run `bun install --frozen-lockfile`.
- [ ] Run `bun run build`.
- [x] Confirm `dist/index.html` exists.
- [x] Confirm `dist/assets/` contains generated JS and CSS bundles.
- [x] Confirm `dist/manifest.json`, `dist/sw.js`, `dist/icon-192.png`, and `dist/icon-512.png` exist.
- [ ] Run `bun run lint`.
- [ ] Run `bun run test`.
- [ ] Run `bun run test:e2e` if browser dependencies are available.
- [ ] With a public deploy URL, verify:
  - `/` returns 200.
  - `/manifest.json` returns 200.
  - `/sw.js` returns 200.
  - a made-up client route returns 200 and serves `index.html`.
  - configured security headers are present on HTML responses.
  - generated asset URLs from `index.html` return 200.

## Netlify Dashboard Checks

- [ ] Confirm the connected repository and production branch are correct.
- [ ] Confirm base directory is repo root or empty.
- [ ] Confirm build command is `bun run build`.
- [ ] Confirm publish directory is `dist`.
- [ ] Confirm the deploy environment uses Node `22.12.0` or another version allowed by `package.json`.
- [ ] Confirm Bun `1.3.14` is available or explicitly configured, for example through Netlify's Bun support or `BUN_VERSION`.
- [ ] Confirm no unexpected environment variables are required for this static app.
- [ ] Confirm no secrets are added or changed as part of this deploy verification.
- [ ] Confirm the latest production deploy log shows a clean install and build.
- [ ] Confirm custom domain, HTTPS, and certificate status are healthy if a custom domain is attached.
- [ ] Confirm deploy previews use the same build command and publish directory unless intentionally overridden.

## Manual Smoke After Deploy

- [ ] Home screen renders on desktop and mobile viewport.
- [ ] Regular game starts.
- [ ] Touch/click lane input works.
- [ ] Keyboard lane input works.
- [ ] Score save and local leaderboard work after reload.
- [ ] Language/theme/sound settings persist after reload.
- [ ] Install prompt/PWA behavior does not break first load.
- [ ] Offline reload behavior works after the service worker has installed.

## Current Gaps

- Netlify site ID, production URL, production branch, deploy logs, and dashboard settings were not verified because they require Netlify access or a public deploy URL.
- GitHub commit statuses and deployments did not provide Netlify evidence for `faaa82f2df4cd3663243c3db29b1fc394ee973cf`.
- The old public Netlify URL in `worklog.md` returns 404 and is not evidence of a live production deploy.
- Live app load, static asset responses, SPA fallback, response headers, HTTPS status, HSTS behavior, and custom domain status were not verified because no deployed URL was available in this lane.
- Environment variables and secrets were not inspected or changed; that requires dashboard access and is intentionally out of scope.
- The existing `dist` folder is present and shaped like a Vite build, but this docs lane did not run a fresh build to avoid modifying files outside `docs/netlify-deploy-checklist.md`.
