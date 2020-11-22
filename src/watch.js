import onChange from 'on-change';
// import render from './render';

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'rssForm.processState':
      console.log(path);
      console.log(value);
      console.log(state);
      break;
    case 'rssForm.valid':
      break;
    default:
      break;
  }
});
