import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { STORAGE_KEYS } from '@/shared/definitions/constants/shared.const';
import {
  DARK_THEME,
  LIGHT_THEME,
} from '@/shared/definitions/constants/style-themes.const';

interface ICustomTheme {
  dark?: string;
  light?: string;
}

type TColorName = keyof typeof DARK_THEME & keyof typeof LIGHT_THEME;
type TTheme = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<TTheme>(
    STORAGE_KEYS.THEME,
    'light',
  );

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  const getThemeColor = (colorName: TColorName, customTheme?: ICustomTheme) => {
    if (customTheme && customTheme[theme]) return customTheme[theme];

    const themeColor: ICustomTheme = {
      dark: DARK_THEME[colorName],
      light: LIGHT_THEME[colorName],
    };
    return themeColor[theme];
  };

  useEffect(() => {
    if (document) document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return {
    getThemeColor,
    isDark,
    isLight,
    setTheme,
    theme,
  };
};
