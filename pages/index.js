import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout, { siteTitle, myName } from '../components/layout'
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

      <section className={utilStyles.headingMd} dangerouslySetInnerHTML={{ __html: intro.contentHtml }} />

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
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
