const patt = /<!\[CDATA\[(.*)\]\]>/gm;

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const feed = {
    title: doc.querySelector('title').innerHTML.replace(patt, '$1'),
    description: doc.querySelector('description').innerHTML.replace(patt, '$1'),
    link: doc.querySelector('link').innerHTML.replace(patt, '$1'),
  };

  const items = doc.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const title = item.querySelector('title').innerHTML.replace(patt, '$1');
    const link = item.querySelector('link').innerHTML.replace(patt, '$1');
    const description = item.querySelector('description').innerHTML.replace(patt, '$1');
    return { title, link, description };
  });

  return {
    feed,
    posts,
  };
};
