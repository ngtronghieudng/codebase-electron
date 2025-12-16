import {
  DARK_THEME,
  LIGHT_THEME,
} from '@/shared/definitions/constants/style-themes.const';

import { useTheme } from './use-theme';

interface ICustomTheme {
  dark?: string;
  light?: string;
}

type TColorName = keyof typeof DARK_THEME & keyof typeof LIGHT_THEME;

export const useThemeColor = () => {
  const { theme } = useTheme();

  const getThemeColor = (colorName: TColorName, customTheme?: ICustomTheme) => {
    if (customTheme && customTheme[theme]) return customTheme[theme];

    const themeColorMap: ICustomTheme = {
      dark: DARK_THEME[colorName],
      light: LIGHT_THEME[colorName],
    };
    return themeColorMap[theme];
  };

  return { getThemeColor };
};
