import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from './locales';

export default (cb) => i18next
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    resources,
  }).then(cb);
