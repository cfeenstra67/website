import Head from 'next/head'
import Link from 'next/link'

import Date from '../../components/date'
import Layout from '../../components/layout'
import Markdown from '../../components/markdown'
import Config from '../../lib/config'
import { getMarkdownContent, markdownToHtml } from '../../lib/content'
import { getSortedPostsData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const postsIntroMd = getMarkdownContent('posts-intro')
  const postsIntroHtml = await markdownToHtml(postsIntroMd)
  return {
    props: {
      allPostsData,
      postsIntroHtml,
      config: Config()
    }
  }
}

export default function Posts({ allPostsData, postsIntroHtml, config }) {
  return (
    <Layout config={config}>
      <Head>
        <title key="title">Blog Posts - {config.MY_NAME}</title>
        <meta name="og:title" content={`Blog Posts - ${config.MY_NAME}`} key="metatitle" />
        <meta
          name="description"
          content="List of blog posts I've written about topics that interest me."
          key="description"
        />
      </Head>

      <header>
        <h1 className={utilStyles.headingXl}>Blog Posts</h1>
      </header>

      <section>
        <Markdown htmlContent={postsIntroHtml} />
      </section>

      <section className={utilStyles.headingMd}>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
              {title}
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
