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
- **Скорость:** Slow (2.5s), Normal (1.8s), Fast (1.2s)
- **Таймер:** Countdown-бар, таймаут = ошибка
- **Жизни:** Бесконечные, ошибка = сброс последовательности
- **Combo:** NICE → GREAT → SUPER → INSANE
- **Сезонная система:** YYYY-WW, детерминистические последовательности

### Новые (Спринт 3)
- **19 достижений** — счёт, комбо, всего ответов, игры, скорость, lanes, daily
- **Daily Challenge** — одна последовательность на день (UTC), обратный отсчёт
- **Leaderboard** — локальный, top 50, фильтр по режиму (all/regular/daily)
- **Name Modal** — ввод имени при выходе с результатом
- **Stats** — полная статистика игрока в localStorage

## Файловая структура
```
src/
├── main.tsx
├── index.css
├── components/
│   ├── AppContent.tsx       # Screen router (home | game | leaderboard)
│   ├── HomeScreen.tsx       # Настройки, режимы, achievements badge
│   ├── GameScreen.tsx       # Name modal + back button
│   ├── DoorRunnerScene.tsx  # Игровая сцена (VFX, HUD, timer)
│   ├── AchievementsPanel.tsx # Модальное окно достижений
│   └── LeaderboardScreen.tsx # Таблица лидеров
├── lib/
│   ├── localStore.ts        # localStorage абстракция
│   ├── season.ts            # Сезонная система
│   ├── achievements.ts      # Определение достижений + PlayerStats
│   └── daily.ts             # Daily challenge утилиты
└── store/
    └── gameStore.ts         # Zustand: всё состояние + actions
```

## Деплой
Netlify auto-deploy: push в GitHub → Netlify билдит → деплой за ~30сек

## Что ещё можно добавить
1. PWA (offline + install on home screen)
2. Звуковые эффекты (Web Audio API)
3. Swipe-жесты для мобильных
4. Ускорение по ходу игры
5. Онлайн-рейтинг (Supabase/Firebase)
6. Магазин скинов
7. Мультиплеер
