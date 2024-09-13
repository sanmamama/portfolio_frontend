import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';

// i18nextの初期設定
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
    zh: { translation: zh }
  },
  lng: 'ja', // 初期言語
  fallbackLng: 'ja', // 見つからない場合
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;