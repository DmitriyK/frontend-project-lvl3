/* eslint-disable no-param-reassign */
import * as yup from 'yup';

export default (url, urls) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(urls),
  });

  try {
    schema.validateSync({ url });
    return null;
  } catch (e) {
    return e.message;
  }
};
