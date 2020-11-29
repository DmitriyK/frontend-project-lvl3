import i18next from 'i18next';
import request from './request.js';
import watch from './watch.js';
import validation from './validator.js';
import parser from './parser.js';
import resources from './locale';

export default class Feed {
  constructor(form) {
    this.form = form;
    this.state = {
      processState: '',
      processError: null,
      url: '',
      feeds: [],
      posts: [],
      successMessage: '',
      errorMessage: '',
    };
    this.i18next = i18next.init({
      lng: 'en',
      debug: true,
      resources,
    });
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      this.state.url = formData.get('url');
      const searchFeed = new Promise((resolve, reject) => {
        this.state.feeds.forEach((feed) => {
          if (feed.feedUrl === this.state.url) {
            reject(new Error());
          }
        });
        resolve(this.state.url);
      });
      watch(this.state).processState = 'sending';
      this.i18next.then((t) => {
      // Search for duplicates url
        searchFeed.then((url) => {
        // Validate url
          validation(url).then(() => {
          // Get an http request
            request(url).then((response) => {
              const feedId = this.state.feeds.length + 1;
              const feedUrl = this.state.url;
              const { feed, posts } = parser(response.data.contents, feedId, feedUrl);
              this.state.feeds = [feed, ...this.state.feeds];
              this.state.posts = [...posts, ...this.state.posts];
              this.state.successMessage = t('form.feedback.success');
              watch(this.state).processState = 'finished';
            }).catch(() => {
              this.state.errorMessage = t('form.feedback.error.request');
              watch(this.state).processState = 'failed';
            });
          }).catch(() => {
            this.state.errorMessage = t('form.feedback.error.validate');
            watch(this.state).processState = 'failed';
          });
        }).catch(() => {
          this.state.errorMessage = t('form.feedback.error.exists');
          watch(this.state).processState = 'failed';
        });
      });
    });
  }
}
