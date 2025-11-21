export const translations = {
  zh: {
    home: '首页',
    music: '音乐盒',
    about: '关于',
    welcome: '欢迎来到 Luoxueer',
    description: '只是另一个设计工作室',
    contact: '商务合作',
    social: '社交媒体',
    slogan: '让灵感落地',
    rights: '版权所有',
    businessEmail: '商务邮箱：',
    connect: '社交媒体',
    others: '其他',
  },
  ja: {
    home: 'ホーム',
    music: 'ミュージックボックス',
    about: '概要',
    welcome: 'Luoxueerへようこそ',
    description: 'もう一つのデザインスタジオ',
    contact: 'ビジネス提携',
    social: 'ソーシャル',
    slogan: 'インスピレーションを実現する',
    rights: '無断複写・転載を禁じます',
    businessEmail: 'ビジネスメール：',
    connect: 'ソーシャル',
    others: 'その他',
  },
  en: {
    home: 'Home',
    music: 'Music Box',
    about: 'About',
    welcome: 'Welcome to Luoxueer',
    description: 'Just another design studio',
    contact: 'Business Cooperation',
    social: 'Social',
    slogan: 'Let\'s bring your vision to life',
    rights: 'All Rights Reserved',
    businessEmail: 'Business Email:',
    connect: 'Connect',
    others: 'Others',
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKeys = keyof typeof translations.zh;

export function getTranslation(locale: Locale) {
  return translations[locale] || translations.en;
}

