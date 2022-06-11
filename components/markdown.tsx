import styles from '../styles/Markdown.module.css';
import { useHtmlReactComponent } from '../lib/content-client';

export default function Markdown({ htmlContent }) {
  const component = useHtmlReactComponent(htmlContent);
  return (
    <div className={styles.markdownContent}>
      {component}
    </div>
  );
}
