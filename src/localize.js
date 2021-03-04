import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { setLocale } from 'yup';

export default (option) => {
  setLocale({
    string: {
      url: 'invalid',
    },
    mixed: {
      notOneOf: 'exists',
    },
  });

  const instance = i18next.createInstance();

  return instance
    .use(LanguageDetector)
    .init(option);
};
