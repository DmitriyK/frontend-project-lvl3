const containerFeeds = document.querySelector('.feeds');

const renderFeeds = (feeds) => {
  const rowTitleFeeds = document.createElement('h2');
  rowTitleFeeds.innerHTML = 'Feeds';
  const listFeeds = document.createElement('ul');
  listFeeds.classList.add('list-group', 'mb-5');
  feeds.forEach((feed) => {
    const itemFeed = document.createElement('li');
    itemFeed.classList.add('list-group-item');
    const titleFeed = document.createElement('h3');
    titleFeed.innerHTML = feed.titleFeed;
    itemFeed.append(titleFeed);
    const descriptionFeed = document.createElement('p');
    descriptionFeed.innerHTML = feed.descriptionFeed;
    itemFeed.append(descriptionFeed);
    listFeeds.append(itemFeed);
  });
  containerFeeds.append(rowTitleFeeds);
  containerFeeds.append(listFeeds);
};

const renderPosts = (posts) => {
  const rowTitlePosts = document.createElement('h2');
  rowTitlePosts.innerHTML = 'Posts';
  const listPosts = document.createElement('ul');
  listPosts.classList.add('list-group');
  posts.forEach((post) => {
    const itemPost = document.createElement('li');
    itemPost.classList.add('list-group-item');
    const linkPost = document.createElement('a');
    linkPost.setAttribute('href', `${post.linkPost}`);
    linkPost.innerHTML = post.titlePost;
    itemPost.append(linkPost);
    listPosts.append(itemPost);
  });
  containerFeeds.append(rowTitlePosts);
  containerFeeds.append(listPosts);
};

export default ({ feeds, posts }) => {
  containerFeeds.innerHTML = '';
  renderFeeds(feeds);
  renderPosts(posts);
};
