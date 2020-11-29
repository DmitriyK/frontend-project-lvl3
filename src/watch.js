import onChange from 'on-change';
import renderState, { renderErrors as renderErrorMessage } from './render';

const form = document.getElementById('rssForm');
const button = form.querySelector('button');
const input = form.querySelector('input');

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'processState':
      if (value === 'sending') {
        input.classList.remove('is-invalid');
        button.disabled = true;
      }
      if (value === 'finished') {
        button.disabled = false;
        form.reset();
        renderState(state);
      }
      if (value === 'failed') {
        input.classList.add('is-invalid');
        button.disabled = false;
        renderErrorMessage(state);
      }
      break;
    default:
      break;
  }
});
