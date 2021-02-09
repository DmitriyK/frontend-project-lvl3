import i18next from 'i18next';
import onChange from 'on-change';
import render from './render.js';

export default (state) => {
  const form = document.querySelector('#rssForm');
  const button = form.querySelector('button');
  const input = form.querySelector('input');
  const containerFeedback = document.querySelector('.feedback');

  return onChange(state, (path, value) => {
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
          button.disabled = false;
          input.classList.add('is-invalid');
          containerFeedback.classList.add('text-danger');
        }
        if (value === 'invalid') {
          button.disabled = true;
          input.classList.add('is-invalid');
          containerFeedback.classList.add('text-danger');
        }
        break;
      case 'form.error':
        if (value) {
          containerFeedback.textContent = i18next.t(`form.feedback.${value}`);
        }
        break;
      case 'feeds':
        render('feeds', state);
        break;
      case 'posts':
        render('posts', state);
        break;
      case 'modal':
        render('modal', state);
        break;
      default:
        break;
    }
  });
};
