import Head from 'next/head';

import Layout from '../components/Layout';
import Markdown from '../components/Markdown';
import Config from '../lib/config';
import { getMarkdownContent, markdownToHtml } from '../lib/content';

export async function getStaticProps() {
  const contactMd = await getMarkdownContent('contact');
  const contactHtml = await markdownToHtml(contactMd);
  return {
    props: {
      contactHtml,
      config: Config(),
    },
  };
}

export default function Contact({ contactHtml, config }) {
  return (
    <Layout config={config}>
      <Head>
        <title key="title">Quotes - {config.MY_NAME}</title>
        <meta
          name="og:title"
          content={`Quotes - ${config.MY_NAME}`}
          key="metatitle"
        />
        <meta
          name="description"
          content="Contact and social media information."
          key="description"
        />
      </Head>

      <header>
        <h1>Contact</h1>
      </header>

      <section>
        <h3>
          <Markdown htmlContent={contactHtml} />
        </h3>
      </section>
    </Layout>
  );
}
