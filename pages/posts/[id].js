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

      <h1 className={utilStyles.centered}>{postData.title}</h1>
      <Date dateString={postData.date} />
      <Markdown htmlContent={postData.contentHtml} />
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
