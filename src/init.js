import Feed from './app.js';

export default () => {
  const form = document.getElementById('rssForm');
  const feed = new Feed(form);
  feed.init();
};
