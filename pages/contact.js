import Head from 'next/head'

import Layout, { myName } from '../components/layout'
import { getMarkdownContent, markdownToHtml } from '../lib/content'
import utilStyles from '../styles/utils.module.css'

export async function getStaticProps() {
  const contactMd = getMarkdownContent('contact')
  const contactHtml = await markdownToHtml(contactMd)
  return {
    props: {
      contactHtml
    }
  }
}

export default function Contact({ contactHtml }) {
  return (
    <Layout>
      <Head>
        <title>Quotes - {myName}</title>
      </Head>

      <header className={utilStyles.headingXl}>Contact</header>

      <section className={utilStyles.headingMd} dangerouslySetInnerHTML={{ __html: contactHtml }} />
    </Layout>
  )
}
