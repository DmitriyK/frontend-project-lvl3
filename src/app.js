import addFeed, { updateRequestsFeeds } from './request.js';
import validate from './validate.js';

const form = document.querySelector('#rssForm');
const input = form.querySelector('input');

export default () => {
  const state = {
    currentUrl: '',
    processState: '',
    urls: [],
    feeds: [],
    posts: [],
    error: '',
  };

  updateRequestsFeeds(state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    state.currentUrl = url;
    addFeed(state);
  });

  input.addEventListener('change', (e) => {
    e.preventDefault();
    const url = e.target.value;
    validate(state, url);
    state.error = '';
  });
};
