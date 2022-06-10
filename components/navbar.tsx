import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import styles from './navbar.module.css'

export default function NavBar({ config }) {
  return (
    <Navbar bg="dark" variant="dark" expand="md" sticky="top">
      <Navbar.Brand href="/">
        <span className={styles.title}>Cam Feenstra</span>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="site-nav" />

      <Navbar.Collapse id="site-nav">
        <Nav>
          <Nav.Item>
            <Nav.Link href="/">About Me</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href="/posts">Blog Posts</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href="/quotes">Quotes</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href="/contact">Contact</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <a href={config.JOIN_MAILING_LIST_URL} target="_blank" className="nav-link">
              <div className={`${styles.mailingListItem}`}>Join my Mailing List</div>
            </a>
          </Nav.Item>

        </Nav>

      </Navbar.Collapse>

    </Navbar>
  )
}
