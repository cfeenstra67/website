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
        <title key="title">{postData.title} - {config.MY_NAME}</title>
        <meta name="og:title" content={`${postData.title} - ${config.MY_NAME}`} key="metatitle" />
        <meta
          name="description"
          content={postData.description}
          key="description"
        />
      </Head>

      <header>
        <h1 className={`${utilStyles.headingXl} ${utilStyles.centered}`}>{postData.title}</h1>
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
