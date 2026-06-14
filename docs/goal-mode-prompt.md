# Goal Mode Prompt - Door Runner Memory Production Hardening
## Current Status Override (2026-06-14)

Use this section as the current source of truth when older bullets below conflict with it.

- PR #2 through PR #7 are merged into `main`.
- Current `main`: `b4832b03adcd12f6ef8a3f31d0bbca21335e7a48`.
- Post-merge `main` CI is green: https://github.com/sobag0404/door-runner-memory/actions/runs/27495057484
- CI runs on Ubuntu and Windows with dependency audit, build/type-check, lint, unit tests, e2e/smoke, and focused a11y smoke.
- Focused a11y smoke exists; a full accessibility audit is still incomplete.
- `gameEffects`, `feedbackTimers`, and `gamePersistence` are extracted from `gameStore`.
- `gameStore` still orchestrates game actions, stats calculations, achievement unlock checks, and leaderboard entry construction.
- Android APK/device smoke/performance and Netlify production deploy remain unverified.
- Netlify no-login verification found no GitHub Netlify deployment/status and no credible public production URL.
- Leaderboard remains local-only. There is no online leaderboard/backend/server verification.
- Visual direction is queued as an original mobile-runner polish lane: colorful runner energy roughly inspired by Subway Surfers, without copying characters, logos, exact UI, proprietary assets, or recognizable level art.
- Do not claim gameplay rules, scoring, daily sequence, or persisted localStorage schema/key changes from PR #2 through PR #7.

Дата: 2026-06-13  
Источник: `AI_DEVELOPER_REVIEW.md`, `worklog.md`, прошлый Codex-диалог `тестировщик runner`, текущая локальная проверка.

## Краткая задача

Продолжить разработку Door Runner Memory как senior engineer. Цель ближайшего Goal run: привести проект к честному, воспроизводимому состоянию разработки перед дальнейшими фичами, VPS/APK и публичным деплоем. Работай маленькими проверяемыми шагами, фиксируй факты ссылками на файлы/строки, не меняй правила игры без тестов.

## Текущий контекст

Проект: мобильная PWA-игра на память "Subway Surfers x Simon Says".  
Стек: Vite 8, React 19, TypeScript, Tailwind CSS 4, Zustand, Framer Motion, Capacitor, PWA.

Важные файлы:

- `PROJECT_CONTEXT.md` - GDD/текущий контекст, частично устарел.
- `AI_DEVELOPER_REVIEW.md` - итоговое ревью из другого диалога.
- `worklog.md` - история реальных задач и пушей.
- `docs/gap-analysis.md` - сопоставление security review со Vite-проектом, частично устарело.
- `src/components/DoorRunnerScene.tsx` - основная игровая сцена, всё ещё крупная.
- `src/store/gameStore.ts` - Zustand store, содержит side effects.
- `src/lib/i18n.ts` - локализация и `detectLang()`.
- `.github/workflows/ci.yml` - CI уже есть.

Локально уже подтверждено:

- Git 2.54.0, Bun 1.3.14, GitHub CLI 2.94.0 установлены.
- `bun install --frozen-lockfile` проходит.
- `bun run build` проходит, bundle: `dist/assets/index-*.js` около 439 KB, gzip около 133 KB.
- `bun run lint` проходит.
- `bun run test` проходит: 112 tests.
- Переданный ранее GitHub PAT недействителен (`Bad credentials`), не использовать его и не записывать секреты в файлы.

## Главные выводы ревью

Сильные стороны:

- Есть рабочий PWA/Vite-прототип с RU/EN, темами, звуками, достижениями, локальным leaderboard, daily mode.
- Исторические P0 в коде в основном закрыты: sequence overflow исправлен через `getExpectedPath()`, localStorage валидируется, leaderboard честно локальный.
- Есть pure reducer в `src/core/game`, unit tests, CI config, Netlify headers, PWA manifest/service worker.

Оставшиеся риски:

- Browser e2e/PWA/offline/a11y/device checks ещё не добавлены.
- `DoorRunnerScene.tsx` всё ещё >1000 строк, хотя render-phase `setState` вокруг coin feedback уже убран.
- `gameStore.ts` всё ещё содержит много side effects.
- APK/Capacitor pipeline не подтверждён, папки `android/` нет.

## Обязательные ограничения

- Не хранить токены, PAT, `.env` или секреты в репозитории, README, docs или shell history специально.
- Не делать `npm audit fix --force`.
- Не обновлять major dependencies массово без причины.
- Не добавлять online leaderboard без server-side verification.
- Не менять scoring, daily challenge, sequence generation и persisted localStorage schema без тестов и явного решения.
- Не переписывать `DoorRunnerScene.tsx` целиком одним большим PR.
- Не делать force push поверх неизвестного remote state.

## Рекомендуемый порядок работы дальше

1. Восстановить GitHub auth/remote workflow полностью: `gh auth login`, PR creation, GitHub Actions run.
2. Добавить browser smoke/e2e для home -> game -> lane input.
3. Добавить PWA/offline smoke и a11y/focus checks.
4. Продолжить декомпозицию `DoorRunnerScene.tsx` малыми PR.
5. Вынести side effects из Zustand store.
6. Документировать APK build через Capacitor после генерации `android/` и device smoke.

## Verification baseline

Обязательные команды:

```bash
bun install --frozen-lockfile
bun run build
bun run lint
bun run test
```

Желательно:

- Browser smoke:
  - home renders;
  - start regular game;
  - lane click/keyboard works;
  - settings persist after reload.
- PWA smoke:
  - manifest available;
  - service worker registration does not break first load;
  - offline fallback checked after first load.

## Формат ответа в Goal Mode

В итоговом ответе обязательно:

- Коротко перечислить сделанные изменения.
- Дать ссылки на изменённые файлы с line references.
- Дать команды verification и результат.
- Отдельно назвать blockers, если GitHub auth, PR или remote недоступны.
- Не повторять и не раскрывать токены.
