import i18next from 'i18next';
import render from './render.js';

const form = document.querySelector('#rssForm');
const button = form.querySelector('button');
const input = form.querySelector('input');
const containerFeedback = document.querySelector('.feedback');

export default (path, value) => {
  switch (path) {
    case 'form.processState':
      if (value === 'wait') {
        button.disabled = false;
        input.classList.remove('is-invalid');
        containerFeedback.classList.remove('text-danger', 'text-success');
        containerFeedback.textContent = '';
      }
      if (value === 'sending') {
        button.disabled = true;
        containerFeedback.textContent = i18next.t(`form.feedback.${value}`);
      }
      if (value === 'success') {
        button.disabled = false;
        form.reset();
        containerFeedback.classList.add('text-success');
        containerFeedback.textContent = i18next.t(`form.feedback.${value}`);
      }
      if (value === 'failed') {
        button.disabled = true;
        input.classList.add('is-invalid');
        containerFeedback.classList.add('text-danger');
      }
      break;
    case 'form.error':
      if (value) {
        containerFeedback.textContent = i18next.t(`form.feedback.failed.${value}`);
      }
      break;
    case 'feeds':
      render('feeds', value);
      break;
    case 'posts':
      render('posts', value);
      break;
    case 'modal':
      render('modal', value);
      break;
    default:
      break;
  }
};
