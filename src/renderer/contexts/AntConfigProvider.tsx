import {
  theme as antTheme,
  ConfigProvider,
  ConfigProviderProps,
  type ThemeConfig,
} from 'antd';
import { App } from 'antd';
import enUS from 'antd/locale/en_US';
import { useState } from 'react';

import { ROOT_THEME } from '@/renderer/definitions/constants/style-themes.const';
import { useTheme } from '@/renderer/hooks/shared/use-theme';

interface IProps {
  children: React.ReactNode;
}

type TLocale = ConfigProviderProps['locale'];

export const AntConfigProvider: React.FC<IProps> = ({ children }) => {
  const { getThemeColor, isDark } = useTheme();

  const [locale, _setLocale] = useState<TLocale>(enUS);

  const themeConfig: ThemeConfig = {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    components: {
      Button: {
        primaryShadow: '',
      },
      Layout: {
        headerHeight: '75px',
      },
      Menu: {
        darkItemBg: ROOT_THEME.BLUE_950,
        itemSelectedBg: ROOT_THEME.PRIMARY,
        itemSelectedColor: ROOT_THEME.WHITE,
      },
      Table: {
        borderColor: getThemeColor('BORDER'),
      },
    },
    cssVar: false,
    hashed: false,
    token: {
      colorBgContainer: getThemeColor('BACKGROUND_CONTAINER'),
      colorBgElevated: getThemeColor('BACKGROUND_ELEVATED'),
      colorBorder: getThemeColor('BORDER'),
      colorPrimary: ROOT_THEME.PRIMARY,
      colorText: getThemeColor('TEXT'),
      colorTextPlaceholder: getThemeColor('TEXT_PLACEHOLDER'),
    },
  };

  return (
    <ConfigProvider locale={locale} theme={themeConfig}>
      <App>{children}</App>
    </ConfigProvider>
  );
};
