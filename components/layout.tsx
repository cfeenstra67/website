import Head from 'next/head'
import Link from 'next/link'

import Navbar from './Navbar';
import { useTheme } from '../lib/theme';

export default function Layout({ children, config }) {
  const siteTitle = `${config.MY_NAME} - Personal Website`

  const { theme, setTheme, themeClassName } = useTheme();

  return (
    <>
      <Head>
        {/*<link rel="icon" href="/images/generated/icon.png" />*/}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta name="og:title" content={siteTitle} key="metatitle" />
        <title key="title">{siteTitle}</title>
        <meta name="description" content="Cam Feenstra's personal website." key="description"/>

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

      <div className={`layout ${themeClassName}`}>
        <Navbar theme={theme} setTheme={setTheme} config={config} />
        <div className="content">
          {children}
        </div>
      </div>
    </>
  )
}
