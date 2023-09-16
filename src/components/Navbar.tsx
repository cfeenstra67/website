import { useState } from 'react';
import config from '../lib/config';
import styles from '../styles/Navbar.module.css';
import ThemePicker from './ThemePicker';

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`${styles.navBar} ${expanded ? styles.navBarExpanded : ''}`}
    >
      <div className={styles.menuIcon} onClick={() => setExpanded(!expanded)} />

      <div className={styles.title}>
        <a href="/">Cam Feenstra</a>
      </div>

      {/*<Navbar.Toggle aria-controls="site-nav" />*/}

      <div id="site-nav" className={styles.navBarItems}>
        <a href="/posts">Blog Posts</a>

        <a href="/projects">Projects</a>

        <a href="/quotes">Quotes</a>

        <a href="/contact">Contact</a>

        <div>
          <a
            href={config.JOIN_MAILING_LIST_URL}
            target="_blank"
            className="nav-link"
            rel="noreferrer"
          >
            Join my Mailing List
          </a>
        </div>
      </div>

      <ThemePicker className={styles.themePicker} />
    </div>
  );
}
