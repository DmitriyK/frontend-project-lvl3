export default (localize) => {
  const article = document.querySelector('#rss-link-article');
  const input = document.querySelector('#rss-form-input');
  const buttonAdd = document.querySelector('#rss-btn-add');
  const buttonClose = document.querySelector('#rss-btn-close');
  const feedback = document.querySelector('#rss-feedback');

  input.setAttribute('placeholder', localize.t('form.input'));
  article.textContent = localize.t('modal.linkArticle');
  buttonAdd.textContent = localize.t('form.buttonAdd');
  buttonClose.textContent = localize.t('modal.buttonClose');
  feedback.textContent = localize.t('form.feedback.process.wait');
};
