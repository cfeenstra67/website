import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import styles from '../styles/Navbar.module.css'

export default function NavBar({ config }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.navBar}>
      <div className={styles.title}>
        <span>Cam Feenstra</span>
        <div className={styles.menuIcon} onClick={() => setExpanded(!expanded)} />
      </div>

      {/*<Navbar.Toggle aria-controls="site-nav" />*/}

      <div
        id="site-nav"
        className={`${expanded ?  styles.navExpanded : ''} ${styles.navBarItems}`}
      >
        <Link href="/">About Me</Link>

        <Link href="/posts">Blog Posts</Link>

        <Link href="/quotes">Quotes</Link>

        <Link href="/contact">Contact</Link>

        <div>
          <a href={config.JOIN_MAILING_LIST_URL} target="_blank" className="nav-link">
            <div className={`${styles.mailingListItem}`}>Join my Mailing List</div>
          </a>
        </div>
      </div>

    </div>
  )
}
