import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout from '../components/layout'
import Markdown from '../components/markdown'
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
        <title>About Me - {config.MY_NAME}</title>
      </Head>

      <header className={utilStyles.headingXl}>{intro.title}</header>

      <section>
        <Markdown htmlContent={intro.contentHtml} />
      </section>

    </Layout>
  )
}
