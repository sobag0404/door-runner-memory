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
  'home.seasonBest': 'Лучший за сезон',
  'home.dailyBest': 'Лучший за день',
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
  'game.copied': '✓ Скопировано!',
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
  'lb.title': 'Таблица лидеров',
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
  'combo.nice': '👍 КРУТО!',
  'combo.great': '✨ ОТЛИЧНО!',
  'combo.super': '⚡ СУПЕР!',
  'combo.insane': '🔥 БЕЗУМИЕ!',

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

  // Game feedback
  'game.correct': '✓ Верно!',
  'game.wrong': '✗ Ошибка!',

  // A11y
  'a11y.newGame': 'Новая игра началась!',
  'a11y.correct': 'Правильно! Счёт: {score}',
  'a11y.wrong': 'Неправильно! Счёт сброшен.',
  'a11y.combo': 'Комбо {combo}!',
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
  'home.seasonBest': 'Season Best',
  'home.dailyBest': 'Daily Best',
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
  'game.copied': '✓ Copied!',
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
  'lb.title': 'Leaderboard',
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
  'combo.nice': '👍 NICE!',
  'combo.great': '✨ GREAT!',
  'combo.super': '⚡ SUPER!',
  'combo.insane': '🔥 INSANE!',

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

  // Game feedback
  'game.correct': '✓ Correct!',
  'game.wrong': '✗ Wrong!',

  // A11y
  'a11y.newGame': 'New game started!',
  'a11y.correct': 'Correct! Score: {score}',
  'a11y.wrong': 'Wrong! Score reset.',
  'a11y.combo': 'Combo {combo}!',
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
