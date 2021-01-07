import $ from 'jquery';
import addFeed, { updateRequestsFeeds } from './request.js';
import validate from './validate.js';
import watch from './watch.js';

export default () => {
  const state = {
    idCurrentPost: '',
    currentUrl: '',
    currentData: {},
    urls: [],
    feeds: [],
    posts: [],
    processState: '',
    error: '',
  };

  updateRequestsFeeds(state);

  const form = document.querySelector('#rssForm');
  const input = form.querySelector('input');

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

  $('#myModal').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    const id = button.data('id');
    watch(state).idCurrentPost = id;
  });
};
