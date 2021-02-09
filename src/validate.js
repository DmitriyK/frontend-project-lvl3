/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import { setLocale } from 'yup';

export default (state) => {
  setLocale({
    string: {
      url: 'invalid',
    },
    mixed: {
      notOneOf: 'exists',
    },
  });

  const { url } = state.form;
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.urls),
  });

  schema.validate({ url })
    .then(() => {
      state.form.processState = 'wait';
      state.form.error = '';
      state.form.valid = true;
    })
    .catch((err) => {
      state.form.processState = 'invalid';
      state.form.error = err.message;
      state.form.valid = false;
    });
};
