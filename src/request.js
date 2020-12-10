import axios from 'axios';
import parse from './parser.js';
import watch from './watch.js';

const corsUrl = 'https://cors-anywhere.herokuapp.com/';

export const updateRequestsFeeds = (state) => {
  const updateInterval = 5000;
  const promises = state.urls.map((url) => axios.get(`${corsUrl}${url}`));
  const update = ({ data }) => {
    const func = (post) => {
      const hasPost = state.posts.find(({ link }) => link === post.link);
      return hasPost ? null : post;
    };
    const { posts } = parse(data);
    const newPosts = posts.map(func).filter((item) => item !== null);
    watch(state).posts.unshift(...newPosts);
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
      state.urls.push(state.currentUrl);
      state.feeds.unshift(feed);
      state.posts.unshift(...posts);
      watch(state).processState = 'success';
      console.log(state);
    })
    .catch((err) => {
      watch(state).error = 'request';
      watch(state).processState = 'failed';
      throw err;
    });
};
