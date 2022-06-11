import styles from '../styles/Card.module.css';

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Card({ children, className }: CardProps) {
  return <div className={`${styles.card} ${className || ''}`}>{children}</div>;
}
