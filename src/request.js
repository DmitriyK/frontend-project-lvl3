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

export const updateRequestsFeeds = (state) => {
  const updateInterval = 5000;
  const promises = state.urls.map((url) => axios.get(`${corsUrl}${url}`));
  const update = ({ data }) => {
    const func = (post) => {
      const hasPost = state.posts.find(({ link }) => link === post.link);
      return hasPost ? null : post;
    };

    const { feed, posts } = parse(data);
    const hasFeed = state.feeds.find(({ link }) => link === feed.link);
    const newPosts = posts.map(func).filter((item) => item !== null);
    if (newPosts.length !== 0) {
      const modefiedPosts = modefiedData(newPosts, hasFeed.id, state.posts.length);
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
  axios.get(`${corsUrl}${state.currentUrl}`)
    .then(({ data }) => {
      const { feed, posts } = parse(data);
      const feedId = state.feeds.length + 1;
      const modefiedFeed = { ...feed, id: feedId };
      const modefiedPosts = modefiedData(posts, feedId, state.posts.length);
      state.urls.push(state.currentUrl);
      state.feeds.unshift(modefiedFeed);
      state.posts.unshift(...modefiedPosts);
      watch(state).processState = 'success';
      watch(state).currentData = { feed: modefiedFeed, posts: modefiedPosts };
      console.log(state.feeds);
      console.log(state.posts);
    })
    .catch((err) => {
      watch(state).error = 'request';
      watch(state).processState = 'failed';
      throw err;
    });
};
