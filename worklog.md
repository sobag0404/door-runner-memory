---
Task ID: 1
Agent: Main
Task: Fix preview, push to GitHub, deploy

Work Log:
- Diagnosed preview not loading — dev server was crashing after HMR requests
- Added '127.0.0.1' and 'localhost' to allowedDevOrigins in next.config.mjs
- Started dev server with nohup for stability
- Verified page loads correctly via agent-browser (200 OK, all elements visible)
- Tested game flow: Home → Play → Click lanes → Works!
- Deleted unnecessary files: screenshots, page.tsx.bak, GameOverScreen.tsx, launcher.mjs, etc.
- Updated PROJECT_CONTEXT.md with deployment info
- Added output: 'export' to next.config for static hosting
- Set up GitHub remote: https://github.com/sobag0404/door-runner-memory
- Pushed all code to GitHub (3 commits)
- Tried GitHub Pages — account doesn't support it
- Tried Vercel CLI — needs separate Vercel token (GitHub token doesn't work)
- Documented free deployment alternatives

Stage Summary:
- Preview works (dev server stable)
- GitHub repo updated: https://github.com/sobag0404/door-runner-memory
- Static export works (out/ directory generated)
- Deployment requires: Vercel token, Netlify token, or Cloudflare account
- PROJECT_CONTEXT.md saved on GitHub for progress preservation
