/* eslint-disable no-param-reassign */
import * as yup from 'yup';

export default (url, urls) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(urls),
  });

  let error;
  try {
    schema.validateSync({ url });
    error = null;
  } catch (e) {
    error = e.message;
  }
  return error;
};
