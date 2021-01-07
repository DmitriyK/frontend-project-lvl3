const containerFeeds = document.querySelector('#rss-feeds');
const containerPosts = document.querySelector('#rss-posts');

const modal = document.querySelector('#myModal');
const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-body');
const fullArticle = modal.querySelector('.full-article');

const createColumn = (container, title) => {
  const titleList = document.createElement('h4');
  titleList.classList.add('mb-3');
  titleList.innerHTML = `${title}`;
  const list = document.createElement('ul');
  list.classList.add('list-group', 'mb-5');
  container.prepend(titleList);
  container.append(list);
};

const renderFeed = ({ title, description, id }) => {
  if (containerFeeds.innerHTML === '') {
    createColumn(containerFeeds, 'Feed');
  }
  if (containerFeeds.innerHTML !== '') {
    const list = containerFeeds.querySelector('ul');
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id-feed', `${id}`);
    li.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
    list.prepend(li);
  }
};

const renderPosts = (posts) => {
  if (containerPosts.innerHTML === '') {
    createColumn(containerPosts, 'Posts');
  }
  if (containerPosts.innerHTML !== '') {
    const list = containerPosts.querySelector('ul');
    posts.reverse().forEach(({
      title, link, id, idFeed,
    }) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
      li.setAttribute('data-id-feed', `${idFeed}`);
      li.innerHTML = `
        <a href=${link} class="font-weight-bold" data-id-post="${id}" target="_blank" rel="noopener noreferrer">${title}</a>
        <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal" data-id="${id}">
          Preview
        </button>
      `;
      list.prepend(li);
    });
  }
};

const renderModal = ({ posts, idCurrentPost }) => {
  const a = document.querySelector(`a[data-id-post="${idCurrentPost}"]`);
  a.classList.remove('font-weight-bold');
  a.classList.add('font-weight-normal');
  const post = posts.find(({ id }) => id === idCurrentPost);
  const { title, description, link } = post;
  modalTitle.innerHTML = title;
  modalDescription.innerHTML = description;
  fullArticle.setAttribute('href', `${link}`);
};

const typeRender = {
  feed: renderFeed,
  posts: renderPosts,
  modal: renderModal,
};

export default (type, data) => typeRender[type](data);
