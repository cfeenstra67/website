import Layout from '../components/layout'
import Config from '../lib/config'
import utilStyles from '../styles/utils.module.css'

export async function getStaticProps() {
  return {
    props: {
      config: Config()
    }
  }
}

export default function Custom404({ config }) {
  return (
    <Layout config={config}>
      <header className={utilStyles.heading2Xl}>Page Not Found</header>

      <section className={utilStyles.headingMd}>Try navigating to a different page.</section>
    </Layout>
  )
}
