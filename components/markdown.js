import styles from './markdown.module.scss'

export default function Markdown({ htmlContent }) {
  return (
    <div className={styles.markdownContent} dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
  )
}
