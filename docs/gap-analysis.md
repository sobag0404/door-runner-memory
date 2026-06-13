# Gap Analysis — Security Review Spec vs Current Vite Project
## Current Status Override (2026-06-14)

This document contains older review notes and some mojibake inherited from earlier docs. The current hardening state is:

- PR #2, PR #3, and PR #4 are merged into `main` at `409f6b5b1679f4f36b72e2e8cd207be8046563e4`.
- GitHub Actions passed on Ubuntu and Windows with dependency audit, build/type-check, lint, unit tests, e2e/smoke, and focused a11y smoke.
- Browser e2e/PWA smoke and focused a11y smoke now exist; a full accessibility audit remains incomplete.
- `DoorRunnerScene.tsx` has already been decomposed significantly; continue decomposition only as small scoped PRs.
- Sound/haptic/aria effects, feedback timers, and persistence are extracted from `gameStore`.
- Remaining store work is orchestration-level: game action flow, stats calculations, achievement unlock checks, and leaderboard entry construction.
- Android APK/device performance and Netlify production deploy remain unverified.
- Leaderboard remains local-only; do not add online leaderboard/backend/server verification without a separate design.

**Дата:** 2026-03-05  
**Ревьюер:** безопасник (внешний аудит)  
**Спецификация:** `docs/security-review-spec.md`  
**Текущий стек:** Vite 8 + React 19 + TypeScript + Tailwind CSS 4 + Zustand + Framer Motion + Capacitor

---

## Ключевое расхождение: стек изменился

Безопасник ревьюил **старый проект на Expo / React Native / expo-gl + Three.js**.  
Мы полностью мигрировали на **Vite + React (web) + Tailwind CSS + Framer Motion**.  
3D-сцена (expo-gl + three.js) заменена на **CSS/Framer Motion 2.5D рендеринг**.

Это означает:
- Многие проблемы (mojibake, expo-gl, Three.js монолит, AsyncStorage) **уже не актуальны**
- Но архитектурные принципы и security-замечания **остаются валидны**
- Рекомендации по APK сборке (eas.json) нужно адаптировать под **Capacitor**

---

## Построчный разбор замечаний

### P0 — Критические

| ID | Замечание безопасника | Статус в Vite-проекте | Комментарий |
|---:|---|---|---|
| P0-1 | Mojibake в GameScreen.tsx (РЎС‡С‚ и т.д.) | ✅ ИСПРАВЛЕНО | Полная миграция на Vite + i18n с корректным UTF-8. Все строки в `src/lib/i18n.ts` — нормальный русский/английский. |
| P0-2 | Нет README.md | ✅ ИСПРАВЛЕНО | README.md есть и содержит запуск, сборку, тесты и ограничения APK pipeline. |
| P0-3 | Нет eas.json для APK | ⚠️ АДАПТИРОВАТЬ | Используем Capacitor вместо EAS. Конфиг уже есть: `capacitor.config.json`. Нужна документация по сборке APK через Capacitor. |
| P0-4 | npm ci не проходит | ✅ ИСПРАВЛЕНО | `bun install` работает. `bun run lint` проходит (с pre-existing warnings). `bun run dev` стартует без ошибок. |

### P1 — Важные

| ID | Замечание безопасника | Статус в Vite-проекте | Комментарий |
|---:|---|---|---|
| P1-1 | Вынести pure game reducer | ✅ СДЕЛАНО | Создан `src/core/game/gameReducer.ts` — чистый reducer без side effects. Zustand пока не использует его, но reducer готов к интеграции.
| P1-2 | Тесты reducer | ✅ СДЕЛАНО | 112 unit-тестов: seasonSequence, validators, gameStore, gameReducer, i18n fallback. vitest настроен.
| P1-3 | Timers cleanup | ✅ ИСПРАВЛЕНО | `clearFeedbackTimers()` в gameStore.ts + `useRef` + cleanup в useEffect. |
| P1-4 | Sequence overflow (`?? 0`) | ✅ ИСПРАВЛЕНО | Добавлен `getExpectedPath()` — бесконечный детерминированный генератор. Нет fallback к 0.
| P1-5 | Validation localStorage | ✅ ИСПРАВЛЕНО | Добавлен `src/lib/validators.ts` — normalizeSettings, normalizeBestScores, normalizeStats и т.д.
| P1-6 | CI/CD | ✅ СДЕЛАНО | GitHub Actions config есть в `.github/workflows/ci.yml`; выполнение на GitHub нужно проверить после восстановления auth/remote.
| P1-7 | Декомпозиция DoorRunnerScene | ⚠️ ПРОГРЕСС | Вынесены VFX, HUD, LaneButtons, AchievementToast в src/components/game/, но файл сцены всё ещё >1000 строк. Нужно продолжить малыми PR.

### P2 — Улучшения

| ID | Замечание безопасника | Статус в Vite-проекте | Комментарий |
|---:|---|---|---|
| P2-1 | Theme tokens вынести | ✅ ЕСТЬ | `src/lib/themes.ts` — централизованная тема. |
| P2-2 | UI компоненты вынести | ⚠️ ЧАСТИЧНО | Есть отдельные компоненты (InstallBanner, TutorialOverlay, AchievementsPanel, ErrorBoundary), но GameScreen и DoorRunnerScene всё ещё перегружены. |
| P2-3 | Accessibility labels | ✅ ЕСТЬ | Добавлены: aria-label, role, aria-live, focus trap, prefers-reduced-motion. |
| P2-4 | Error boundary | ✅ ЕСТЬ | `src/components/ErrorBoundary.tsx`. |
| P2-5 | Архитектурная документация | ❌ НЕТ | Нет docs/architecture.md. |

### Security (Раздел 8)

| Замечание | Статус | Комментарий |
|---|---|---|
| Local score нельзя доверять для online leaderboard | ✅ ИСПРАВЛЕНО | Переименован: «Рекорды на устройстве» / «Records on this device»
| Нельзя отправлять score на сервер без верификации | ✅ ПРИНЯТО | Нет online leaderboard — нет проблемы. При добавлении нужен server-side verification |
| MVP: только local best score | ✅ ТАК И ЕСТЬ | Соответствует рекомендации |

### Performance (Раздел 10)

| Замечание | Статус | Комментарий |
|---|---|---|
| 3D-сцена тяжёлая для слабых Android | ✅ РЕШЕНО | Убрали expo-gl + three.js. CSS/Framer Motion рендеринг легче. |
| FPS >= 45 на слабых устройствах | ❓ НЕ ПРОВЕРЕНО | Нужно профилировать на реальных устройствах после APK сборки |
| Dispose при unmount | ✅ НЕ АКТУАЛЬНО | Нет Three.js — нет проблемы dispose. Но нужно чистить rAF timers (исправлено) |
| No crash за 15 минут | ❓ НЕ ПРОВЕРЕНО | Нужны тесты на реальном устройстве |

---

## Что уже сделано и не требует действий

1. ✅ Mojibake — полностью исправлен миграцией на Vite + i18n
2. ✅ Timers cleanup — clearFeedbackTimers() + useRef + cleanup
3. ✅ Accessibility — aria-labels, focus trap, reduced motion, screen reader
4. ✅ Error Boundary — React error boundary с i18n
5. ✅ Theme system — централизованные темы (classic/neon/retro)
6. ✅ Security: local-only leaderboard — соответствует рекомендации
7. ✅ No 3D scene performance issues — убран three.js
8. ✅ Sound system — Web Audio API с pack'ами
9. ✅ PWA support — manifest, service worker, install prompt

---

## Приоритетный план доработок (адаптированный под Vite)

### Sprint 1: Критические исправления

| Приоритет | Задача | Файлы |
|---:|---|---|
| P0 | Подтвердить clean quality gates | `bun install --frozen-lockfile`, `bun run build`, `bun run lint`, `bun run test` |
| P0 | Восстановить GitHub auth/remote workflow | git checkout + GitHub Actions run |

### Sprint 2: Качество и тесты

| Приоритет | Задача | Файлы |
|---:|---|---|
| P1 | Добавить browser smoke/e2e tests | Playwright/Vitest browser |
| P1 | Покрыть PWA/offline smoke | service worker + manifest checks |
| P1 | Покрыть a11y/focus smoke | keyboard/focus flows |

### Sprint 3: Архитектура

| Приоритет | Задача | Файлы |
|---:|---|---|
| P1 | Вынести side effects из Zustand store | `src/store/gameStore.ts`, `src/core/game/*` |
| P1 | Продолжить декомпозицию DoorRunnerScene.tsx | `src/components/game/` |
| P2 | Документация архитектуры | `docs/architecture.md` |
| P2 | Capacitor APK build документация | `docs/build-apk.md` |

### Sprint 4: Device testing

| Приоритет | Задача |
|---:|---|
| P1 | Собрать APK через Capacitor |
| P1 | Протестировать на физическом Android |
| P1 | Измерить FPS, startup time, memory |
| P1 | 15-минутный stress test без crash |

---

## Запрещённые действия (согласовано с безопасником)

- ❌ Полный rewrite на Kotlin/Flutter/Unity/Godot без profiling
- ❌ Переписывать DoorRunnerScene.tsx целиком одним коммитом
- ❌ Менять правила игры без тестов
- ❌ `npm audit fix --force`
- ❌ Массовые обновления major versions без причины
- ❌ Добавлять online leaderboard без server-side verification
- ❌ Хранить секреты в коде/README/.env в git
- ❌ Добавлять рекламу/IAP без отдельного ТЗ
