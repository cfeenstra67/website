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
        <title>Blog Posts - {config.MY_NAME}</title>
      </Head>

      <header className={utilStyles.headingXl}>Blog Posts</header>

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
