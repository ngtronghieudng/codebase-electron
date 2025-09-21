import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { STORAGE_KEYS } from '@/shared/definitions/constants/shared.const';

type TTheme = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<TTheme>(
    STORAGE_KEYS.THEME,
    'light',
  );

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  useEffect(() => {
    if (document) document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return {
    isDark,
    isLight,
    setTheme,
    theme,
  };
};
