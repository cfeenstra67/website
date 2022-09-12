import { atom, computed } from 'nanostores';
import Cookies from 'universal-cookie';
import styles from '../styles/themes.module.css';

export enum Theme {
  Auto = 'Auto',
  Primary = 'Primary',
  Dark = 'Dark',
}

export const themeClasses: Record<Theme, string> = {
  [Theme.Auto]: `${styles.primaryThemeAuto} ${styles.darkThemeAuto}`,
  [Theme.Primary]: styles.primaryTheme as string,
  [Theme.Dark]: styles.darkTheme as string,
};

export const currentTheme = atom(Theme.Auto);

export const currentThemeClass = computed(
  currentTheme,
  (theme) => themeClasses[theme]
);

export const cookieName = 'theme';

export function synchronizeThemeCookie(): void {
  const cookies = new Cookies();
  const currentValue = cookies.get(cookieName);
  if (currentValue) {
    currentTheme.set(currentValue);
  }

  currentTheme.subscribe((theme) => {
    cookies.set(cookieName, theme, { path: '/' });
  });
}
