import watchedState from './watch.js';
// import axios from 'axios';
import isValid from './validator.js';

export default class Request {
  constructor(form) {
    this.form = form;
  }

  init() {
    const state = {
      rssForm: {
        processState: '',
        processError: null,
        url: '',
        valid: true,
        errors: {},
      },
    };

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      state.rssForm.url = formData.get('url');
      watchedState(state).rssForm.processState = 'sending';
      try {
        const [validState, errMessage] = isValid(state.rssForm.url);
        if (validState) {
          watchedState(state).rssForm.valid = validState;
          // axios.get();
          // fetch();
          watchedState(state).rssForm.processState = 'finished';
        } else {
          watchedState(state).rssForm.valid = validState;
          watchedState(state).rssForm.errors = errMessage;
        }
      } catch (err) {
        console.log(err);
        watchedState(state).rssForm.errors = err;
        watchedState(state).rssForm.processState = 'failed';
        throw err;
      }
    });
  }
}
