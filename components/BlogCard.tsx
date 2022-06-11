import Link from 'next/link';

import Card from './Card';
import Date from './Date';
import styles from '../styles/BlogCard.module.css';

export interface BlogCardProps {
  id: string;
  title: string;
  date: string;
  description?: string;
}

export default function BlogCard({
  id,
  title,
  date,
  description,
}: BlogCardProps) {
  return (
    <Card className={styles.blogCard}>
      <Link href={`/posts/${id}`}>{title}</Link>
      <Date dateString={date} />
      {description && <span>{description}</span>}
    </Card>
  );
}
