import Link from 'next/link'

import styles from './navbar.module.css'

export default function NavBar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.title}>
        <Link href="/"><a className={styles.title}>Cam Feenstra</a></Link>
      </div>

      <Link href="/">
        <a className={styles.navLink}>
          <div className={styles.navbarItem}>About Me</div>
        </a>
      </Link>


      <Link href="/posts">
        <a className={styles.navLink}>
          <div className={styles.navbarItem}>Blog Posts</div>
        </a>
      </Link>

      <Link href="/quotes">
        <a className={styles.navLink}>
          <div className={styles.navbarItem}>Quotes</div>
        </a>
      </Link>

      <Link href="/contact">
        <a className={styles.navLink}>
          <div className={styles.navbarItem}>Contact</div>
        </a>
      </Link>

      <Link href="#">
        <a className={styles.navLink}>
          <div className={`${styles.navbarItem} ${styles.mailingListItem}`}>Join my Mailing List</div>
        </a>
      </Link>
    </div>
  )
}
