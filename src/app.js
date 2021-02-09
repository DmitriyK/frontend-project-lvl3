import $ from 'jquery';
import i18next from 'i18next';
import addFeed, { updateFeeds } from './request.js';
import validate from './validate.js';
import watch from './watch.js';
import localize from './localize';

export default () => {
  const state = {
    form: {
      url: null,
      valid: null,
      processState: null,
      error: null,
    },
    modal: {},
    urls: [],
    feeds: [],
    posts: [],
    watchedPosts: [],
  };

  localize(i18next);
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
    state.form.url = url;
    validate(watchedState);
  });

  $('#modalPost').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    const idActivePost = button.data('id');
    const activePost = state.posts.find((post) => post.id === idActivePost);
    state.watchedPosts.unshift(idActivePost);
    watchedState.modal = activePost;
  });
};
