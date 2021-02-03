import $ from 'jquery';
import onChange from 'on-change';
import addFeed, { updateFeeds } from './request.js';
import validate from './validate.js';
import watch from './watch.js';
import localize from './locales';

export default () => {
  const state = {
    form: {
      url: '',
      processState: '',
      error: '',
    },
    modal: {
      activePost: {},
    },
    urls: [],
    feeds: [],
    posts: [],
  };

  const watchedState = onChange(state, watch);
  localize();
  updateFeeds(watchedState);

  const form = document.querySelector('#rssForm');
  const input = form.querySelector('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    state.form.url = url;
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
    const findPost = state.posts.find((post) => post.id === idActivePost);
    const activePost = Object.assign(findPost, { watched: true });
    const updatedPosts = state.posts
      .map((post) => ((post.id === activePost.id) ? activePost : post));
    state.posts = updatedPosts;
    watchedState.modal = activePost;
  });
};
