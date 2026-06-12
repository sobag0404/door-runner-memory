# Door Runner Memory — рекомендации, критика и алгоритм доработки для AI-разработчика

**Проект:** `door-runner-memory`  
**Цель:** довести текущий Expo / React Native / TypeScript прототип до состояния стабильного Android APK MVP.  
**Формат документа:** техническое ТЗ для AI-разработчика / Codex / Claude / другого coding agent.  
**Главное правило:** не делать полный rewrite. Работать малыми PR/патчами, после каждого шага запускать проверки.

---

## 0. Исполнительная сводка

Текущий проект — рабочий прототип мобильной игры Door Runner Memory. В нём уже есть базовый gameplay flow: главный экран, игровой экран, экран результата, локальное хранение настроек и рекорда, недельная детерминированная последовательность дверей, базовая 3D-сцена на `expo-gl` + `three`.

Но проект пока **не production-ready**. Главные проблемы:

1. В `src/screens/GameScreen.tsx` сломана кодировка русских текстов.
2. Нет `README.md`, нет нормальной инструкции запуска и сборки APK.
3. Нет `eas.json`, хотя итоговым артефактом должен быть APK.
4. `src/components/DoorRunnerScene.tsx` — монолит примерно на 2100 строк.
5. Game logic смешана с React hook, timers и haptics.
6. Нет нормального набора unit/integration/UI tests.
7. Локальное состояние из AsyncStorage почти не валидируется.
8. После `SEQUENCE_LENGTH = 600` возможен некорректный fallback к двери `0`.
9. Нет CI, lint, format, архитектурной документации.
10. Нет подтверждённого performance budget для Android APK.

**Решение:** остаться на Expo / React Native / TypeScript на ближайший этап, но изменить внутреннюю архитектуру проекта. Переход на Kotlin / Unity / Godot рассматривать только после профилирования APK на целевых Android-устройствах.

---

## 1. Жёсткая техническая критика

### 1.1 Что сделано нормально

- Есть понятная игровая идея: игрок запоминает недельную последовательность дверей и пытается пройти как можно дальше за 3 жизни.
- Есть разделение на `screens`, `game`, `storage`, `components`.
- TypeScript strict включён через `tsconfig.json`.
- Есть детерминированная weekly sequence logic в `src/game/seasonSequence.ts`.
- Есть базовая проверка логики через `scripts/verify-game-logic.ts`.
- Секреты, токены, private keys в коде не обнаружены.
- Есть `package-lock.json`, зависимости зафиксированы.
- `app.json` уже содержит Android package: `com.sobag.doorrunner`.

### 1.2 Что выглядит непрофессионально

#### P0 — `GameScreen.tsx` содержит mojibake

В файле есть строки вида:

```tsx
<Text style={styles.hudLabel}>РЎС‡РµС‚</Text>
<Text style={styles.hudLabel}>Р›СѓС‡С€РёР№</Text>
<Text style={styles.hudLabel}>Р–РёР·РЅРё</Text>
<Text style={styles.hearts}>{'в™Ґ'.repeat(state.lives)}</Text>
```

Это должно быть нормальным UTF-8:

```tsx
<Text style={styles.hudLabel}>Счёт</Text>
<Text style={styles.hudLabel}>Лучший</Text>
<Text style={styles.hudLabel}>Жизни</Text>
<Text style={styles.hearts}>{'♥'.repeat(state.lives)}</Text>
```

**Почему это критично:** основной экран игры выглядит сломанным. Такой билд нельзя показывать клиенту, инвестору, работодателю или выкладывать как APK demo.

---

#### P0 — отсутствует APK build pipeline

В проекте есть `app.json`, но нет `eas.json`. Для APK нужно явно описать EAS build profile с `android.buildType: "apk"`.

**Почему это критично:** пользовательская цель — получить APK. Сейчас проект не имеет зафиксированного процесса сборки целевого артефакта.

---

#### P1 — `DoorRunnerScene.tsx` слишком большой

Файл `src/components/DoorRunnerScene.tsx` содержит около 2100 строк. Внутри смешаны:

- React lifecycle;
- `GLView` и renderer setup;
- создание сцены;
- материалы;
- геометрия;
- runner rig;
- doors rig;
- road rig;
- animation loop;
- dispose logic;
- visual feedback;
- path layout;
- camera/light logic.

**Почему это опасно:** AI-разработчик легко сломает визуальную сцену при локальной правке. Любое изменение будет иметь большой regression risk.

---

#### P1 — game logic находится не в чистом core-слое

`src/game/useGameController.ts` сейчас содержит сразу:

- состояние игры;
- переходы phase;
- haptics;
- timers;
- выбор двери;
- вызов `onFinish`;
- вычисление current/correct/highlighted path.

**Почему это опасно:** такую логику трудно тестировать. При расширении игры появятся race conditions, stale state, проблемы с unmount и таймерами.

---

#### P1 — timers не контролируются безопасно

В `choosePath()` используются `setTimeout`, но timeout IDs не сохраняются и не очищаются при unmount. Есть риск:

- `setState` после unmount;
- двойного feedback transition;
- некорректного `onFinish` после выхода в меню;
- гонок между pause/exit/feedback/gameOver.

---

#### P1 — sequence fallback ломает честность игры

В `useGameController.ts`:

```ts
const correctPath = sequence[state.currentIndex] ?? 0;
const expected = sequence[state.currentIndex] ?? 0;
```

При выходе за `SEQUENCE_LENGTH = 600` правильной дверью станет `0`. Это скрытая логическая ошибка.

**Правильно:** либо sequence должна быть бесконечной/расширяемой, либо игра должна явно завершаться при достижении лимита, либо `getPathAt(index)` должен детерминированно вычислять дверь для любого index.

---

#### P1 — local best score нельзя использовать для честного leaderboard

Сейчас score хранится через AsyncStorage. Это нормально для offline-рекорда, но непригодно для online leaderboard.

**Почему:** пользователь может изменить local storage / APK / JS bundle. Серверу нельзя доверять client-side score.

---

#### P2 — нет README и документации архитектуры

Есть AI handoff-файлы (`AI_HANDOFF.md`, `CLAUDE.md`, `AGENTS.md`), но они не заменяют нормальный README.

README должен отвечать:

- что это за проект;
- как поставить зависимости;
- как запустить;
- как запустить тесты;
- как собрать APK;
- где находится core logic;
- какие есть known issues;
- какие версии Node/Expo/EAS нужны.

---

## 2. Решение по архитектуре и языку

### 2.1 Не переходить на другой язык сейчас

**Текущее решение:** оставить Expo / React Native / TypeScript.

Причины:

1. Игра уже написана на Expo / RN.
2. MVP небольшой.
3. Для APK Expo подходит.
4. Основные проблемы сейчас не в языке, а в архитектуре, тестах, сборке и качестве кода.
5. Rewrite на Kotlin/Unity/Godot съест время и создаст новые баги.

### 2.2 Когда переходить на Kotlin

Kotlin имеет смысл, если:

- нужен Android-only продукт;
- нужна максимальная нативная производительность;
- 3D будет заменён на 2D/нативный UI;
- нужна глубокая интеграция с Android APIs;
- команда уверенно работает с Kotlin/Jetpack Compose.

Но Kotlin не решит автоматически проблемы game logic, тестов и продукта. При плохой архитектуре Kotlin-проект будет таким же проблемным.

### 2.3 Когда переходить на Unity или Godot

Unity/Godot имеет смысл, если:

- 3D-геймплей станет центральной частью продукта;
- нужны анимации, эффекты, ассеты, физика, сложные сцены;
- требуется стабильный игровой render loop;
- планируется развитие именно как игры, а не как лёгкого mobile app.

Для текущего memory runner MVP это пока преждевременно.

### 2.4 Контрольная точка для решения о миграции

Сначала собрать APK и измерить:

- FPS на слабом Android;
- memory usage;
- startup time;
- input latency;
- нагрев/разряд;
- стабильность после 10–15 минут игры;
- crash rate.

**Решение о миграции принимать только после измерений.**

---

## 3. Целевая архитектура проекта

### 3.1 Цель

Разделить проект на чистую игровую логику, UI, rendering, storage и shared utilities. Минимизировать зависимость core-логики от React Native, Expo и Three.js.

### 3.2 Рекомендуемая структура

```text
src/
  app/
    AppRoot.tsx
    navigation.ts
    bootstrap.ts

  core/
    game/
      gameTypes.ts
      gameConfig.ts
      gameConstants.ts
      gameReducer.ts
      gameSelectors.ts
      gameActions.ts
      seasonSequence.ts
      seasonClock.ts
      scoring.ts
      __tests__/
        gameReducer.test.ts
        seasonSequence.test.ts
        scoring.test.ts

  features/
    home/
      HomeScreen.tsx
      HomeSettingsPanel.tsx
    game/
      GameScreen.tsx
      GameHud.tsx
      GameControls.tsx
      GameTutorialModal.tsx
      useGameController.ts
    gameOver/
      GameOverScreen.tsx

  rendering/
    three/
      DoorRunnerScene.tsx
      createScene.ts
      createCamera.ts
      createLights.ts
      createRenderer.ts
      createDoorRig.ts
      createRunnerRig.ts
      createRoadRig.ts
      materials.ts
      geometry.ts
      animationLoop.ts
      disposeThreeObject.ts
      sceneConstants.ts
      types.ts

  data/
    local/
      localStore.ts
      settingsRepository.ts
      scoreRepository.ts
      storageKeys.ts
      validators.ts

  shared/
    ui/
      theme.ts
      spacing.ts
      typography.ts
    utils/
      exhaustiveCheck.ts
      clamp.ts
      delay.ts
```

### 3.3 Архитектурные правила

1. `src/core/game/*` не должен импортировать React, React Native, Expo, Three.js, AsyncStorage.
2. `src/rendering/three/*` не должен менять game state напрямую.
3. `src/features/game/*` соединяет UI, controller и rendering.
4. `src/data/local/*` отвечает только за storage и validation.
5. `App.tsx` не должен превращаться в бизнес-центр. Он должен только загружать app state и переключать экраны.
6. Все constants должны быть вынесены из UI/rendering-монолитов.
7. Все game transitions должны быть покрыты unit tests.

---

## 4. Правильный алгоритм игры

### 4.1 Термины

- `seasonId` — идентификатор недели, например `2026-W24`.
- `pathCount` — количество дверей/дорожек: `3 | 4 | 5 | 6`.
- `currentIndex` — текущий шаг в последовательности.
- `runBest` — лучший результат текущего забега.
- `lives` — оставшиеся жизни.
- `phase` — состояние игры: `ready | running | paused | feedback | gameOver`.
- `selectedPath` — последняя выбранная игроком дверь.
- `feedback` — `correct | wrong | null`.

### 4.2 Правильная state machine

```text
ready
  start -> running

running
  choose correct path -> feedback(correct)
  choose wrong path with lives > 1 -> feedback(wrong)
  choose wrong path with lives = 1 -> gameOver after feedback delay
  pause -> paused

paused
  resume -> running
  exit -> home

feedback(correct)
  after FEEDBACK_MS -> running with currentIndex + 1

feedback(wrong)
  after FEEDBACK_MS -> running with currentIndex = 0 and lives - 1

feedback(wrong, no lives)
  after FEEDBACK_MS -> gameOver + finish(result)

gameOver
  restart -> running with initial state
  home -> home
```

### 4.3 Важное правило переходов

Reducer должен быть чистым. Он не должен:

- вызывать haptics;
- вызывать `setTimeout`;
- читать AsyncStorage;
- вызывать `onFinish`;
- обращаться к Date напрямую;
- импортировать React.

Побочные эффекты должны жить в hook/controller layer.

### 4.4 Рекомендуемый reducer API

```ts
export type GameAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'CHOOSE_PATH'; pathIndex: number; expectedPath: number }
  | { type: 'COMPLETE_FEEDBACK' }
  | { type: 'RESTART' };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      if (state.phase !== 'ready') return state;
      return { ...state, phase: 'running' };

    case 'PAUSE':
      if (state.phase !== 'running') return state;
      return { ...state, phase: 'paused' };

    case 'RESUME':
      if (state.phase !== 'paused') return state;
      return { ...state, phase: 'running' };

    case 'CHOOSE_PATH': {
      if (state.phase !== 'running') return state;
      const isCorrect = action.pathIndex === action.expectedPath;

      if (isCorrect) {
        const nextIndex = state.currentIndex + 1;
        return {
          ...state,
          currentIndex: nextIndex,
          runBest: Math.max(state.runBest, nextIndex),
          selectedPath: action.pathIndex,
          feedback: 'correct',
          phase: 'feedback',
        };
      }

      const nextLives = state.lives - 1;
      return {
        ...state,
        currentIndex: 0,
        lives: nextLives,
        selectedPath: action.pathIndex,
        feedback: 'wrong',
        phase: nextLives <= 0 ? 'gameOver' : 'feedback',
      };
    }

    case 'COMPLETE_FEEDBACK':
      if (state.phase !== 'feedback') return state;
      return {
        ...state,
        selectedPath: null,
        feedback: null,
        phase: 'running',
      };

    case 'RESTART':
      return createInitialGameState('running');

    default:
      return exhaustiveCheck(action);
  }
}
```

### 4.5 Важное замечание по gameOver

Лучше не переводить reducer сразу в `gameOver` до завершения visual feedback. Корректнее иметь отдельный флаг/phase:

```ts
phase: 'feedback'
pendingFinish: true
```

Потом controller после `FEEDBACK_MS` вызывает `onFinish(result)` и переводит экран в GameOver.

Альтернатива: оставить `phase: 'gameOver'`, но визуальный компонент должен ещё показать feedback. Главное — поведение должно быть явно протестировано.

### 4.6 Правильный алгоритм sequence

Текущая ошибка: `sequence[index] ?? 0`.

Правильно сделать функцию:

```ts
export function getSeasonPathAt(params: {
  seasonId: string;
  pathCount: PathCount;
  index: number;
}): number {
  if (!Number.isInteger(params.index) || params.index < 0) {
    throw new Error(`Invalid sequence index: ${params.index}`);
  }

  // Детерминированно вычислить path для любого index.
  // Вариант 1: генерировать блоками.
  // Вариант 2: seed = hash(seed + seasonId + pathCount + index), затем PRNG.
  // Вариант 3: расширять sequence при достижении конца.
}
```

Рекомендуемый вариант для MVP: **генерировать sequence блоками**, но запретить fallback к `0`.

```ts
export function getExpectedPath(sequence: number[], index: number): number {
  const value = sequence[index];
  if (value === undefined) {
    throw new Error(`Sequence exhausted at index ${index}`);
  }
  return value;
}
```

Затем явно решить продуктово:

- либо max score = 600;
- либо infinite mode;
- либо next chunk generation.

Для честного MVP лучше сделать **infinite deterministic generator**.

---

## 5. Алгоритм работы AI-разработчика

### 5.1 Общий принцип

AI-разработчик должен работать не как “переписчик всего проекта”, а как инженер, который делает маленькие безопасные изменения.

**Один шаг = один атомарный patch.**  
**После каждого patch = проверки.**  
**Нельзя менять gameplay rules без явного указания.**

### 5.2 Preflight перед любыми изменениями

Выполнить:

```bash
npm ci
npm run check
npm run test
```

Если `npm ci` не проходит:

1. Не менять код игры.
2. Зафиксировать ошибку установки.
3. Проверить версию Node.
4. Проверить lockfile.
5. Не запускать `npm audit fix --force`.

### 5.3 Минимальный порядок патчей

```text
Patch 1: исправить кодировку GameScreen.tsx
Patch 2: добавить README.md
Patch 3: добавить eas.json и npm scripts для APK
Patch 4: добавить lint/format config
Patch 5: добавить tests infrastructure
Patch 6: вынести pure game reducer
Patch 7: покрыть reducer tests
Patch 8: исправить timers cleanup
Patch 9: исправить sequence overflow
Patch 10: добавить validation AsyncStorage
Patch 11: разбить DoorRunnerScene.tsx на безопасные модули
Patch 12: профилировать Android APK
```

### 5.4 Запрещённые действия

AI-разработчику запрещено:

- делать полный rewrite на Kotlin/Flutter/Unity/Godot без отдельного решения;
- переписывать `DoorRunnerScene.tsx` целиком одним коммитом;
- менять правила игры без тестов;
- удалять 3D-сцену без согласования;
- выполнять `npm audit fix --force`;
- массово обновлять Expo/React Native/React/TypeScript major versions;
- менять `android.package` без причины;
- добавлять backend/online leaderboard без security-дизайна;
- добавлять рекламу/IAP без отдельного ТЗ;
- добавлять новые тяжёлые зависимости без обоснования;
- хранить секреты в коде, `app.json`, README или `.env`, попадающем в git.

---

## 6. Приоритетный backlog

### P0 — исправить до любого показа APK

| ID | Задача | Файл/область | Критерий готовности |
|---:|---|---|---|
| P0-1 | Исправить mojibake в UI | `src/screens/GameScreen.tsx` | Нет строк `РЎ`, `Рџ`, `Р–`, `в™`, `в–`, `в…`; UI показывает нормальный русский текст. |
| P0-2 | Добавить APK build profile | `eas.json`, `package.json` | Есть `preview-apk` profile, есть script для EAS APK. |
| P0-3 | Добавить README | `README.md` | Новый разработчик может запустить проект, тесты и APK build. |
| P0-4 | Проверить чистую установку | root project | `npm ci && npm run test` проходит. |

### P1 — исправить до стабильного MVP

| ID | Задача | Файл/область | Критерий готовности |
|---:|---|---|---|
| P1-1 | Вынести pure reducer | `src/core/game` | Game transitions тестируются без React. |
| P1-2 | Добавить тесты reducer | `src/core/game/__tests__` | Покрыты correct/wrong/lives/gameOver/pause/restart. |
| P1-3 | Исправить timers cleanup | `useGameController.ts` | Нет state updates after unmount. |
| P1-4 | Исправить sequence overflow | `seasonSequence.ts`, controller | Нет fallback к `0`; поведение после 600 шагов определено. |
| P1-5 | Добавить validation storage | `localStore.ts` / `validators.ts` | Повреждённые settings не ломают игру. |
| P1-6 | Добавить CI | `.github/workflows/ci.yml` | На PR запускаются install/check/test. |
| P1-7 | Начать декомпозицию 3D | `src/rendering/three` | `DoorRunnerScene.tsx` заметно меньше, визуал не сломан. |

### P2 — улучшить качество

| ID | Задача | Файл/область | Критерий готовности |
|---:|---|---|---|
| P2-1 | Добавить theme tokens | `src/shared/ui/theme.ts` | Цвета/spacing не размазаны по экранам. |
| P2-2 | Добавить UI components | `GameHud`, `GameControls`, `GameTutorialModal` | `GameScreen.tsx` стал компактнее. |
| P2-3 | Добавить accessibility labels | UI screens | Основные кнопки имеют понятные labels. |
| P2-4 | Добавить error boundary | app layer | Ошибки не приводят к пустому экрану. |
| P2-5 | Документировать архитектуру | `docs/architecture.md` | Понятны слои и правила зависимостей. |

---

## 7. Конкретные инструкции по каждому патчу

### Patch 1 — исправить кодировку GameScreen

#### Проблема

В `GameScreen.tsx` текст повреждён из-за неправильной кодировки.

#### Что сделать

Заменить все mojibake-строки на нормальный UTF-8.

Ориентировочные замены:

| Было | Должно быть |
|---|---|
| `РЎС‡РµС‚` | `Счёт` |
| `Р›СѓС‡С€РёР№` | `Лучший` |
| `Р–РёР·РЅРё` | `Жизни` |
| `РџР°СѓР·Р°` | `Пауза` |
| `РџСЂРѕРґРѕР»Р¶РёС‚СЊ` | `Продолжить` |
| `Р’ РјРµРЅСЋ` | `В меню` |
| `Р’С‹Р±РµСЂРё РґРІРµСЂСЊ` | `Выбери дверь` |
| `Р’РµСЂРЅРѕ` | `Верно` |
| `РЎРЅР°С‡Р°Р»Р°` | `Сначала` |
| `Р—Р°РїРѕРјРЅРё РјР°СЂС€СЂСѓС‚` | `Запомни маршрут` |
| `РџРѕРЅСЏС‚РЅРѕ` | `Понятно` |
| `в™Ґ` | `♥` |
| `в–¶` | `▶` |
| `в…Ў` | `Ⅱ` или лучше обычный текст `Пауза` |

#### Проверка

```bash
grep -R "РЎ\|Рџ\|Р–\|в™\|в–\|в…" src/screens/GameScreen.tsx
npm run check
npm run test
```

`grep` не должен ничего находить.

---

### Patch 2 — добавить README

Создать `README.md` в корне.

Минимальная структура:

```md
# Door Runner Memory

## What it is
Short game description.

## Tech stack
- Expo
- React Native
- TypeScript
- expo-gl
- three
- AsyncStorage

## Requirements
- Node.js LTS
- npm
- Expo/EAS CLI for APK builds

## Install
npm ci

## Run
npm run start
npm run android
npm run web

## Checks
npm run check
npm run test

## Android APK build
npm run build:android:apk

## Architecture
Short description of screens/game/storage/rendering.

## Known issues
- 3D scene needs refactoring
- Android performance must be profiled
- Local score is not secure for online leaderboard
```

#### Критерий готовности

Новый разработчик по README должен понять, как запустить проект и собрать APK.

---

### Patch 3 — добавить APK build pipeline

Создать `eas.json`:

```json
{
  "cli": {
    "version": ">= 15.0.0",
    "appVersionSource": "local"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview-apk": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

Добавить scripts в `package.json`:

```json
{
  "scripts": {
    "build:android:apk": "eas build -p android --profile preview-apk",
    "build:android:aab": "eas build -p android --profile production"
  }
}
```

**Важно:** `eas-cli` можно не добавлять в dependencies. Лучше использовать `npx eas-cli` в документации или global install по инструкции.

#### Проверка

```bash
npm run check
npm run test
npx eas-cli build:configure --non-interactive
```

EAS build может требовать login, поэтому в CI его не запускать без credentials.

---

### Patch 4 — добавить lint/format

Добавить:

- ESLint;
- Prettier;
- script `lint`;
- script `format:check`;
- script `quality`.

Пример scripts:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "quality": "npm run check && npm run lint && npm run test"
  }
}
```

**Важно:** не делать огромный formatting PR вместе с логическими изменениями. Сначала добавить config, потом отдельным коммитом форматировать.

---

### Patch 5 — добавить тестовую инфраструктуру

Сейчас есть `scripts/verify-game-logic.ts`. Это лучше, чем ничего, но недостаточно.

Рекомендуемый вариант: `vitest`.

Добавить:

```bash
npm install -D vitest
```

Scripts:

```json
{
  "scripts": {
    "test:unit": "vitest run",
    "test": "npm run check && npm run test:logic && npm run test:unit"
  }
}
```

Первые тесты:

```text
src/core/game/__tests__/seasonSequence.test.ts
src/core/game/__tests__/gameReducer.test.ts
src/data/local/__tests__/validators.test.ts
```

---

### Patch 6 — вынести game reducer

Создать:

```text
src/core/game/gameConstants.ts
src/core/game/gameTypes.ts
src/core/game/gameReducer.ts
src/core/game/gameSelectors.ts
src/core/game/createInitialGameState.ts
```

Перенести туда чистую логику из `useGameController.ts`.

`useGameController.ts` должен стать thin adapter:

- держит `useReducer`;
- вызывает haptics;
- ставит/чистит timer;
- вызывает `onFinish`;
- отдаёт state/actions в UI.

---

### Patch 7 — покрыть reducer тестами

Минимальные сценарии:

1. `START` переводит `ready -> running`.
2. `PAUSE` работает только из `running`.
3. `RESUME` работает только из `paused`.
4. Correct choice увеличивает `currentIndex`.
5. Correct choice обновляет `runBest`.
6. Wrong choice сбрасывает `currentIndex` в `0`.
7. Wrong choice уменьшает `lives`.
8. Wrong choice при последней жизни приводит к finish/gameOver state.
9. Click во время `feedback` игнорируется.
10. Click во время `paused` игнорируется.
11. `RESTART` возвращает initial state.

---

### Patch 8 — исправить timers cleanup

В hook использовать `useRef<number | null>` или массив refs для таймеров.

Паттерн:

```ts
const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const clearFeedbackTimer = useCallback(() => {
  if (feedbackTimerRef.current) {
    clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = null;
  }
}, []);

useEffect(() => {
  return () => {
    clearFeedbackTimer();
  };
}, [clearFeedbackTimer]);
```

Перед новым timeout всегда очищать старый.

---

### Patch 9 — исправить sequence overflow

Удалить fallback:

```ts
sequence[state.currentIndex] ?? 0
```

Заменить на безопасный selector:

```ts
const expectedPath = getExpectedPath(sequence, state.currentIndex);
```

Где:

```ts
export function getExpectedPath(sequence: readonly number[], index: number): number {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error(`Invalid sequence index: ${index}`);
  }

  const value = sequence[index];
  if (value === undefined) {
    throw new Error(`Sequence exhausted at index ${index}`);
  }

  return value;
}
```

Затем выбрать стратегию:

- MVP quick fix: max score = 600, game finishes at 600.
- Better fix: deterministic infinite generator.

Рекомендация: для MVP можно сначала сделать max score, но лучше сразу заложить infinite generator.

---

### Patch 10 — validation AsyncStorage

Проблема текущего кода:

```ts
return { ...defaults, ...JSON.parse(raw) };
```

Если в storage окажется:

```json
{ "pathCount": 999, "speed": "turbo", "hapticsEnabled": "yes" }
```

приложение получит некорректные settings.

Добавить validator:

```ts
const VALID_PATH_COUNTS = new Set([3, 4, 5, 6]);
const VALID_SPEEDS = new Set(['calm', 'normal', 'fast']);

export function normalizeSettings(input: unknown, defaults: PlayerSettings): PlayerSettings {
  if (!input || typeof input !== 'object') return defaults;

  const value = input as Partial<PlayerSettings>;

  return {
    pathCount: VALID_PATH_COUNTS.has(value.pathCount as never)
      ? (value.pathCount as PlayerSettings['pathCount'])
      : defaults.pathCount,
    speed: VALID_SPEEDS.has(value.speed as never)
      ? (value.speed as PlayerSettings['speed'])
      : defaults.speed,
    hapticsEnabled:
      typeof value.hapticsEnabled === 'boolean'
        ? value.hapticsEnabled
        : defaults.hapticsEnabled,
    tutorialSeen:
      typeof value.tutorialSeen === 'boolean'
        ? value.tutorialSeen
        : defaults.tutorialSeen,
  };
}
```

В `loadSettings()`:

```ts
const parsed = JSON.parse(raw);
return normalizeSettings(parsed, defaults);
```

---

### Patch 11 — декомпозиция DoorRunnerScene

Не переписывать весь файл сразу.

Безопасный порядок:

```text
11.1 Вынести constants без изменения поведения.
11.2 Вынести material factory functions.
11.3 Вынести geometry helpers.
11.4 Вынести dispose helpers.
11.5 Вынести createDoorRig.
11.6 Вынести createRunnerRig.
11.7 Вынести createRoadRig.
11.8 Вынести animation update functions.
11.9 Оставить DoorRunnerScene как orchestration layer.
```

После каждого шага:

```bash
npm run check
npm run test
npm run web
```

И вручную проверить визуал.

Целевое состояние:

```text
DoorRunnerScene.tsx <= 350 строк
createDoorRig.ts <= 300 строк
createRunnerRig.ts <= 400 строк
createRoadRig.ts <= 300 строк
animationLoop.ts <= 250 строк
materials.ts <= 200 строк
sceneConstants.ts <= 150 строк
```

---

## 8. Security review и anti-cheat

### 8.1 Текущий уровень риска

Для offline MVP риск низкий. Для online leaderboard риск высокий.

### 8.2 Что нельзя делать

Нельзя отправлять на сервер просто:

```json
{
  "playerId": "abc",
  "score": 450,
  "seasonId": "2026-W24",
  "pathCount": 4
}
```

и считать это честным результатом.

### 8.3 Почему

Игрок может:

- изменить AsyncStorage;
- модифицировать JS bundle;
- вызвать submit API вручную;
- подменить score;
- заранее вычислить weekly sequence;
- отключить проверки на клиенте.

### 8.4 MVP-safe решение

Для первой APK-версии оставить:

- только local best score;
- без online leaderboard;
- в UI не писать “global leaderboard”, если его нет;
- честно назвать “Рекорд сезона на этом устройстве”.

### 8.5 Если нужен online leaderboard

Нужен отдельный backend design:

- server session starts run;
- server знает season seed;
- client отправляет event stream;
- server проверяет timing/path validity;
- score подписывается сервером;
- rate limiting;
- device/user identity;
- suspicious run detection;
- replay protection.

Это не задача для простого AI-patch без ручной архитектурной проверки.

---

## 9. Тестовый план

### 9.1 Unit tests

Обязательно:

```text
seasonSequence.test.ts
- same season + pathCount => same sequence
- different season => different sequence
- different pathCount => values stay within range
- no 3+ same paths in a row if this rule remains required
- ISO week edge cases around year boundary

gameReducer.test.ts
- start
- pause/resume
- correct choice
- wrong choice
- last life
- ignored input during feedback
- restart

validators.test.ts
- valid settings pass
- invalid pathCount falls back
- invalid speed falls back
- invalid booleans fall back
- invalid JSON returns defaults
```

### 9.2 Integration tests

```text
useGameController integration
- correct path triggers haptics and feedback timer
- wrong path triggers warning and lives decrement
- unmount clears timer
- onFinish called once
```

### 9.3 UI tests / smoke tests

```text
HomeScreen
- shows season
- changes pathCount
- changes speed
- toggles haptics
- start button works

GameScreen
- shows score/lives/best
- shows tutorial if not seen
- chooses path
- pause/resume works

GameOverScreen
- shows result
- restart works
- home/settings works
```

### 9.4 Manual QA для APK

Проверить на физическом Android:

1. APK устанавливается.
2. Первый запуск не падает.
3. Home screen отображается корректно.
4. Русский текст отображается без mojibake.
5. Tutorial открывается и закрывается.
6. Игра начинается.
7. Кнопки дверей работают.
8. Correct feedback работает.
9. Wrong feedback работает.
10. Жизни уменьшаются.
11. Game Over появляется после 3 ошибок.
12. Best score сохраняется после перезапуска приложения.
13. Настройки сохраняются.
14. Pause/resume работают.
15. Exit to menu не вызывает странных delayed transitions.
16. 10 минут игры без crash.
17. Нет сильных FPS drops.
18. Нет заметной утечки памяти.
19. Back button Android ведёт себя ожидаемо.
20. Приложение не ломается после kill/reopen.

---

## 10. Производительность

### 10.1 Главный риск

3D-сцена на `expo-gl` + `three` может быть тяжёлой для слабых Android-устройств.

### 10.2 Что проверить

- FPS во время игры;
- allocation rate в animation loop;
- количество объектов в сцене;
- dispose при unmount;
- texture/material reuse;
- shader/material complexity;
- startup time;
- input latency.

### 10.3 Правила оптимизации

1. Не создавать новые `Vector3`, `Color`, `Matrix`, geometries/materials каждый frame без необходимости.
2. Переиспользовать временные объекты.
3. Не пересоздавать сцену при каждом мелком prop update.
4. Держать React state вне animation loop.
5. Dispose geometries/materials/textures на cleanup.
6. Ограничить количество meshes.
7. Сделать low quality mode для слабых устройств.

### 10.4 Performance acceptance для MVP

Минимум:

```text
Target low-end Android: >= 45 FPS most of the time
Target mid Android: >= 55 FPS most of the time
Startup to first interactive screen: <= 3 sec
No crash during 15 min session
No visible input delay > 150 ms
```

Если это не выполняется, сначала оптимизировать сцену. Только потом обсуждать миграцию на другой стек.

---

## 11. UX/UI рекомендации

### 11.1 Основные проблемы

- `GameScreen` перегружен overlay/control/hud/modal логикой.
- Есть очень маленькие размеры текста/кнопок в controls (`fontSize: 7`, `height: 22`) — это риск плохой доступности и промахов по кнопкам.
- Нет нормальных empty/error states.
- Pause button символами может быть непонятен.
- “Рекорд сезона” фактически локальный, это нужно честно назвать.

### 11.2 Что сделать

1. Вынести `GameHud`.
2. Вынести `GameControls`.
3. Вынести `GameTutorialModal`.
4. Увеличить touch targets до нормального мобильного размера.
5. Использовать понятные labels: “Пауза”, “Продолжить”, “В меню”.
6. Проверить UI на маленьком Android-экране.
7. Добавить accessibility labels на ключевые кнопки.
8. Изменить “Рекорд сезона” на “Рекорд на устройстве” до появления backend leaderboard.

---

## 12. Документация

### 12.1 README.md

Обязателен.

### 12.2 docs/architecture.md

Добавить после первого refactor.

Структура:

```md
# Architecture

## Layers
- app
- core/game
- features
- rendering
- data/local
- shared

## Data flow
Home settings -> GameConfig -> GameController -> GameScreen -> DoorRunnerScene

## Game state machine
...

## Storage
...

## APK build
...
```

### 12.3 docs/testing.md

Добавить после тестовой инфраструктуры.

---

## 13. CI/CD

Добавить `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main, master]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run test
```

Если добавлены lint/format:

```yaml
      - run: npm run lint
      - run: npm run format:check
```

Не запускать EAS build в обычном CI без отдельной настройки credentials.

---

## 14. Definition of Done

### 14.1 MVP APK готов к показу, если

- [ ] `npm ci` проходит на чистой машине.
- [ ] `npm run check` проходит.
- [ ] `npm run test` проходит.
- [ ] Русские тексты отображаются корректно.
- [ ] Есть `README.md`.
- [ ] Есть `eas.json`.
- [ ] APK собирается через EAS profile.
- [ ] Игра запускается на физическом Android.
- [ ] Best score сохраняется.
- [ ] Settings сохраняются.
- [ ] Нет obvious crashes за 10 минут игры.
- [ ] Game logic покрыта базовыми тестами.
- [ ] Sequence overflow исправлен.
- [ ] Timers cleanup исправлен.

### 14.2 MVP не готов, если

- [ ] В UI есть mojibake.
- [ ] Нет APK build profile.
- [ ] Нельзя поставить зависимости.
- [ ] Тесты не запускаются.
- [ ] Игра падает при старте.
- [ ] Pause/exit вызывает delayed gameOver.
- [ ] После 600 очков правильная дверь становится `0` по fallback.
- [ ] Score называется global/leaderboard, хотя он локальный.

---

## 15. Рекомендуемые промпты для AI-разработчика

### Prompt 1 — исправить кодировку

```text
Ты работаешь в проекте Expo/React Native/TypeScript Door Runner Memory.
Сделай только один патч: исправь mojibake в src/screens/GameScreen.tsx.
Не меняй архитектуру, стили, игровую логику и тексты в других файлах.
Замени повреждённые строки вида РЎС‡РµС‚, РџР°СѓР·Р°, в™Ґ на нормальные UTF-8 русские строки и символы.
После изменения запусти npm run check и npm run test.
В ответе дай список изменённых строк и результат проверок.
```

### Prompt 2 — добавить README и APK build profile

```text
Добавь README.md и eas.json для Expo проекта.
Цель: сборка Android APK для внутреннего тестирования.
В eas.json добавь profile preview-apk с android.buildType=apk и production profile для AAB.
В package.json добавь scripts build:android:apk и build:android:aab.
Не меняй исходный код приложения.
После изменения запусти npm run check и npm run test.
```

### Prompt 3 — вынести pure reducer

```text
Вынеси чистую игровую state machine из src/game/useGameController.ts в src/core/game/gameReducer.ts.
Reducer не должен импортировать React, React Native, Expo, Haptics, AsyncStorage или Three.js.
Сохрани текущее поведение игры.
useGameController должен остаться adapter layer: useReducer, haptics, timers, onFinish.
Добавь unit tests для reducer.
Не меняй визуальный UI и DoorRunnerScene.
```

### Prompt 4 — исправить timers cleanup

```text
Исправь lifecycle таймеров в useGameController.
Все setTimeout должны сохраняться в refs и очищаться при unmount.
Перед созданием нового feedback timer очищай предыдущий.
Гарантируй, что onFinish вызывается не больше одного раза за run.
Добавь тест или минимальную проверку, если тестовая инфраструктура уже есть.
Не меняй правила игры.
```

### Prompt 5 — декомпозиция DoorRunnerScene, первый безопасный шаг

```text
Начни декомпозицию src/components/DoorRunnerScene.tsx.
Сделай только первый безопасный шаг: вынеси constants и pure helper functions в src/rendering/three/sceneConstants.ts и src/rendering/three/helpers.ts.
Не меняй поведение, параметры, визуальные значения, материалы, геометрию и animation loop.
После изменения DoorRunnerScene должен рендерить визуально то же самое.
Запусти npm run check и npm run test.
```

---

## 16. Финальное решение по стеку

### Сейчас

Оставить:

```text
Expo + React Native + TypeScript + expo-gl + three
```

### Через 1–2 недели после стабилизации

Собрать APK, протестировать на устройствах, измерить FPS и crash rate.

### Переходить на Kotlin, если

```text
- продукт Android-only;
- 3D можно заменить нативным/2D UI;
- Expo/three не держит нужный FPS;
- нужна максимальная интеграция с Android;
- есть ресурс на rewrite.
```

### Переходить на Unity/Godot, если

```text
- игра становится полноценным 3D-продуктом;
- нужны ассеты, сцены, физика, анимации, particles;
- Expo/three становится bottleneck;
- команда готова поддерживать game engine pipeline.
```

### Не переходить, если

```text
- текущие проблемы можно решить refactor + tests + profiling;
- нужен быстрый APK MVP;
- нет доказанного performance bottleneck;
- нет команды/времени на rewrite.
```

---

## 17. Ссылки на официальные документы

- Expo: Build APKs for Android devices: https://docs.expo.dev/build-reference/apk/
- Expo: Configure EAS Build with `eas.json`: https://docs.expo.dev/build/eas-json/
- Android: App architecture recommendations: https://developer.android.com/topic/architecture/recommendations
- Android: Guide to app architecture: https://developer.android.com/topic/architecture
- Android: Kotlin overview: https://developer.android.com/kotlin/overview

---

## 18. Короткий приказ для AI-разработчика

Работай в таком порядке:

```text
1. Не переписывай проект полностью.
2. Исправь P0: кодировка, README, eas.json, clean checks.
3. Вынеси game logic в pure reducer.
4. Покрой reducer и sequence тестами.
5. Исправь timers cleanup.
6. Исправь sequence overflow.
7. Добавь validation для AsyncStorage.
8. Добавь CI/lint/format.
9. Только потом дроби DoorRunnerScene.
10. После APK-профилирования решай вопрос о Kotlin/Unity/Godot.
```

**Главный критерий:** после каждого изменения проект должен оставаться запускаемым, тестируемым и ближе к APK MVP. Если изменение не приближает к стабильному APK, его не делать.
