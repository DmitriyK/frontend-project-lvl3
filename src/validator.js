import * as yup from 'yup';

const schema = yup.object().shape({
  url: yup.string().required()
    .matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
});

export default (url) => schema.validate({ url });
