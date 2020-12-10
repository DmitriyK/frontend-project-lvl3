import * as yup from 'yup';
import watch from './watch';

const schema = yup.object().shape({
  url: yup.string()
    .matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/, 'invalid'),
});

export default (state, url) => {
  if (url) {
    schema.validate({ url })
      .then(() => {
        const exists = state.urls.find((item) => item === url);
        if (exists) {
          throw new Error('exists');
        }
        watch(state).processState = 'wait';
      })
      .catch((err) => {
        watch(state).error = err.message;
        watch(state).processState = 'failed';
      });
  } else {
    watch(state).processState = 'wait';
  }
};
