const patt = /<!\[CDATA\[(.*)\]\]>/gm;

export default (data, feedId, feedUrl) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const titleFeed = doc.querySelector('title').innerHTML.replace(patt, '$1');
  const descriptionFeed = doc.querySelector('description').innerHTML.replace(patt, '$1');
  const items = doc.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const titlePost = item.querySelector('title').innerHTML.replace(patt, '$1');
    const linkPost = item.querySelector('link').innerHTML.replace(patt, '$1');
    posts.push({ titlePost, linkPost, feedId });
  });
  return {
    feed: {
      titleFeed,
      descriptionFeed,
      feedId,
      feedUrl,
    },
    posts,
  };
};
