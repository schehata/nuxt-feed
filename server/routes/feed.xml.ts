import { Feed } from "feed";
import { serverQueryContent } from "#content/server";
import { toHtml } from "hast-util-to-html";

const recursivelyPatchChildren = (node: any) => {
  if (node.type === "text") {
    return node;
  } else if (node.tag === "code" && node.props.language) {
    node.props.lang = node.props.language;
    node.children = [
      {
        type: "text",
        value: node.props.code,
      },
    ];
    delete node.props.language;
    delete node.props.code;
  }
  node.tagName = node.tag;
  node.properties = node.props;
  node.children = node.children.map(recursivelyPatchChildren);
  return node;
};

const defaultConfig = {
  id: 'rss',
  where: {published: true},
  sort: {date: -1},
  title: 'untitled',
  description: '',
  copyright: '',
  language: '',
  image: '',
  favicon: '',
  author: {}
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  // validate runtimeConfig.public.feed
  if(!runtimeConfig.public.feed) {
    throw new Error('nuxt-feed: runtimeConfig.public.feed is required but not found')
  }
  if (!runtimeConfig.public.feed.siteUrl) {
    throw new Error('nuxt-feed: runtimeConfig.public.feed.siteUrl is required')
  }
  if (!runtimeConfig.public.feed.title) {
    throw new Error('nuxt-feed: runtimeConfig.public.feed.title is required')
  }

  const config = { ...defaultConfig, ...runtimeConfig.public.feed}
  const feed = new Feed({
    id: config.id,
    title: config.title,
    description: config.description,
    link: config.siteUrl,
    copyright: config.copyright,
    language: config.language,
    author: config.author,
    image: config.image,
    favicon: config.favicon,
    updated: new Date(),
    feedLinks: [],
  });
  let docs = await serverQueryContent(event).where(config.where).sort(config.sort).find();
  if (typeof config.pathStartsWith) {
    docs = docs.filter(doc => doc._path.startsWith(config.pathStartsWith))
  }

  for (const doc of docs) {
    if (doc.body.children) {
      doc.body.children = doc.body.children.map(recursivelyPatchChildren);
    }
    doc.body.type = "node"
    doc.body.tagName = "div"
    if (!doc.body.children) {
      continue
    }
    const content = toHtml(doc.body.children, {
    });
    feed.addItem({
      id: doc._id,
      title: doc.title || 'Untitled',
      description: doc.description,
      link: new URL(doc._path!, config.siteUrl).href,
      content,
      date: new Date(doc.date),
      image: doc.image,
    });
  }

  return feed.rss2();
});
