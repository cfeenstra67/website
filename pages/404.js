import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Custom404() {
  return (
    <Layout>
      <header className={utilStyles.heading2Xl}>Page Not Found</header>

      <section className={utilStyles.headingMd}>Try navigating to a different page.</section>
    </Layout>
  )
}
