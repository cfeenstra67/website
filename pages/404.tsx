import Head from 'next/head';

import Layout from '../components/Layout';
import Config from '../lib/config';
import utilStyles from '../styles/utils.module.css';

export async function getStaticProps() {
  return {
    props: {
      config: Config(),
    },
  };
}

export default function Custom404({ config }) {
  return (
    <Layout config={config}>
      <Head>
        <title key="title">Page Not Found - {config.MY_NAME}</title>
        <meta
          className="og:title"
          content={`Page Not Found - ${config.MY_NAME}`}
          key="metatitle"
        />
        <meta
          name="description"
          content="No page was found for the given URL."
          key="description"
        />
      </Head>

      <header>
        <h1 className={utilStyles.heading2Xl}>Page Not Found</h1>
      </header>

      <section className={utilStyles.headingMd}>
        Try navigating to a different page.
      </section>
    </Layout>
  );
}
