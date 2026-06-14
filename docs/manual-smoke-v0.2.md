# Manual Smoke Evidence for v0.2

Status: local production-preview smoke completed for the current v0.2 planning baseline.

Baseline checked:

- Commit: `d70f1a88a5698e63cab1d21d27587ff59e96fafa`
- Date: 2026-06-14
- Preview URL: `http://127.0.0.1:4173/`
- Build source: fresh `bun install --frozen-lockfile` and `bun run build`

## Local Preview Evidence

The app was checked from a production build served through `vite preview`.

| Area | Evidence | Result |
| --- | --- | --- |
| Desktop home | `Door Runner` heading and primary `PLAY!`/localized play action visible | Pass |
| Regular game start | Regular game started from the home screen | Pass |
| Tap/click lane input | A lane button was clicked and accepted as correct input | Pass |
| Keyboard lane input | Number-key lane input was accepted as correct input | Pass |
| Score save | A score was saved as `Smoke Player` | Pass |
| Local leaderboard | Saved score appeared in the local leaderboard | Pass |
| Settings persistence | Language was changed to English and remained English after reload | Pass |
| Mobile viewport | `390x844` viewport rendered without horizontal overflow; heading and play control remained visible | Pass |
| First load | Production preview loaded without browser console errors | Pass |

## PWA Endpoint Evidence

Public preview requests:

| URL | Evidence | Result |
| --- | --- | --- |
| `/manifest.json` | HTTP 200, `application/json` | Pass |
| `/sw.js` | HTTP 200, `text/javascript` | Pass |
| `/offline-fallback-check` | HTTP 200 and SPA root present | Pass |

Service-worker registration did not block first load in the browser smoke. Automated PWA coverage remains the stronger registration check through `tests/e2e/pwa.spec.ts`.

## Not Covered By This Manual Smoke

- Netlify production deploy remains unverified.
- Android APK build, Android device smoke, and real-device performance remain unverified.
- Full accessibility audit remains incomplete; focused a11y smoke and the current coverage matrix are documented separately in `docs/accessibility-audit.md`.
- Extended offline behavior was not manually stress-tested beyond endpoint availability and existing automated PWA coverage.
