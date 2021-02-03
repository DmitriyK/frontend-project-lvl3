import * as yup from 'yup';
import { setLocale } from 'yup';

setLocale({
  string: {
    url: 'invalid',
  },
  mixed: {
    notOneOf: 'exists',
  },
});

export default (state) => {
  const { url } = state.form;
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.urls),
  });

  schema.validate({ url })
    .then(() => {
      state.form.error = '';
      state.form.processState = 'wait';
    })
    .catch((err) => {
      state.form.error = err.message;
      state.form.processState = 'failed';
    });
};
