import Head from 'next/head'

import Layout, { myName } from '../components/layout'
import { getMarkdownContent, markdownToHtml } from '../lib/content'
import utilStyles from '../styles/utils.module.css'

export async function getStaticProps() {
  const quotesMd = getMarkdownContent('quotes')
  const quotesHtml = await markdownToHtml(quotesMd)
  return {
    props: {
      quotesHtml
    }
  }
}

export default function Quotes({ quotesHtml }) {
  return (
    <Layout>
      <Head>
        <title>Quotes - {myName}</title>
      </Head>

      <header className={utilStyles.headingXl}>Quotes</header>

      <section dangerouslySetInnerHTML={{ __html: quotesHtml }} />
    </Layout>
  )
}
