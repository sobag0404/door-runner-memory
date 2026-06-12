// ─── i18n — Lightweight localization ───────────────────
// Simple key-value translation system without external deps

export type Lang = 'ru' | 'en';

export interface Translations {
  [key: string]: string;
}

const RU: Translations = {
  // Home
  'home.subtitle': 'Запомни путь. Доверься памяти. 🧠',
  'home.play': 'ИГРАТЬ!',
  'home.daily': 'ДЕЙЛИ!',
  'home.lanes': 'Дорожки',
  'home.speed': 'Скорость',
  'home.slow': 'Медленно',
  'home.normal': 'Обычно',
  'home.fast': 'Быстро',
  'home.custom': 'Своё',
  'home.regular': 'Обычный',
  'home.dailyMode': 'Дейли',
  'home.seasonBest': 'Лучший (устройство)',
  'home.dailyBest': 'Лучший за день (устройство)',
  'home.install': 'Установить',
  'home.howToPlay': 'Как играть',
  'home.mute': 'Выкл. звук',
  'home.unmute': 'Вкл. звук',
  'home.timer': 'Таймер',
  'home.sec': 'с',
  'home.customDesc': 'Настрой таймер и количество дорожек',

  // Daily
  'daily.challenge': 'Челлендж',
  'daily.sameSequence': 'Одинаковая последовательность для всех! Лучший: ',
  'daily.noBest': '—',

  // Game
  'game.back': 'Назад',
  'game.saveScore': 'Сохрани результат!',
  'game.enterName': 'Введи имя для таблицы лидеров',
  'game.yourName': 'Твоё имя...',
  'game.skip': 'Пропустить',
  'game.save': 'Сохранить',
  'game.score': 'Счёт',
  'game.combo': 'Комбо',
  'game.share': 'Поделиться',
  'game.copied': 'Скопировано!',
  'game.shareText': '🚪 Door Runner Memory\n{mode}\n🏆 Счёт: {score}{combo}\n\nСможешь побить? 👇',
  'game.shareDaily': '📅 Дейли',
  'game.shareRegular': '🎮 Обычный',

  // Swipe hints
  'hint.swipe': 'Свайп или тап',
  'hint.space': 'Пробел',

  // Tutorial
  'tutorial.skip': 'Пропустить',
  'tutorial.next': 'Далее →',
  'tutorial.go': 'Поехали! 🚀',
  'tutorial.step1Title': 'Запомни дверь',
  'tutorial.step1Text': 'Смотри, какая дверь подсвечена — это правильный путь!',
  'tutorial.step2Title': 'Выбери путь',
  'tutorial.step2Text': 'Тапни по двери, свайпни или нажми ← → / A D на клавиатуре',
  'tutorial.step3Title': 'Собирай комбо',
  'tutorial.step3Text': 'Ответил правильно 3+ раз подряд — получи комбо-бонус!',
  'tutorial.step4Title': 'Не медли!',
  'tutorial.step4Text': 'Время на ответ ограничено. Чем дальше — тем быстрее!',

  // Leaderboard
  'lb.title': 'Рекорды на устройстве',
  'lb.all': 'Все',
  'lb.regular': 'Обычный',
  'lb.daily': 'Дейли',
  'lb.noScores': 'Пока нет результатов',
  'lb.playToBoard': 'Сыграй, чтобы попасть в таблицу!',
  'lb.lanes': 'дорожки',

  // Achievements
  'ach.title': 'Достижения',
  'ach.unlocked': 'Открыто',

  // Themes
  'theme.classic': 'Классика',
  'theme.neon': 'Неон',
  'theme.retro': 'Ретро',

  // Offline
  'offline.message': 'Нет подключения к сети',
  'offline.backOnline': 'Снова онлайн!',

  // Combo labels
  'combo.nice': 'КРУТО!',
  'combo.great': 'ОТЛИЧНО!',
  'combo.super': 'СУПЕР!',
  'combo.insane': 'БЕЗУМИЕ!',

  // Error Boundary
  'error.title': 'Что-то сломалось!',
  'error.message': 'Произошла неожиданная ошибка. Попробуй ещё раз или перезагрузи страницу.',
  'error.retry': 'Повторить',
  'error.reload': 'Перезагрузить',
  'error.details': 'Детали ошибки',

  // Sound packs
  'sound.classic': 'Классика',
  'sound.8bit': '8-бит',
  'sound.soft': 'Мягкий',
  'sound.pack': 'Звуки',

  // Settings labels
  'settings.theme': 'Тема',
  'settings.language': 'Язык',

  // Game feedback
  'game.correct': 'Верно!',
  'game.wrong': 'Ошибка!',

  // Install banner
  'install.title': 'Установить игру',
  'install.close': 'Закрыть',
  'install.android': 'Установить',
  'install.ios': 'Нажми кнопку "Поделиться" и выбери "На экран Домой"',
  'install.later': 'Позже',
  'install.iosStep1': '1. Нажми кнопку «Поделиться»',
  'install.iosStep2': '2. Выбери «На экран Домой»',

  // A11y
  'a11y.newGame': 'Новая игра началась!',
  'a11y.correct': 'Правильно! Счёт: {score}',
  'a11y.wrong': 'Неправильно! Счёт сброшен.',
  'a11y.combo': 'Комбо {combo}!',

  // Tutorial extra
  'tutorial.or': 'или',

  // Achievement titles
  'ach.first10': 'Первые шаги',
  'ach.first10Desc': 'Набери 10 очков за одну игру',
  'ach.score25': 'Неплохо!',
  'ach.score25Desc': 'Набери 25 очков за одну игру',
  'ach.score50': 'Мастер памяти',
  'ach.score50Desc': 'Набери 50 очков за одну игру',
  'ach.score100': 'Легенда',
  'ach.score100Desc': 'Набери 100 очков за одну игру',
  'ach.combo5': 'В ударе!',
  'ach.combo5Desc': 'Достигни комбо x5',
  'ach.combo10': 'Неудержимый',
  'ach.combo10Desc': 'Достигни комбо x10',
  'ach.combo20': 'Сверхчеловек',
  'ach.combo20Desc': 'Достигни комбо x20',
  'ach.total100': 'Настойчивый',
  'ach.total100Desc': 'Дай 100 правильных ответов всего',
  'ach.total500': 'Преданный',
  'ach.total500Desc': 'Дай 500 правильных ответов всего',
  'ach.total1000': 'Одержимый',
  'ach.total1000Desc': 'Дай 1000 правильных ответов всего',
  'ach.games10': 'Разминка',
  'ach.games10Desc': 'Сыграй 10 игр',
  'ach.games50': 'Ветеран',
  'ach.games50Desc': 'Сыграй 50 игр',
  'ach.fast10': 'Скоростной',
  'ach.fast10Desc': 'Набери 10 на быстрой скорости',
  'ach.fast25': 'Молниеносный',
  'ach.fast25Desc': 'Набери 25 на быстрой скорости',
  'ach.lane4': 'Мультитаскер',
  'ach.lane4Desc': 'Набери 20 на 4 дорожках',
  'ach.lane5': 'Следопыт',
  'ach.lane5Desc': 'Набери 15 на 5 дорожках',
  'ach.lane6': 'Штурман хаоса',
  'ach.lane6Desc': 'Набери 10 на 6 дорожках',
  'ach.daily1': 'Дейли-игрок',
  'ach.daily1Desc': 'Пройди первый дейли-челлендж',
  'ach.daily7': 'Воин недели',
  'ach.daily7Desc': 'Пройди 7 дейли-челленджей',
  'ach.dailyBest': 'Чемпион дня',
  'ach.dailyBestDesc': 'Набери 10 в дейли-челлендже',
};

const EN: Translations = {
  // Home
  'home.subtitle': 'Remember the path. Trust your memory. 🧠',
  'home.play': 'PLAY!',
  'home.daily': 'DAILY!',
  'home.lanes': 'Lanes',
  'home.speed': 'Speed',
  'home.slow': 'Slow',
  'home.normal': 'Normal',
  'home.fast': 'Fast',
  'home.custom': 'Custom',
  'home.regular': 'Regular',
  'home.dailyMode': 'Daily',
  'home.seasonBest': 'Best (this device)',
  'home.dailyBest': 'Daily best (this device)',
  'home.install': 'Install',
  'home.howToPlay': 'How to play',
  'home.mute': 'Mute sounds',
  'home.unmute': 'Enable sounds',
  'home.timer': 'Timer',
  'home.sec': 's',
  'home.customDesc': 'Customize timer and lane count',

  // Daily
  'daily.challenge': 'Challenge',
  'daily.sameSequence': 'Same sequence for everyone today! Best: ',
  'daily.noBest': '—',

  // Game
  'game.back': 'Back',
  'game.saveScore': 'Save Your Score!',
  'game.enterName': 'Enter your name for the leaderboard',
  'game.yourName': 'Your name...',
  'game.skip': 'Skip',
  'game.save': 'Save',
  'game.score': 'Score',
  'game.combo': 'Combo',
  'game.share': 'Share result',
  'game.copied': 'Copied!',
  'game.shareText': '🚪 Door Runner Memory\n{mode}\n🏆 Score: {score}{combo}\n\nCan you beat me? 👇',
  'game.shareDaily': '📅 Daily',
  'game.shareRegular': '🎮 Regular',

  // Swipe hints
  'hint.swipe': 'Swipe or tap',
  'hint.space': 'Space',

  // Tutorial
  'tutorial.skip': 'Skip',
  'tutorial.next': 'Next →',
  'tutorial.go': "Let's go! 🚀",
  'tutorial.step1Title': 'Remember the Door',
  'tutorial.step1Text': 'Look at the highlighted door — that\'s the correct path!',
  'tutorial.step2Title': 'Choose Your Path',
  'tutorial.step2Text': 'Tap the door, swipe, or press ← → / A D on keyboard',
  'tutorial.step3Title': 'Build Combos',
  'tutorial.step3Text': 'Answer correctly 3+ times in a row for a combo bonus!',
  'tutorial.step4Title': "Don't Hesitate!",
  'tutorial.step4Text': 'Time is limited. The further you go, the faster it gets!',

  // Leaderboard
  'lb.title': 'Records on this device',
  'lb.all': 'All',
  'lb.regular': 'Regular',
  'lb.daily': 'Daily',
  'lb.noScores': 'No scores yet',
  'lb.playToBoard': 'Play a game to get on the board!',
  'lb.lanes': 'lanes',

  // Achievements
  'ach.title': 'Achievements',
  'ach.unlocked': 'Unlocked',

  // Themes
  'theme.classic': 'Classic',
  'theme.neon': 'Neon',
  'theme.retro': 'Retro',

  // Offline
  'offline.message': 'No internet connection',
  'offline.backOnline': 'Back online!',

  // Combo labels
  'combo.nice': 'NICE!',
  'combo.great': 'GREAT!',
  'combo.super': 'SUPER!',
  'combo.insane': 'INSANE!',

  // Error Boundary
  'error.title': 'Something broke!',
  'error.message': 'An unexpected error occurred. Try again or reload the page.',
  'error.retry': 'Retry',
  'error.reload': 'Reload',
  'error.details': 'Error details',

  // Sound packs
  'sound.classic': 'Classic',
  'sound.8bit': '8-bit',
  'sound.soft': 'Soft',
  'sound.pack': 'Sounds',

  // Settings labels
  'settings.theme': 'Theme',
  'settings.language': 'Language',

  // Game feedback
  'game.correct': 'Correct!',
  'game.wrong': 'Wrong!',

  // Install banner
  'install.title': 'Install the game',
  'install.close': 'Close',
  'install.android': 'Install',
  'install.ios': 'Tap Share button, then "Add to Home Screen"',
  'install.later': 'Later',
  'install.iosStep1': '1. Tap the Share button',
  'install.iosStep2': '2. Select "Add to Home Screen"',

  // A11y
  'a11y.newGame': 'New game started!',
  'a11y.correct': 'Correct! Score: {score}',
  'a11y.wrong': 'Wrong! Score reset.',
  'a11y.combo': 'Combo {combo}!',

  // Tutorial extra
  'tutorial.or': 'or',

  // Achievement titles
  'ach.first10': 'First Steps',
  'ach.first10Desc': 'Score 10 in a single game',
  'ach.score25': 'Getting Good',
  'ach.score25Desc': 'Score 25 in a single game',
  'ach.score50': 'Memory Master',
  'ach.score50Desc': 'Score 50 in a single game',
  'ach.score100': 'Legendary',
  'ach.score100Desc': 'Score 100 in a single game',
  'ach.combo5': 'On Fire!',
  'ach.combo5Desc': 'Reach a 5x combo',
  'ach.combo10': 'Unstoppable',
  'ach.combo10Desc': 'Reach a 10x combo',
  'ach.combo20': 'Superhuman',
  'ach.combo20Desc': 'Reach a 20x combo',
  'ach.total100': 'Persistent',
  'ach.total100Desc': 'Answer 100 correct total',
  'ach.total500': 'Dedicated',
  'ach.total500Desc': 'Answer 500 correct total',
  'ach.total1000': 'Obsessed',
  'ach.total1000Desc': 'Answer 1000 correct total',
  'ach.games10': 'Warming Up',
  'ach.games10Desc': 'Play 10 games',
  'ach.games50': 'Veteran',
  'ach.games50Desc': 'Play 50 games',
  'ach.fast10': 'Speed Demon',
  'ach.fast10Desc': 'Score 10 on Fast speed',
  'ach.fast25': 'Lightning Reflexes',
  'ach.fast25Desc': 'Score 25 on Fast speed',
  'ach.lane4': 'Multitasker',
  'ach.lane4Desc': 'Score 20 with 4 lanes',
  'ach.lane5': 'Path Finder',
  'ach.lane5Desc': 'Score 15 with 5 lanes',
  'ach.lane6': 'Chaos Navigator',
  'ach.lane6Desc': 'Score 10 with 6 lanes',
  'ach.daily1': 'Daily Player',
  'ach.daily1Desc': 'Complete your first Daily Challenge',
  'ach.daily7': 'Week Warrior',
  'ach.daily7Desc': 'Complete 7 Daily Challenges',
  'ach.dailyBest': 'Daily Champion',
  'ach.dailyBestDesc': 'Score 10 in a Daily Challenge',
};

const TRANSLATIONS: Record<Lang, Translations> = { ru: RU, en: EN };

export function t(key: string, lang: Lang, params?: Record<string, string | number>): string {
  let text = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

/** Detect initial language from browser or localStorage */
export function detectLang(): Lang {
  const saved = typeof window !== 'undefined'
    ? localStorage.getItem('drm_lang')
    : null;
  if (saved === 'ru' || saved === 'en') return saved;
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return nav.startsWith('ru') ? 'ru' : 'en';
}

export function saveLang(lang: Lang): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('drm_lang', lang);
  }
}
