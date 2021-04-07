import Head from 'next/head'
import Link from 'next/link'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

import styles from './layout.module.css'
import NavBar from './navbar'
import utilStyles from '../styles/utils.module.css'

export const myName = 'Cam Feenstra'
export const siteTitle = `${myName} - Personal Website`

export default function Layout({ children }) {
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
      </Head>

      <NavBar />
      <Container>
        {children}
      </Container>
    </>
  )
}
