import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout, { siteTitle, myName } from '../components/layout'
import Markdown from '../components/markdown'
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
      intro
    }
  }
}

export default function Home({ allPostsData, intro }) {
  return (
    <Layout>
      <Head>
        <title>About Me - {myName}</title>
      </Head>

      <header className={utilStyles.headingXl}>{intro.title}</header>

      <section>
        <Markdown htmlContent={intro.contentHtml} />
      </section>

    </Layout>
  )
}
