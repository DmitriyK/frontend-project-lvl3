import i18next from 'i18next';

const renderPosts = ({ posts, watchedPosts }) => {
  const containerPosts = document.querySelector('#rss-posts');
  containerPosts.innerHTML = '';
  const titleList = document.createElement('h4');
  titleList.classList.add('mb-3');
  titleList.textContent = i18next.t('title.posts');
  const list = document.createElement('ul');
  list.classList.add('list-group', 'mb-5');
  containerPosts.prepend(titleList);
  posts.forEach(({
    title, id, link,
  }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    const a = document.createElement('a');
    const active = (watchedPosts.includes(id)) ? 'font-weight-normal' : 'font-weight-bold';
    a.classList.add(active);
    a.setAttribute('data-id-post', id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('href', link);
    a.textContent = title;
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#modalPost');
    button.setAttribute('data-id', id);
    button.textContent = 'Preview';
    li.prepend(a);
    li.append(button);
    list.append(li);
  });
  containerPosts.append(list);
};

const renderFeeds = ({ feeds }) => {
  const containerFeeds = document.querySelector('#rss-feeds');
  containerFeeds.innerHTML = '';
  const titleList = document.createElement('h4');
  titleList.classList.add('mb-3');
  titleList.textContent = i18next.t('title.feeds');
  const list = document.createElement('ul');
  list.classList.add('list-group', 'mb-5');
  containerFeeds.prepend(titleList);
  feeds.forEach(({
    title, id, description,
  }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id-feed', id);
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    p.textContent = description;
    li.prepend(h3);
    li.append(p);
    list.append(li);
  });
  containerFeeds.append(list);
};

const renderModal = ({ modal }) => {
  const a = document.querySelector(`a[data-id-post="${modal.id}"]`);
  a.classList.remove('font-weight-bold');
  a.classList.add('font-weight-normal');
  const modalPost = document.querySelector('#modalPost');
  const title = modalPost.querySelector('.modal-title');
  const description = modalPost.querySelector('.modal-body');
  const fullArticle = modalPost.querySelector('.full-article');
  title.textContent = modal.title;
  description.textContent = modal.description;
  fullArticle.setAttribute('href', modal.link);
};

const typeRender = {
  feeds: renderFeeds,
  posts: renderPosts,
  modal: renderModal,
};

export default (type, data) => typeRender[type](data);
