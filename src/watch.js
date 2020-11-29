import onChange from 'on-change';
import renderState from './render';

const form = document.getElementById('rssForm');
const button = form.querySelector('button');
const input = form.querySelector('input');
const containerFeedback = document.querySelector('.feedback');

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
        containerFeedback.classList.remove('text-danger');
        containerFeedback.classList.add('text-success');
        containerFeedback.innerHTML = state.successMessage;
        renderState(state);
      }
      if (value === 'failed') {
        button.disabled = false;
        input.classList.add('is-invalid');
        containerFeedback.classList.add('text-danger');
        containerFeedback.innerHTML = state.errorMessage;
      }
      break;
    default:
      break;
  }
});
