import Link from 'next/link';

import Card from './Card';
import Date from './Date';
import styles from '../styles/BlogCard.module.css';

export interface BlogCardProps {
  url: string;
  title: string;
  date: string;
  description?: string;
}

export default function BlogCard({
  url,
  title,
  date,
  description,
}: BlogCardProps) {
  return (
    <Card className={styles.blogCard}>
      <Link href={url}>{title}</Link>
      <Date dateString={date} />
      {description && <span>{description}</span>}
    </Card>
  );
}
