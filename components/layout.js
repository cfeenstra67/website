import Head from 'next/head'
import Link from 'next/link'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

import styles from './layout.module.css'
import NavBar from './navbar'
import utilStyles from '../styles/utils.module.css'

export default function Layout({ children, config }) {
  const siteTitle = `${config.MY_NAME} - Personal Website`

  return (
    <>
      <Head>
        <link rel="icon" href="/images/generated/icon.png" />
        <meta
          name="description"
          content="Cam Feenstra's personal website."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta name="og:title" content={siteTitle} />

        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${config.GOOGLE_ANALYTICS_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${config.GOOGLE_ANALYTICS_MEASUREMENT_ID}');
        `,
          }}
        />

      </Head>

      <NavBar config={config} />
      <Container>
        {children}
      </Container>
    </>
  )
}
