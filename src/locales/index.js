import i18next from 'i18next';
import en from './en.js';

const resources = {
  en,
};

const option = {
  lng: 'en',
  resources,
};

export default () => i18next.init(option);
