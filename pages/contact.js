import Head from 'next/head'

import Layout from '../components/layout'
import Markdown from '../components/markdown'
import Config from '../lib/config'
import { getMarkdownContent, markdownToHtml } from '../lib/content'
import utilStyles from '../styles/utils.module.css'

export async function getStaticProps() {
  const contactMd = getMarkdownContent('contact')
  const contactHtml = await markdownToHtml(contactMd)
  return {
    props: {
      contactHtml,
      config: Config()
    }
  }
}

export default function Contact({ contactHtml, config }) {
  return (
    <Layout config={config}>
      <Head>
        <title>Quotes - {config.MY_NAME}</title>
      </Head>

      <header className={utilStyles.headingXl}>Contact</header>

      <section className={utilStyles.headingMd}>
        <Markdown htmlContent={contactHtml} />
      </section>
    </Layout>
  )
}
