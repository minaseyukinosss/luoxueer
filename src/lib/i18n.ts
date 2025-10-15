export const translations = {
  zh: {
    home: '首页',
    music: '音乐',
    about: '关于',
    welcome: '欢迎来到 Luoxueer',
    description: '只是另一个设计工作室',
  },
  ja: {
    home: 'ホーム',
    music: '音楽',
    about: '概要',
    welcome: 'Luoxueerへようこそ',
    description: 'もう一つのデザインスタジオ',
  },
  en: {
    home: 'Home',
    music: 'Music',
    about: 'About',
    welcome: 'Welcome to Luoxueer',
    description: 'Just another design studio',
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKeys = keyof typeof translations.zh;

export function getTranslation(locale: Locale) {
  return translations[locale] || translations.en;
}

