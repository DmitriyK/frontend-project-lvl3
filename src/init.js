import Request from './request.js';

export default () => {
  const element = document.getElementById('rssForm');
  const obj = new Request(element);
  obj.init();
};
