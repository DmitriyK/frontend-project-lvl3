import onChange from 'on-change';
import render from './render.js';

export default (state, localize) => {
  const form = document.querySelector('#rssForm');
  const button = form.querySelector('button');
  const input = form.querySelector('input');
  const containerFeedback = document.querySelector('.feedback');
  const showProcessState = (process) => {
    switch (process) {
      case 'wait':
        input.classList.remove('is-invalid');
        containerFeedback.classList.remove('text-danger', 'text-success');
        containerFeedback.textContent = '';
        break;
      case 'sending':
        button.disabled = true;
        input.disabled = true;
        containerFeedback.textContent = localize.t(`form.feedback.process.${process}`);
        break;
      case 'success':
        form.reset();
        button.disabled = false;
        input.disabled = false;
        containerFeedback.classList.add('text-success');
        containerFeedback.textContent = localize.t(`form.feedback.process.${process}`);
        break;
      case 'failed':
        button.disabled = false;
        input.disabled = false;
        input.classList.add('is-invalid');
        containerFeedback.classList.add('text-danger');
        break;
      default:
        throw new Error(`Unknown order state: '${process}'!`);
    }
  };

  const watcher = (path, value) => {
    switch (path) {
      case 'form.processState':
        showProcessState(value);
        break;
      case 'form.error':
        if (value) {
          containerFeedback.textContent = localize.t(`form.feedback.error.${value}`);
        }
        break;
      case 'feeds':
        render('feeds', state, localize);
        break;
      case 'posts':
        render('posts', state, localize);
        break;
      case 'modal':
        render('modal', state);
        break;
      default:
        throw new Error(`Unknown order state: '${path}'!`);
    }
  };

  return onChange(state, watcher);
};
