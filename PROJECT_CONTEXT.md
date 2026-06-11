# Door Runner Memory — Project Context

## Общее
- **Тип:** Мобильная игра-аркада на память (Subway Surfers × Simon Says)
- **Стек:** Next.js 16 + TypeScript + Tailwind CSS 4 + Zustand + Framer Motion
- **Запуск:** `bun run dev` (порт 3000)
- **Репозиторий:** https://github.com/sobag0404/door-runner-memory
- **Деплой:** Статический экспорт (`output: 'export'`) → любой хостинг статики

## Игровая логика
- **Экраны:** Home → Game (GameOverScreen удалён, жизни бесконечные)
- **Дорожки:** 3/4/5/6 lanes (выбор на Home)
- **Скорость:** Slow (2.5s), Normal (1.8s), Fast (1.2s) — влияет на таймер
- **Таймер:** Countdown-бар на каждый шаг. Таймаут = ошибка → сброс последовательности
- **Жизни:** Бесконечные. Ошибка → сброс последовательности, score сохраняется
- **Combo:** Серия правильных ответов — badge (NICE → GREAT → SUPER → INSANE)
- **Best score:** Автосохранение в localStorage при каждом правильном ответе + при выходе
- **Сезонная система:** `seasonId = YYYY-WW`, `createSeasonSequence` — детерминистические последовательности (mulberry32 PRNG)

## Файловая структура
```
src/
├── app/
│   ├── globals.css          # CSS keyframes (runnerBounce, dashScroll, sparkle, etc.)
│   ├── layout.tsx           # Root layout (viewport, metadata)
│   └── page.tsx             # Dynamic import AppContent (ssr: false)
├── components/
│   ├── AppContent.tsx       # Screen router (home | game)
│   ├── HomeScreen.tsx       # Настройки lanes/speed, Play, сезонный best
│   ├── GameScreen.tsx       # Кнопка «Назад» + DoorRunnerScene
│   └── DoorRunnerScene.tsx  # Вся игровая сцена: дорога, двери, бегун, VFX, HUD, таймер
├── lib/
│   ├── localStore.ts        # localStorage абстракция (префикс drm_)
│   └── season.ts            # getCurrentSeasonId, createSeasonSequence (mulberry32 PRNG)
└── store/
    └── gameStore.ts         # Zustand store: экраны, настройки, game state, таймер, actions
```

## Визуальный стиль (Subway Surfers)
- Закатный градиент (orange → gold → cream), солнце с лучами, облака, силуэт зданий
- Коричневая дорога с 3D-перспективой, золотые разделители, бегущие пунктиры
- Двери-порталы: яркие gradient (6 цветов), glossy overlay, feedback-анимации
- Бегун: причёска, худи с карманом, яркие кроссовки, blush cheeks
- VFX: speed lines, particle burst (звёзды), coin effect (+1 🪙), screen shake
- Timer bar: зелёный → жёлтый → красный (countdown)

## Ключевые решения
1. Жизни убраны — бесконечные. Ошибка = сброс, не конец игры
2. Таймер обязателен — без него скорость бессмысленна
3. Best score автосохраняется — закрыл вкладку = не потерял
4. GameOverScreen удалён — мёртвый код
5. Скорость влияет на таймер (ms на шаг), не на анимацию
6. Dynamic import с ssr:false — нужен для localStorage/Zustand
7. `output: 'export'` в next.config — для деплоя на любой статический хостинг

## Деплой
Проект полностью статический (нет API routes). Для деплоя:
1. `npx next build` — генерирует `out/` папку
2. Загрузить `out/` на любой хостинг:
   - **Vercel** — `vercel --prod` (нужен Vercel токен)
   - **Netlify** — `netlify deploy --dir=out` (нужен Netlify токен)
   - **Cloudflare Pages** — загрузить через dashboard или Wrangler
   - **Surge** — `surge out` (нужен логин)
   - **GitHub Pages** — нужен Pro аккаунт или workflow scope токен

## MVP статус: ✅ ГОТОВ
- [x] Home экран (lanes, speed, best score)
- [x] Игра (двери, бегун, feedback, VFX)
- [x] Таймер / urgency (speed-зависимый)
- [x] Бесконечные жизни
- [x] Combo-система
- [x] Best score автосохранение
- [x] Сезонная система
- [x] Визуал Subway Surfers
- [x] Build без ошибок (static export)
- [x] GitHub: https://github.com/sobag0404/door-runner-memory

## Что можно добавить потом
- Магазин скинов
- Онлайн-рейтинг
- Звуковые эффекты
- Анимация движения дверей (scrolling)
- Swipe-жесты для мобильных
- PWA (offline support)
