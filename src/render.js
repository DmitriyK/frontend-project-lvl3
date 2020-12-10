const containerFeeds = document.querySelector('.feeds');
const containerPosts = document.querySelector('.posts');

const renderFeeds = (feeds) => {
  containerFeeds.innerHTML = '';
  const rowTitleFeeds = document.createElement('h2');
  rowTitleFeeds.innerHTML = 'Feeds';
  const listFeeds = document.createElement('ul');
  listFeeds.classList.add('list-group', 'mb-5');
  feeds.forEach((feed) => {
    const itemFeed = document.createElement('li');
    itemFeed.classList.add('list-group-item');
    const titleFeed = document.createElement('h3');
    titleFeed.innerHTML = feed.title;
    itemFeed.append(titleFeed);
    const descriptionFeed = document.createElement('p');
    descriptionFeed.innerHTML = feed.description;
    itemFeed.append(descriptionFeed);
    listFeeds.append(itemFeed);
  });
  containerFeeds.append(rowTitleFeeds);
  containerFeeds.append(listFeeds);
};

const renderPosts = (posts) => {
  containerPosts.innerHTML = '';
  const rowTitle = document.createElement('h2');
  rowTitle.innerHTML = 'Posts';
  const list = document.createElement('ul');
  list.classList.add('list-group');
  posts.forEach((post) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    const link = document.createElement('a');
    link.setAttribute('href', `${post.link}`);
    link.innerHTML = post.title;
    item.append(link);
    list.append(item);
  });
  containerPosts.append(rowTitle);
  containerPosts.append(list);
};

export default ({ feeds, posts }, type) => {
  switch (type) {
    case 'add':
      renderFeeds(feeds);
      renderPosts(posts);
      break;
    case 'update':
      renderPosts(posts);
      break;
    default:
      break;
  }
};
