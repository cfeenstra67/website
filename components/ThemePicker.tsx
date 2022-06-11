import Image from 'next/image';
import { useCallback } from 'react';
import { Theme } from '../lib/theme';
import styles from '../styles/ThemePicker.module.css';

export interface ThemeProps {
  theme: Theme;
  setTheme?: (theme: Theme) => void;
  className?: string;
}

export default function ThemePicker({
  theme,
  setTheme,
  className,
}: ThemeProps) {
  let url: string;
  switch (theme) {
    case Theme.Dark:
      url = '/icon/moon.svg';
    case Theme.Primary:
      url = '/icon/sun.svg';
  }

  const onClick = useCallback(() => {
    switch (theme) {
      case Theme.Dark:
        setTheme(Theme.Primary);
        break;
      case Theme.Primary:
        setTheme(Theme.Dark);
        break;
    }
  }, [theme]);

  return <div className={`${styles.themePicker} ${className}`} onClick={onClick} />;
  // return <Image
  //   className={styles.themePicker}
  //   src={url}
  //   width={18}
  //   height={18}
  //   onClick={onClick}
  //   style={{ cursor: 'pointer' }}
  // />
}
