import $ from 'jquery';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { setLocale } from 'yup';
import addFeed, { updateFeeds } from './request.js';
import validate from './validate.js';
import watch from './watch.js';
import resources from './locales';
import homePage from './locales/home-page.js';

export default () => {
  setLocale({
    string: {
      url: 'invalid',
    },
    mixed: {
      notOneOf: 'exists',
    },
  });

  const instance = i18next.createInstance();

  const promise = instance
    .use(LanguageDetector)
    .init({
      lng: 'ru',
      fallbackLng: 'ru',
      resources,
    })
    .then(() => {
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

      homePage(instance);
      const watchedState = watch(state, instance);
      updateFeeds(watchedState);

      const form = document.querySelector('#rssForm');
      const input = form.querySelector('input');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const urls = state.feeds.map((feed) => feed.url);
        watchedState.form.processState = 'sending';
        watchedState.form.error = '';
        const error = validate(url, urls);
        if (error) {
          watchedState.form.processState = 'failed';
          watchedState.form.error = error;
        } else {
          state.form.url = url;
          addFeed(watchedState);
        }
        console.log(state);
      });

      input.addEventListener('input', (e) => {
        e.preventDefault();
        watchedState.form.processState = 'wait';
      });

      $('#modalPost').on('show.bs.modal', (event) => {
        const button = $(event.relatedTarget);
        const idActivePost = button.data('id');
        const activePost = state.posts.find((post) => post.id === idActivePost);
        const hasActivePost = state.watchedPosts.includes(idActivePost);
        if (!hasActivePost) {
          state.watchedPosts.unshift(idActivePost);
        }
        watchedState.modal = activePost;
      });
    });
  return promise;
};
