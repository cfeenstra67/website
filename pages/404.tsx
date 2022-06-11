import Head from 'next/head';

import Layout from '../components/Layout';
import Config from '../lib/config';

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
        <h1>Page Not Found</h1>
      </header>

      <section>
        <h3>
          Try navigating to a different page.
        </h3>
      </section>
    </Layout>
  );
}
