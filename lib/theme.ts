import { useEffect, useState, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import styles from '../styles/themes.module.css';

export enum Theme {
  Primary = 'Primary',
  Dark = 'Dark',
}

export const themeClasses: Record<Theme, string> = {
  [Theme.Primary]: styles.primaryTheme,
  [Theme.Dark]: styles.darkTheme,
};

export function useTheme() {
  const key = 'theme';
  const [cookies, setCookie, removeCookie] = useCookies([key]);
  const [themeClassName, setThemeClassName] = useState('');

  const windowExists = typeof window !== 'undefined';

  const mediaQuery = useMemo(() => {
    if (windowExists) {
      return matchMedia('(prefers-color-scheme: dark)');
    }
    return null;
  }, [windowExists]);
  const [isDark, setIsDark] = useState<boolean | null>(
    mediaQuery?.matches ?? null
  );

  useEffect(() => {
    if (!mediaQuery) {
      return;
    }
    if (isDark === null) {
      setIsDark(mediaQuery.matches);
      return;
    }

    const handle = (evt: MediaQueryListEvent) => {
      setIsDark(evt.matches);
    };

    mediaQuery.addEventListener('change', handle);

    return () => {
      mediaQuery.removeEventListener('change', handle);
    };
  }, [mediaQuery, isDark, setIsDark]);

  let theme: Theme;
  if (cookies[key] !== undefined) {
    theme = cookies[key];
  } else {
    theme = isDark ? Theme.Dark : Theme.Primary;
  }

  // Keep class name in sync w/ class
  useEffect(() => {
    const newClassName = themeClasses[theme];
    if (newClassName !== themeClassName) {
      setThemeClassName(newClassName);
    }
  }, [theme, themeClassName]);

  function setTheme(theme: Theme): void {
    setCookie(key, theme);
  }

  return {
    theme,
    setTheme,
    themeClassName,
  };
}
