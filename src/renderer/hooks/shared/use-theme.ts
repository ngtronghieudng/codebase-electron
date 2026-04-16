import { useEffect, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { STORAGE_KEYS } from '@/shared/definitions/constants/shared.const';
import {
  DARK_THEME,
  LIGHT_THEME,
} from '@/shared/definitions/constants/style-themes.const';
import { TThemeMode } from '@/shared/definitions/types/shared.type';

interface ICustomTheme {
  dark?: string;
  light?: string;
}

type TColorName = keyof typeof DARK_THEME & keyof typeof LIGHT_THEME;

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<TThemeMode>(
    STORAGE_KEYS.THEME,
    'system',
  );

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  }, [theme]);

  const getThemeColor = (colorName: TColorName, customTheme?: ICustomTheme) => {
    if (customTheme && customTheme[resolvedTheme]) {
      return customTheme[resolvedTheme];
    }

    const themeColor: ICustomTheme = {
      dark: DARK_THEME[colorName],
      light: LIGHT_THEME[colorName],
    };
    return themeColor[resolvedTheme];
  };

  useEffect(() => {
    if (document) {
      document.documentElement.setAttribute('data-theme', resolvedTheme);
    }
  }, [theme]);

  return {
    getThemeColor,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    setTheme,
    theme,
  };
};
