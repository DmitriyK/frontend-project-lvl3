import $ from 'jquery';
import addFeed, { updateFeeds } from './request.js';
import validate from './validate.js';
import watch from './watch.js';
import localize from './localize';

export default () => {
  const state = {
    form: {
      url: '',
      valid: false,
      processState: 'wait',
      error: null,
    },
    modal: {},
    feeds: [],
    posts: [],
    watchedPosts: [],
  };

  localize();
  const watchedState = watch(state);
  updateFeeds(watchedState);

  const form = document.querySelector('#rssForm');
  const input = form.querySelector('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.processState = 'wait';
    addFeed(watchedState);
  });

  input.addEventListener('input', (e) => {
    e.preventDefault();
    const url = e.target.value;
    const urls = state.feeds.map((feed) => feed.url);
    const error = validate(url, urls);
    if (error) {
      watchedState.form.processState = 'failed';
      watchedState.form.error = error;
      watchedState.form.valid = false;
    } else {
      watchedState.form.processState = 'wait';
      watchedState.form.error = '';
      watchedState.form.valid = true;
      watchedState.form.url = url;
    }
  });

  $('#modalPost').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    const idActivePost = button.data('id');
    const activePost = state.posts.find((post) => post.id === idActivePost);
    const hasActivePost = state.watchedPosts.includes(idActivePost);
    if (!hasActivePost) {
      watchedState.watchedPosts.unshift(idActivePost);
    }
    watchedState.modal = activePost;
  });
};
