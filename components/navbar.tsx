import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Theme } from '../lib/theme';
import styles from '../styles/Navbar.module.css'
import ThemePicker from './ThemePicker';

export interface NavBarProps {
  config: any;
  theme: Theme;
  setTheme?: (theme: Theme) => void;
}

export default function NavBar({ config, theme, setTheme }: NavBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.navBar}>
      <div className={styles.menuIcon} onClick={() => setExpanded(!expanded)} />
      
      <div className={styles.title}>
        <span>Cam Feenstra</span>
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

      <ThemePicker className={styles.themePicker} theme={theme} setTheme={setTheme} />
    </div>
  )
}
