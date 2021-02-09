/* eslint-disable no-param-reassign */
import { uniqueId, differenceBy, has } from 'lodash';
import axios from 'axios';
import parse from './parser.js';

const corsUrl = 'https://hexlet-allorigins.herokuapp.com/raw?url=';

const addProxy = (proxy, url) => `${proxy}${url}`;

const makeRequest = (url) => axios.get(addProxy(corsUrl, url));

export const updateFeeds = (state) => {
  const updateInterval = 5000;
  const promises = state.urls.map((url) => makeRequest(url).catch((error) => ({ error })));
  const update = (data) => {
    const { feed, posts } = parse(data);
    const newPosts = differenceBy(posts, state.posts, 'link');
    if (newPosts.length !== 0) {
      const modefiedPosts = newPosts.map((newPost) => ({ ...newPost, id: uniqueId('post_'), idFeed: feed.id }));
      state.posts.unshift(...modefiedPosts);
    }
  };

  Promise.all(promises)
    .then((responses) => {
      responses.forEach((response) => {
        if (has(response, 'error')) throw response.error;
        update(response.data);
      });
    })
    .finally(() => setTimeout(() => updateFeeds(state), updateInterval));
};

export default (state) => {
  state.form.processState = 'sending';
  makeRequest(state.form.url)
    .then(({ data }) => {
      state.form.processState = 'success';
      const { feed, posts } = parse(data);
      const modefiedFeed = { ...feed, id: uniqueId('feed_') };
      const modefiedPosts = posts.map((post) => ({ ...post, id: uniqueId('post_'), idFeed: modefiedFeed.id }));
      state.feeds.unshift(modefiedFeed);
      state.posts.unshift(...modefiedPosts);
      state.urls.unshift(state.form.url);
    })
    .catch((error) => {
      state.form.processState = 'failed';
      if (error.message === 'Error parsing XML') {
        state.form.error = 'rss';
      } else {
        state.form.error = 'network';
      }
      throw error;
    });
};
