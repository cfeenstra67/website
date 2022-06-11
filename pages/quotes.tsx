import Head from 'next/head';

import Layout from '../components/Layout';
import Markdown from '../components/Markdown';
import Config from '../lib/config';
import { getMarkdownContent, markdownToHtml } from '../lib/content';
import utilStyles from '../styles/utils.module.css';

export async function getStaticProps() {
  const quotesMd = getMarkdownContent('quotes');
  const quotesHtml = await markdownToHtml(quotesMd);
  return {
    props: {
      quotesHtml,
      config: Config(),
    },
  };
}

export default function Quotes({ quotesHtml, config }) {
  return (
    <Layout config={config}>
      <Head>
        <title>Quotes - {config.MY_NAME}</title>
        <meta
          name="description"
          content="List of some interesting quotes I've gathered."
        />
      </Head>

      <header>
        <h1 className={utilStyles.headingXl}>Quotes</h1>
      </header>

      <section>
        <Markdown htmlContent={quotesHtml} />
      </section>
    </Layout>
  );
}
