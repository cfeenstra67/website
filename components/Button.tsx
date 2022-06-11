import styles from '../styles/Button.module.css';

export interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function Button({ onClick, children }: ButtonProps) {
  return <div className={styles.button}>{children}</div>;
}
