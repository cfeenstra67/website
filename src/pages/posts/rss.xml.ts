import rss from '@astrojs/rss';
import { getPostId } from '../../lib/content-utils';

const postsImport = import.meta.glob('../../../content/posts/*.md', { eager: true });
const posts = Object.values(postsImport);
const sortedPosts = posts.sort((a, b) => {
  return a.frontmatter.date > b.frontmatter.date ? -1 : 1;
});

export const get = () => rss({
  title: `Cam Feenstra's Blog`,
  description: `List of blog posts I've written about topics that interest me.`,
  site: import.meta.env.SITE,
  items: sortedPosts.map((post) => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    pubDate: post.frontmatter.date,
    link: `/posts/${getPostId(post.file)}`,
  })),
});
