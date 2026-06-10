---
Task ID: 1
Agent: main
Task: Убрать систему жизней из игры — сделать жизни бесконечными

Work Log:
- Удалена константа MAX_LIVES из gameStore.ts
- Удалено поле `lives` из интерфейса GameStore и начального состояния
- В chooseLane: при ошибке больше не уменьшаются жизни и не происходит Game Over — просто сбрасывается последовательность
- В resetGame: добавлено сохранение bestScore перед выходом на home screen
- Из DoorRunnerScene.tsx: убран блок жизней из HUD (убраны сердца, оставлен только score)
- Из AppContent.tsx: убран импорт и рендер GameOverScreen (экран больше не достижим)
- Добавлен allowedDevOrigins в next.config.mjs для корректной работы HMR через proxy
- Проверена компиляция через next build — успешно
- Проверена работа через agent-browser: нет жизней в HUD, ошибка не завершает игру, feedback показывается корректно

Stage Summary:
- Жизни полностью убраны из игры — бесконечные жизни
- При ошибке: последовательность сбрасывается, игра продолжается
- Best score сохраняется при выходе через кнопку «Назад»
- Game Over экран больше не используется
- Файлы изменены: gameStore.ts, DoorRunnerScene.tsx, AppContent.tsx, next.config.mjs
