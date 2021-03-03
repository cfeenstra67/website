import Head from 'next/head'
import Link from 'next/link'

import Date from '../../components/date'
import Layout, { myName } from '../../components/layout'
import { getSortedPostsData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Posts({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>Blog Posts - {myName}</title>
      </Head>

      <header className={utilStyles.headingXl}>Blog Posts</header>

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
