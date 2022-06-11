import Head from 'next/head';
import Link from 'next/link';

import Button from '../../components/Button';
import Date from '../../components/Date';
import Layout from '../../components/Layout';
import Markdown from '../../components/Markdown';
import Config from '../../lib/config';
import { getAllPostIds, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';

export default function Post({ postData, config }) {
  return (
    <Layout config={config}>
      <Head>
        <title key="title">
          {postData.title} - {config.MY_NAME}
        </title>
        <meta
          name="og:title"
          content={`${postData.title} - ${config.MY_NAME}`}
          key="metatitle"
        />
        <meta
          name="description"
          content={postData.description}
          key="description"
        />
      </Head>

      <header className={utilStyles.marginTop}>
        <Button>
          <Link href="/posts">Back to Posts</Link>
        </Button>
      </header>

      <header>
        <h1 className={`${utilStyles.headingXl} ${utilStyles.centered}`}>
          {postData.title}
        </h1>
        {postData.subtitle && (
          <h3 className={`${utilStyles.headingMd} ${utilStyles.centered}`}>
            {postData.subtitle}
          </h3>
        )}
      </header>

      <span className={utilStyles.lightText}>
        <Date dateString={postData.date} />
      </span>

      <section>
        <Markdown htmlContent={postData.contentHtml} />
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds().map((id) => ({ params: { id } }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
      config: Config(),
    },
  };
}
