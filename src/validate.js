import * as yup from 'yup';
import { setLocale } from 'yup';
import watch from './watch';

setLocale({
  string: {
    url: 'url',
  },
  mixed: {
    notOneOf: 'exists',
  },
});

export default (state, url) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.urls),
  });

  schema.validate({ url })
    .then(() => {
      watch(state).processState = 'wait';
    })
    .catch((err) => {
      watch(state).error = err.message;
      watch(state).processState = 'failed';
    });
};
