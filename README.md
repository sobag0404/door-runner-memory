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

- Node.js 18+ / Bun
- npm or bun

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

Output in `dist/` (~365 KB, 114 KB gzipped)

## Lint

```bash
bun run lint
```

## Android APK (via Capacitor)

```bash
# Build web assets
bun run build

# Sync to Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android

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
│   ├── gameStore.ts      # Zustand store
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
- 19 achievements with progress bars
- Local leaderboard (top 50)
- PWA install + offline support
- 3 sound packs (Classic, 8-bit, Soft)
- 3 visual themes (Classic, Neon, Retro)
- Full RU/EN localization
- Accessibility: reduced motion, screen reader, focus management
- Keyboard controls (1-6, arrows, A/D)
- Swipe gestures
- Haptic feedback

## Known Issues

See `docs/gap-analysis.md` for full security review findings.

- Sequence overflow after 100 steps (fallback to door 0)
- No localStorage validation
- No unit tests yet
- DoorRunnerScene.tsx needs decomposition (~985 lines)
- Leaderboard is local-only — labeled "Таблица лидеров" but should say "На этом устройстве"

## Deploy

Netlify auto-deploys from GitHub `main` branch.

## License

Private project.
