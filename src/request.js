import { uniqueId, differenceBy, has } from 'lodash';
import axios from 'axios';
import parse from './parser.js';

const corsUrl = 'https://hexlet-allorigins.herokuapp.com/raw?url=';

const addProxy = (url) => (url);

const makeRequest = (url) => axios.get(`${addProxy(corsUrl)}${url}`);

const getModefiedData = ({ feed, posts }) => {
  const idFeed = (!has(feed, 'id')) ? uniqueId('feed_') : feed.id;
  const modefiedFeed = { ...feed, id: idFeed };
  const modefiedPosts = posts.map((post) => {
    const id = (!has(post, 'id')) ? uniqueId('post_') : post.id;
    const watched = (!has(post, 'watched')) ? false : post.watched;
    return {
      ...post, idFeed, id, watched,
    };
  });
  return { feed: modefiedFeed, posts: modefiedPosts };
};

export const updateFeeds = (state) => {
  const updateInterval = 5000;
  const promises = state.urls.map((url) => makeRequest(url)
    .then(({ data }) => ({ result: 'success', data }))
    .catch((error) => ({ result: 'error', error })));
  const update = (data) => {
    const { feed, posts } = parse(data);
    const currentFeed = state.feeds.find(({ link }) => link === feed.link);
    const newPosts = differenceBy(posts, state.posts, 'link');
    if (newPosts.length !== 0) {
      const modefiedData = getModefiedData({ feed: currentFeed, posts: newPosts });
      state.posts.unshift(...modefiedData.posts);
    }
  };

  Promise.all(promises)
    .then((responses) => {
      responses.forEach((response) => {
        if (response.result === 'error') throw new Error(response.error);
        else update(response.data);
      });
    })
    .catch((error) => { throw error; })
    .finally(() => setTimeout(() => updateFeeds(state), updateInterval));
};

export default (state) => {
  state.form.processState = 'sending';
  makeRequest(state.form.url)
    .then(({ data }) => {
      state.form.processState = 'success';
      const parsedData = parse(data);
      const { feed, posts } = getModefiedData(parsedData);
      state.feeds.unshift(feed);
      state.posts.unshift(...posts);
      state.urls.unshift(state.form.url);
    })
    .catch((error) => {
      state.form.processState = 'failed';
      if (error.message === 'Error parsing XML') {
        state.form.error = 'rss';
      } else {
        state.form.error = 'server';
      }
      throw error;
    });
};
