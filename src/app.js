import request from './request.js';
import watch from './watch.js';
import validation from './validator.js';
import parser from './parser.js';

export default class Feed {
  constructor(form) {
    this.form = form;
    this.state = {
      processState: '',
      processError: null,
      url: '',
      feeds: [],
      posts: [],
      error: '',
    };
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      this.state.url = formData.get('url');
      watch(this.state).processState = 'sending';
      const searchFeed = new Promise((resolve, reject) => {
        this.state.feeds.forEach((feed) => {
          if (feed.feedUrl === this.state.url) {
            reject(new Error());
          }
        });
        resolve(this.state.url);
      });
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
            watch(this.state).processState = 'finished';
          }).catch(() => {
            this.state.error = 'This source doesn\'t contain valid rss';
            watch(this.state).processState = 'failed';
          });
        }).catch(() => {
          this.state.error = 'Must be valid url';
          watch(this.state).processState = 'failed';
        });
      }).catch(() => {
        this.state.error = 'Rss already exists';
        watch(this.state).processState = 'failed';
      });
    });
  }
}
