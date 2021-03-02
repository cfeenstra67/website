import Head from 'next/head'
import Link from 'next/link'

import styles from './layout.module.css'
import NavBar from './navbar'
import utilStyles from '../styles/utils.module.css'

const name = 'Cam Feenstra'
export const siteTitle = 'Cam Feenstra - Personal Website'

export default function Layout({ children, home }) {
  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.content}>
          <Head>
            <link rel="icon" href="/images/profile.jpg" />
            <meta
              name="description"
              content="Cam Feenstra's personal website."
            />
            <meta name="og:title" content={siteTitle} />
          </Head>
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}
