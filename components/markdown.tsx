import styles from '../styles/Markdown.module.css';

export default function Markdown({ htmlContent }) {
  return (
    <div
      className={styles.markdownContent}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    ></div>
  );
}
