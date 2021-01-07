import onChange from 'on-change';
import render from './render.js';
import localize from './localize.js';

const form = document.querySelector('#rssForm');
const button = form.querySelector('button');
const input = form.querySelector('input');
const containerFeedback = document.querySelector('.feedback');

const watch = (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'processState':
      if (value === 'wait') {
        button.disabled = false;
        input.classList.remove('is-invalid');
        containerFeedback.classList.remove('text-danger', 'text-success');
        containerFeedback.innerHTML = '';
      }
      if (value === 'sending') {
        button.disabled = true;
        containerFeedback.innerHTML = localize('form.feedback.sending');
      }
      if (value === 'success') {
        button.disabled = false;
        form.reset();
        containerFeedback.classList.add('text-success');
        containerFeedback.innerHTML = localize('form.feedback.success');
      }
      if (value === 'failed') {
        button.disabled = true;
        input.classList.add('is-invalid');
        containerFeedback.classList.add('text-danger');
      }
      break;
    case 'error':
      if (value) {
        containerFeedback.innerHTML = localize(`form.feedback.fail.${state.error}`);
      }
      break;
    case 'currentData': {
      const { feed, posts } = value;
      if (Object.prototype.hasOwnProperty.call(value, 'feed')) {
        render('feed', feed);
        render('posts', posts);
      } else {
        render('posts', posts);
      }
    }
      break;
    case 'idCurrentPost':
      render('modal', state);
      break;
    default:
      break;
  }
});

export default watch;
