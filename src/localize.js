import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { setLocale } from 'yup';
import resources from './locales';

export default () => {
  setLocale({
    string: {
      url: 'invalid',
    },
    mixed: {
      notOneOf: 'exists',
    },
  });

  return i18next
    .use(LanguageDetector)
    .init({
      fallbackLng: 'en',
      resources,
    });
};
