import i18next from 'i18next';
import resources from './locale';

export default (cb) => i18next
  .init({
    lng: 'en',
    resources,
  })
  .then(cb);
