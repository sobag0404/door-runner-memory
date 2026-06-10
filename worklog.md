---
Task ID: 1
Agent: main
Task: Полный визуальный редизайн игры в стиле Subway Surfers

Work Log:
- Полностью переписан DoorRunnerScene.tsx — новый визуальный стиль Subway Surfers
- Переписан globals.css — новые keyframes для аркадных анимаций
- Переписан HomeScreen.tsx — яркий закатный градиент, 3D-текст, декоративные элементы
- Обновлён GameOverScreen.tsx — тёплая палитра вместо тёмной
- Обновлён GameScreen.tsx — кнопка «Назад» в аркадном стиле

Key visual changes:
- Небо: тёплый закатный градиент (orange → gold → cream) вместо тёмного
- Солнце с анимированными лучами
- Облака с анимацией дрифта
- Силуэт зданий на горизонте
- Дорога: коричневая с 3D-перспективой, золотые разделители, бегущие пунктиры
- Двери: яркие порталы с gradient (orange/gold/mint/pink/blue/purple), glossy overlay
- Персонаж: детальный с волосами, худи с карманом, яркими кроссовками, blush cheeks
- Бегун прыгает при беге (runnerBounce), руки/ноги качаются
- Эффекты: speed lines, particle burst (звёзды + круги), coin effect (+1 🪙), screen shake при ошибке
- Комбо-система: badge при 3+ правильных подряд (NICE → GREAT → SUPER → INSANE)
- HUD: score pill с монеткой 🪙, combo multiplier badge
- Кнопки дорожек: яркие gradient с glossy/shadow эффектами

Stage Summary:
- Визуал полностью переделан в стиле Subway Surfers — яркий, красочный, аркадный
- Код компилируется (next build success)
- Протестировано через agent-browser — все экраны работают
