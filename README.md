# Door Runner Memory

Мобильная игра на память — запомни последовательность дверей и пройди как можно дальше!

## What it is

Door Runner Memory — аркадная игра, где нужно запоминать правильную дверь на каждом шагу. Чем дальше проходишь, тем быстрее таймер. Собирай комбо, открывай достижения, соревнуйся с собой!

## Tech Stack

- **Vite 8** — build tool
- **React 19** — UI framework
- **TypeScript** — type safety
- **Tailwind CSS 4** — styling
- **Zustand** — state management
- **Framer Motion** — animations
- **Capacitor** — native APK build
- **Web Audio API** — synthesized sounds
- **PWA** — installable web app

## Requirements

- Bun 1.3.14, matching `packageManager`
- Node.js 20.19+ or 22.12+ if using Node-based tooling with Vite 8

## Install

```bash
bun install
```

## Run (development)

```bash
bun run dev
```

Opens on http://localhost:3000

## Build

```bash
bun run build
```

Current production build output: JS bundle ~439 KB (~133 KB gzip), CSS bundle ~46 KB (~9 KB gzip).

## Lint

```bash
bun run lint
```

## Android APK (via Capacitor)

Capacitor config exists, but the Android project directory is not generated in this archive yet. Create it before syncing or building an APK.

```bash
# Build web assets
bun run build

# Add Android platform once
bunx cap add android

# Sync to Capacitor
bunx cap sync android

# Open in Android Studio
bunx cap open android

# Or build APK from command line
cd android && ./gradlew assembleDebug
```

APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`

## Architecture

```
src/
├── main.tsx              # Entry point + SW registration
├── components/           # UI components
│   ├── AppContent.tsx    # Screen router
│   ├── HomeScreen.tsx    # Home/settings
│   ├── GameScreen.tsx    # Game wrapper
│   └── DoorRunnerScene.tsx  # Game scene (road, doors, runner, VFX)
├── lib/                  # Shared utilities
│   ├── i18n.ts           # Localization (RU/EN)
│   ├── sounds.ts         # Web Audio API
│   ├── themes.ts         # Theme system
│   └── ...
└── store/
    └── gameStore.ts      # Game state + actions
```

## Features

- Regular + Daily Challenge modes
- 3/4/5/6 lanes
- 4 speed levels: Slow, Normal, Fast, Custom (3-30s)
- Progressive speed increase
- Combo system (NICE → GREAT → SUPER → INSANE)
- 20 achievements with progress bars
- Local leaderboard (top 50)
- PWA install + offline support
- 3 sound packs (Classic, 8-bit, Soft)
- 3 visual themes (Classic, Neon, Retro)
- Full RU/EN localization
- Accessibility: reduced motion, screen reader, focus management
- Keyboard controls (1-6, arrows, A/D)
- Swipe gestures
- Haptic feedback

## Tests

```bash
bun run test        # Run all tests once
bun run test:watch  # Watch mode
bun run quality     # Build + lint + test
```

112 unit tests covering:
- Season sequence generation (determinism, boundaries, errors)
- Validators (settings, scores, stats, leaderboard)
- Game store (chooseLane, startGame, resetGame, speed calculations)
- Pure game reducer transitions
- Language detection fallback for test/non-browser environments

## CI/CD

GitHub Actions is configured in `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - run: bun run lint
      - run: bun run test
```

## Known Issues

See `docs/gap-analysis.md` for full security review findings.

- DoorRunnerScene.tsx still needs further decomposition (>1000 lines)
- Game logic has a pure reducer, but the Zustand store still owns many side effects
- Browser e2e, PWA/offline, a11y, and Android device checks are not yet covered

## Deploy

Netlify auto-deploys from GitHub `main` branch.

## License

Private project.
