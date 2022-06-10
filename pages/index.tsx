import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/Date'
import Layout from '../components/Layout'
import Markdown from '../components/Markdown'
import Config from '../lib/config'
import utilStyles from '../styles/utils.module.css'

import { getSortedPostsData } from '../lib/posts'
import { getMarkdownContent, getDataFromMarkdown } from '../lib/content'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const introMd = getMarkdownContent('intro')
  const intro = await getDataFromMarkdown(introMd)
  return {
    props: {
      allPostsData,
      intro,
      config: Config()
    }
  }
}

export default function Home({ allPostsData, intro, config }) {
  return (
    <Layout config={config}>
      <Head>
        <title key="title">About Me - {config.MY_NAME}</title>
        <meta name="og:title" content={`About Me - ${config.MY_NAME}`} key="metatitle" />
        <meta
          name="description"
          content="A quick introduction to me."
          key="description"
        />
      </Head>

      <header>
        <h1 className={utilStyles.headingXl}>{intro.title}</h1>
      </header>

      <section>
        <Markdown htmlContent={intro.contentHtml} />
      </section>

    </Layout>
  )
}
