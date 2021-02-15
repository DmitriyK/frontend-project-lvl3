import { setLocale } from 'yup';
import en from './en.js';

setLocale({
  string: {
    url: 'invalid',
  },
  mixed: {
    notOneOf: 'exists',
  },
});

export default { en };
