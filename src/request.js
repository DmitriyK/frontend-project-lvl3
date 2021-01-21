import { uniqueId, differenceBy } from 'lodash';
import axios from 'axios';
import parse from './parser.js';
import watch from './watch.js';

const corsUrl = 'https://cors-anywhere.herokuapp.com/';

const modefiedData = (posts, idFeed, countPosts) => {
  const modefiedPosts = posts.map((post, index) => {
    const id = countPosts + index + 1;
    const modefiedPost = { ...post, idFeed, id };
    return modefiedPost;
  });
  return modefiedPosts;
};

const makeRequest = (url) => axios.get(`${corsUrl}${url}`);

export const updateRequestsFeeds = (state) => {
  const updateInterval = 5000;
  const promises = state.urls.map((url) => makeRequest(url));
  const update = ({ data }) => {
    const { feed, posts } = parse(data);
    const currentFeed = state.feeds.find(({ link }) => link === feed.link);
    const newPosts = differenceBy(posts, state.posts, 'title');
    if (newPosts.length !== 0) {
      const modefiedPosts = modefiedData(newPosts, currentFeed.id, state.posts.length);
      state.posts.unshift(...modefiedPosts);
      watch(state).currentData = { posts: modefiedPosts };
    }
  };

  Promise.all(promises)
    .then((feeds) => {
      feeds.forEach(update);
    })
    .finally(() => setTimeout(() => updateRequestsFeeds(state), updateInterval));
};

export default (state) => {
  watch(state).processState = 'sending';
  makeRequest(state.currentUrl)
    .then(({ data }) => {
      const { feed, posts } = parse(data);
      const feedId = uniqueId();
      const modefiedFeed = { ...feed, id: feedId };
      const modefiedPosts = modefiedData(posts, feedId, state.posts.length);
      state.urls.push(state.currentUrl);
      state.feeds.unshift(modefiedFeed);
      state.posts.unshift(...modefiedPosts);
      watch(state).processState = 'success';
      watch(state).currentData = { feed: modefiedFeed, posts: modefiedPosts };
    })
    .catch((error) => {
      watch(state).processState = 'failed';
      if (error.message === 'Error parsing XML') {
        watch(state).error = 'rss';
      } else if (error.response.status === 500 || error.response.status === 429) {
        watch(state).error = 'server';
      } else {
        watch(state).error = 'rss';
      }
      throw error;
    });
};
