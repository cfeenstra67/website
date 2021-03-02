import Link from 'next/link'

import styles from './navbar.module.css'

export default function NavBar() {
  return (
    <div className={styles.navbar}>
      <div className={`${styles.navbarItem} ${styles.title}`}>
        <Link href="/"><a className={styles.title}>Cam Feenstra</a></Link>
      </div>
      <div className={styles.navbarItem}>First item</div>
      <div className={styles.navbarItem}>Second item</div>
      <div className={styles.navbarItem}>Third item</div>
    </div>
  )
}
