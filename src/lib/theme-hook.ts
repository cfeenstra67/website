import { useStore } from '@nanostores/preact';
import { useEffect, useState, useMemo } from 'react';
import { currentTheme, Theme, cookieName } from './theme';

export function useTheme() {
  const theme = useStore(currentTheme);

  function setTheme(newTheme: Theme): void {
    currentTheme.set(newTheme);
  }

  return {
    theme,
    setTheme,
  };
}

export function useIsDark() {
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

  return isDark;
}
