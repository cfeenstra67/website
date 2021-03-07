import Head from 'next/head'
import Link from 'next/link'

import styles from './layout.module.css'
import NavBar from './navbar'
import utilStyles from '../styles/utils.module.css'

export const myName = 'Cam Feenstra'
export const siteTitle = `${myName} - Personal Website`

export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.content}>
          <Head>
            <link rel="icon" href="/images/generated/icon.png" />
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
