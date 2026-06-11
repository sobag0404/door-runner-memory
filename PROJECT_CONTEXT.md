# Door Runner Memory — Project Context

## Общее
- **Тип:** Мобильная игра-аркада на память (Subway Surfers × Simon Says)
- **Стек:** React 19 + Vite 8 + TypeScript + Tailwind CSS 4 + Zustand + Framer Motion
- **Запуск:** `bun run dev` (порт 3000)
- **Репозиторий:** https://github.com/sobag0404/door-runner-memory
- **Деплой:** Netlify (auto-deploy from GitHub)
- **Билд:** `bun run build` → dist/ (365 KB, gzipped: 114 KB)

## Фичи
### Основные
- **Режимы игры:** Regular (бесконечный) + Daily Challenge (одна последовательность на день)
- **Дорожки:** 3/4/5/6 lanes
- **Скорость:** Slow (2.5s), Normal (1.8s), Fast (1.2s) — с прогрессивным ускорением
- **Прогрессивная скорость:** каждые 5 правильных ответов скорость ↑3%, мин 40% от базы
- **Таймер:** rAF-based countdown-бар, таймаут = ошибка
- **Жизни:** Бесконечные, ошибка = сброс последовательности
- **Combo:** NICE → GREAT → SUPER → INSANE (в store state)

### Спринт 3
- **19 достижений** — счёт, комбо, всего ответов, игры, скорость, lanes, daily
- **Daily Challenge** — одна последовательность на день (UTC), обратный отсчёт
- **Leaderboard** — локальный, top 50, фильтр по режиму (all/regular/daily)
- **Name Modal** — ввод имени при выходе с результатом
- **Stats** — полная статистика игрока в localStorage

### Спринт 4 (текущий)
- **PWA** — manifest, service worker, offline, install prompt, Apple meta tags
- **Звуковые эффекты** — 7 синтезированных звуков через Web Audio API + toggle
- **Swipe-жесты** — горизонтальный свайп для выбора дорожки
- **Клавиатура** — клавиши 1-6 для выбора lane
- **Haptic feedback** — вибрация на мобильных (light/heavy)
- **Прогрессивная скорость** — скорость растёт по ходу игры (3% / 5 шагов)
- **Speed Indicator** — визуальный индикатор ускорения (⚡/💨)
- **Achievement Toast** — всплывающее уведомление при разблокировке
- **rAF Timer** — плавный таймер на requestAnimationFrame вместо setInterval

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
│   └── LeaderboardScreen.tsx # Таблица лидеров
├── lib/
│   ├── localStore.ts        # localStorage абстракция
│   ├── season.ts            # Сезонная система
│   ├── achievements.ts      # Определение достижений + PlayerStats
│   ├── daily.ts             # Daily challenge утилиты
│   ├── constants.ts         # LANE_COLORS, LANE_LIGHT, hapticFeedback
│   ├── sounds.ts            # Web Audio API звуковые эффекты
│   └── usePWAInstall.ts     # Hook для PWA install prompt
└── store/
    └── gameStore.ts         # Zustand: всё состояние + actions + progressive speed

public/
├── manifest.json            # PWA manifest
├── sw.js                    # Service worker (network-first + cache fallback)
├── icon-192.png             # PWA icon
└── icon-512.png             # PWA icon
```

## Деплой
Netlify auto-deploy: push в GitHub → Netlify билдит → деплой за ~30сек

## Что ещё можно добавить
1. Онлайн-рейтинг (Supabase/Firebase)
2. Магазин скинов
3. Мультиплеер
4. DoorRunnerScene рефакторинг (830+ строк → разбить на модули)
5. Анимация перехода между экранами (page transitions)
6. Dark/light тема
