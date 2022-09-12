import { useCallback } from 'react';
import { Theme } from '../lib/theme';
import { useTheme, useIsDark } from '../lib/theme-hook';
import styles from '../styles/ThemePicker.module.css';

export interface ThemePickerProps {
  className?: string;
}

export default function ThemePicker({ className }: ThemePickerProps) {
  const { theme, setTheme } = useTheme();
  const isDark = useIsDark();

  const onClick = useCallback(() => {
    switch (theme) {
      case Theme.Dark:
        setTheme(Theme.Primary);
        break;
      case Theme.Primary:
        setTheme(Theme.Dark);
        break;
      case Theme.Auto:
        setTheme(isDark ? Theme.Primary : Theme.Dark);
        break;
    }
  }, [theme, setTheme]);

  return (
    <div className={`${styles.themePicker} ${className}`} onClick={onClick} />
  );
}
