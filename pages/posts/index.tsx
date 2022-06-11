import Head from 'next/head';

import BlogCard from '../../components/BlogCard';
import Layout from '../../components/Layout';
import Markdown from '../../components/Markdown';
import { Config } from '../../lib/config';
import { getMarkdownContent, markdownToHtml } from '../../lib/content';
import { getSortedPostsData, Post } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';

export async function getStaticProps(): Promise<{ props: PostsProps }> {
  const allPostsData = getSortedPostsData();
  const postsIntroMd = getMarkdownContent('posts-intro');
  const postsIntroHtml = await markdownToHtml(postsIntroMd);
  return {
    props: {
      allPostsData,
      postsIntroHtml,
      config: Config(),
    },
  };
}

export interface PostsProps {
  allPostsData: Post[];
  postsIntroHtml: string;
  config: Config;
}

export default function Posts({
  allPostsData,
  postsIntroHtml,
  config,
}: PostsProps) {
  return (
    <Layout config={config}>
      <Head>
        <title key="title">Blog Posts - {config.MY_NAME}</title>
        <meta
          name="og:title"
          content={`Blog Posts - ${config.MY_NAME}`}
          key="metatitle"
        />
        <meta
          name="description"
          content="List of blog posts I've written about topics that interest me."
          key="description"
        />
      </Head>

      <header>
        <h1 className={utilStyles.headingXl}>Blog Posts</h1>
      </header>

      <section>
        <Markdown htmlContent={postsIntroHtml} />
      </section>

      <section className={utilStyles.headingMd}>
        {allPostsData.map(({ id, date, title, description }) => (
          <BlogCard
            key={id}
            id={id}
            title={title}
            date={date}
            description={description}
          />
        ))}
      </section>
    </Layout>
  );
}
