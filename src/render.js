const containerFeeds = document.querySelector('#rss-feeds');
const containerPosts = document.querySelector('#rss-posts');

const modal = document.querySelector('#myModal');
const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-body');
const fullArticle = modal.querySelector('.full-article');

const createColumn = (container, title) => {
  const titleList = document.createElement('h4');
  titleList.classList.add('mb-3');
  titleList.textContent = `${title}`;
  const list = document.createElement('ul');
  list.classList.add('list-group', 'mb-5');
  container.prepend(titleList);
  container.append(list);
};

const renderFeed = ({ title, description, id }) => {
  if (containerFeeds.textContent === '') {
    createColumn(containerFeeds, 'Feed');
  }
  if (containerFeeds.textContent !== '') {
    const list = containerFeeds.querySelector('ul');
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id-feed', `${id}`);
    const h3 = document.createElement('h3');
    h3.textContent = `${title}`;
    const p = document.createElement('p');
    p.textContent = `${description}`;
    li.prepend(h3);
    li.append(p);
    list.prepend(li);
  }
};

const renderPosts = (posts) => {
  if (containerPosts.textContent === '') {
    createColumn(containerPosts, 'Posts');
  }
  if (containerPosts.textContent !== '') {
    const list = containerPosts.querySelector('ul');
    const render = ({
      title, link, id, idFeed,
    }) => (
      `<li class="list-group-item d-flex justify-content-between align-items-start" data-id-feed="${idFeed}">
        <a href=${link} class="font-weight-bold" data-id-post="${id}" target="_blank" rel="noopener noreferrer">${title}</a>
        <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal" data-id="${id}">
          Preview
        </button>
      </li>`
    );
    list.insertAdjacentHTML('afterbegin', posts.map(render).join(''));
  }
};

const renderModal = ({ posts, idCurrentPost }) => {
  const a = document.querySelector(`a[data-id-post="${idCurrentPost}"]`);
  a.classList.remove('font-weight-bold');
  a.classList.add('font-weight-normal');
  const post = posts.find(({ id }) => id === idCurrentPost);
  const { title, description, link } = post;
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  fullArticle.setAttribute('href', `${link}`);
};

const typeRender = {
  feed: renderFeed,
  posts: renderPosts,
  modal: renderModal,
};

export default (type, data) => typeRender[type](data);
