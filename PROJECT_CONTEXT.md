# Door Runner Memory — Project Context
## Current Verified Status (post-v0.1 hardening, 2026-06-14)

- Current `main`: `b4832b03adcd12f6ef8a3f31d0bbca21335e7a48` (`Merge pull request #6 from sobag0404/codex/netlify-status-verification`).
- Merged hardening PRs:
  - PR #2 hardened CI/release gates, added Ubuntu + Windows CI matrix, audit gate, a11y smoke gate, Android/Netlify/roadmap docs, and extracted `gameEffects` / `feedbackTimers`.
  - PR #3 added tests-only persistence/localStorage characterization.
  - PR #4 extracted `src/store/gamePersistence.ts` from `src/store/gameStore.ts`.
  - PR #5 refreshed project context/docs after hardening.
  - PR #7 fixed a flaky wrong-lane unit test expectation without production code changes.
  - PR #6 recorded Netlify verification status as docs-only evidence.
- Post-merge `main` CI is green: audit, build/type-check, lint, unit tests, e2e/smoke, and focused a11y smoke passed on Ubuntu and Windows in https://github.com/sobag0404/door-runner-memory/actions/runs/27495057484.
- The automated a11y gate is a focused Playwright smoke check. A full accessibility audit is still not complete.
- Gameplay rules, scoring, daily sequence behavior, and persisted localStorage schema/keys are not claimed to have changed in PR #2/#3/#4.
- Leaderboard remains local-only. There is no online leaderboard, backend, server-side score verification, replay protection, or account system.
- Android/Capacitor APK build, real-device smoke, real-device performance, and Netlify production deploy remain unverified unless a later doc records evidence.
- Netlify no-login verification found no GitHub Netlify deployment/status and no credible public production URL; production deploy remains unverified.

### Current Architecture Boundary Notes

- `src/core/game/gameReducer.ts` owns pure game state transitions.
- `src/store/gameEffects.ts` owns sound, haptic, and aria-live announcement effects for start/correct/wrong/timeout flows.
- `src/store/feedbackTimers.ts` owns feedback timeout scheduling and cleanup.
- `src/store/gamePersistence.ts` owns persisted settings, best scores, stats, achievements, and local leaderboard reads/writes through the existing localStorage keys.
- `src/store/gameStore.ts` still orchestrates game start/choice/timeout/reset flows, computes stats updates, checks achievements, constructs leaderboard entries, and calls the extracted effects/timers/persistence helpers.
- Scalar setting keys `drm_lang`, `drm_theme`, and `drm_soundPack` still live in their existing i18n/theme/sound helpers and are mirrored through `gamePersistence` settings helpers.

### Visual Direction Notes

- Target feel: colorful mobile runner energy roughly inspired by Subway Surfers, adapted to the current door-memory mechanic.
- Use this as direction, not imitation: bright readable lanes, playful urban-runner momentum, expressive door/runner feedback, and mobile-first clarity.
- Do not copy Subway Surfers characters, logos, exact UI, proprietary assets, or recognizable level art.
- Visual upgrades must preserve gameplay rules, scoring, daily sequence behavior, localStorage schema/keys, accessibility smoke coverage, and reduced-motion support.
- Treat the visual refresh as a scoped future product/design lane after release gates stay green; do not combine it with architecture or deploy changes.

## Общее
- **Тип:** Мобильная игра-аркада на память (Subway Surfers × Simon Says)
- **Стек:** React 19 + Vite 8 + TypeScript + Tailwind CSS 4 + Zustand + Framer Motion
- **APK:** Capacitor (com.doorrunner.memory)
- **Запуск:** `bun run dev` (порт 3000)
- **Репозиторий:** https://github.com/sobag0404/door-runner-memory
- **Деплой:** Netlify (auto-deploy from GitHub)
- **Билд:** `bun run build` → dist/

## Фичи
### Основные
- **Режимы игры:** Regular (бесконечный) + Daily Challenge (одна последовательность на день)
- **Дорожки:** 3/4/5/6 lanes
- **Скорость:** Slow (20s), Normal (12s), Fast (7s), Custom (3-30s) — с прогрессивным ускорением
- **Прогрессивная скорость:** каждые 5 правильных ответов скорость ↑3%, мин 40% от базы
- **Таймер:** rAF-based countdown-бар, таймаут = ошибка
- **Жизни:** Бесконечные, ошибка = сброс последовательности
- **Combo:** NICE → GREAT → SUPER → INSANE (в store state)

### Спринт 3
- **20 достижений** — счёт, комбо, всего ответов, игры, скорость, lanes, daily
- **Daily Challenge** — одна последовательность на день (UTC), обратный отсчёт
- **Leaderboard** — локальный, top 50, фильтр по режиму (all/regular/daily)
- **Name Modal** — ввод имени при выходе с результатом
- **Stats** — полная статистика игрока в localStorage

### Спринт 4
- **PWA** — manifest, service worker, offline, install prompt, Apple meta tags
- **Звуковые эффекты** — 7 синтезированных звуков через Web Audio API + 3 sound packs + toggle
- **Swipe-жесты** — горизонтальный свайп для выбора дорожки
- **Клавиатура** — клавиши 1-6 для выбора lane
- **Haptic feedback** — вибрация на мобильных (light/heavy)
- **Speed Indicator** — визуальный индикатор ускорения
- **Achievement Toast** — всплывающее уведомление при разблокировке
- **rAF Timer** — плавный таймер на requestAnimationFrame вместо setInterval

### Спринт 5
- **Custom Difficulty** — настройка таймера (3-30с) + выбор количества дорожек
- **Screen Transitions** — анимация переходов между экранами (AnimatePresence + direction)
- **PWA Install Banner** — баннер установки (iOS/Android) с инструкциями
- **Mobile Optimization** — safe-area insets, viewport-fit=cover, responsive layout
- **Capacitor Config** — capacitor.config.json для будущего APK
- **i18n** — полная локализация RU/EN (все экраны)
- **Error Boundary** — React error boundary с fallback UI
- **Achievement Progress Bars** — прогресс-бары для заблокированных достижений
- **A11y** — aria-labels, focus trap, reduced motion, screen reader

### Спринт 6 (текущий)
- **Исправление визуальных багов:**
  - Персонаж больше не дёргается (убран конфликт CSS runnerBounce + framer-motion y)
  - Двери видны (исправлен z-index z-15→z-[15], убран DoorRow remount)
  - Текст читаемый (убран willChange:transform, убрана пульсация scale на текущей двери)
- **Security Review** — получен внешний аудит, создан gap analysis (см. docs/gap-analysis.md)

## Оптимизации кода
- **Combo в store** — вместо модульной переменной, полноценное состояние
- **Cleanup timers** — clearTimeout при reset/навигации, нет утечек
- **saveBestScoreMut** — avoids redundant localStorage reads
- **Shared constants** — LANE_COLORS/LANE_LIGHT/getLanePercent/hapticFeedback в `lib/constants.ts`
- **Удалены дубли** — LANE_COLORS больше не дублируется

## Файловая структура
```
src/
├── main.tsx              # Entry + SW registration
├── index.css
├── components/
│   ├── AppContent.tsx       # Screen router (home | game | leaderboard)
│   ├── HomeScreen.tsx       # Настройки, режимы, sound toggle, install
│   ├── GameScreen.tsx       # Name modal + back button
│   ├── DoorRunnerScene.tsx  # Игровая сцена (VFX, HUD, timer, swipe, keyboard)
│   ├── AchievementsPanel.tsx # Модальное окно достижений
│   ├── LeaderboardScreen.tsx # Таблица лидеров
│   ├── InstallBanner.tsx    # PWA install баннер
│   ├── TutorialOverlay.tsx  # Обучающий туториал
│   ├── BackgroundParticles.tsx # Анимированные частицы на canvas
│   └── OfflineIndicator.tsx # Индикатор offline
├── lib/
│   ├── localStore.ts        # localStorage абстракция
│   ├── season.ts            # Сезонная система
│   ├── achievements.ts      # Определение достижений + PlayerStats
│   ├── daily.ts             # Daily challenge утилиты
│   ├── constants.ts         # LANE_COLORS, LANE_LIGHT, hapticFeedback
│   ├── sounds.ts            # Web Audio API звуковые эффекты + packs
│   ├── themes.ts            # Theme system (classic/neon/retro)
│   ├── i18n.ts              # Локализация RU/EN
│   ├── a11y.ts              # Accessibility утилиты
│   └── usePWAInstall.ts     # Hook для PWA install prompt
└── store/
    └── gameStore.ts         # Zustand: всё состояние + actions + progressive speed

public/
├── manifest.json            # PWA manifest
├── sw.js                    # Service worker (network-first + cache fallback)
├── icon-192.png             # PWA icon
└── icon-512.png             # PWA icon

docs/
├── security-review-spec.md  # Полный аудит от безопасника
└── gap-analysis.md          # Сопоставление замечаний с текущим состоянием
```

## Деплой
Netlify auto-deploy: push в GitHub → Netlify билдит → деплой за ~30сек

## Security Review — известные проблемы

Подробнее: `docs/gap-analysis.md`

### Закрытые P0/P1 из ревью
- ✅ README.md есть
- ✅ Sequence overflow исправлен через `getExpectedPath()` без fallback к двери 0
- ✅ localStorage валидируется через `src/lib/validators.ts`
- ✅ Лидерборд честно обозначен как локальный: "Рекорды на устройстве"
- ✅ Vitest подключён, unit-тесты есть
- ✅ GitHub Actions config есть в `.github/workflows/ci.yml`
- ✅ Pure gameReducer вынесен в `src/core/game`

### Оставшиеся важные риски
- ⚠️ DoorRunnerScene.tsx всё ещё >1000 строк, нужна дальнейшая декомпозиция
- ⚠️ Zustand store всё ещё содержит много side effects
- ⚠️ Нет e2e/smoke/PWA/offline/a11y тестов
- ⚠️ APK/Android pipeline не подтверждён на реальном устройстве

### Безопасность
- ✅ Локальный leaderboard только — соответствует рекомендации безопасника
- ✅ Нет секретов в коде
- ✅ Нет online leaderboard без server-side verification
- ⚠️ При добавлении online leaderboard нужен server session + event stream + replay protection

## Запрещённые действия (по результатам security review)
- ❌ Полный rewrite на Kotlin/Flutter/Unity/Godot без profiling на реальных устройствах
- ❌ Переписывать DoorRunnerScene.tsx целиком одним коммитом
- ❌ Менять правила игры без тестов
- ❌ `npm audit fix --force`
- ❌ Массовые обновления major versions без причины
- ❌ Добавлять online leaderboard без server-side verification
- ❌ Хранить секреты в коде/README/.env в git
- ❌ Добавлять рекламу/IAP без отдельного ТЗ

## Что ещё можно добавить (по приоритету безопасности)
1. Декомпозиция DoorRunnerScene.tsx малыми PR
2. Вынести side effects из Zustand store в тестируемый effects/service layer
3. Минимальные e2e/smoke/PWA/offline/a11y проверки
4. Профилирование APK на реальных устройствах
5. Архитектурная документация
6. Документация сборки APK через Capacitor
