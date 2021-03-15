/* eslint-disable no-param-reassign */
import uniqueId from 'lodash/uniqueId';
import differenceBy from 'lodash/differenceBy';
import has from 'lodash/has';
import axios from 'axios';
import parse from './parser.js';

const corsUrl = 'https://hexlet-allorigins.herokuapp.com/get?';

const addProxy = (proxy, url) => {
  const newUrl = new URL(proxy);
  newUrl.searchParams.set('disableCache', true);
  newUrl.searchParams.set('url', url);
  return newUrl.toString();
};

const makeRequest = (url) => axios.get(addProxy(corsUrl, url));

export const updateFeeds = (state) => {
  const updateInterval = 5000;
  const promises = state.feeds.map(({ url }) => makeRequest(url).catch((error) => ({ error })));
  const update = (data) => {
    const parsedData = parse(data.contents);
    if (!has(parsedData, 'error')) {
      const { feed, posts } = parsedData;
      const newPosts = differenceBy(posts, state.posts, 'link');
      const modefiedPosts = newPosts.map((newPost) => ({ ...newPost, id: uniqueId('post_'), idFeed: feed.id }));
      state.posts.unshift(...modefiedPosts);
    }
  };

  Promise.all(promises)
    .then((responses) => {
      responses.forEach((response) => {
        if (!has(response, 'error')) update(response.data);
      });
    })
    .finally(() => setTimeout(() => updateFeeds(state), updateInterval));
};

export default (state) => {
  makeRequest(state.form.url)
    .then(({ data }) => {
      state.form.processState = 'success';
      const parsedData = parse(data.contents);
      if (has(parsedData, 'error')) throw parsedData.error;
      const { feed, posts } = parsedData;
      const modefiedFeed = { ...feed, id: uniqueId('feed_'), url: state.form.url };
      const modefiedPosts = posts.map((post) => ({ ...post, id: uniqueId('post_'), idFeed: modefiedFeed.id }));
      state.feeds.unshift(modefiedFeed);
      state.posts.unshift(...modefiedPosts);
    })
    .catch((error) => {
      state.form.processState = 'failed';
      if (error === 'Error parsing XML') {
        state.form.error = 'rss';
      } else {
        state.form.error = 'network';
      }
    });
};
