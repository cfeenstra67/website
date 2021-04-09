import Head from 'next/head'

import Date from '../../components/date'
import Layout from '../../components/layout'
import Markdown from '../../components/markdown'
import Config from '../../lib/config'
import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData, config }) {
  return (
    <Layout config={config}>
      <Head>
        <title>{postData.title} - {config.MY_NAME}</title>
      </Head>

      <header className={`${utilStyles.headingXl} ${utilStyles.centered}`}>
        {postData.title}
      </header>

      <Date dateString={postData.date} />

      <section>
        <Markdown htmlContent={postData.contentHtml} />
      </section>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData,
      config: Config()
    }
  }
}
