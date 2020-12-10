import i18next from 'i18next';
import resources from './locale';

i18next
  .init({
    lng: 'en',
    debug: true,
    resources,
  });

export default (key) => i18next.t(key);
