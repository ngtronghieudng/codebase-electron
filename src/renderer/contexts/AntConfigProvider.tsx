import {
  theme as antTheme,
  ConfigProvider,
  ConfigProviderProps,
  type ThemeConfig,
} from 'antd';
import { App as AntApp } from 'antd';
import enUS from 'antd/locale/en_US';
import { useState } from 'react';

import { useTheme } from '@/renderer/hooks/shared/use-theme';
import { useThemeColor } from '@/renderer/hooks/shared/use-theme-color';
import { ROOT_THEME } from '@/shared/definitions/constants/style-themes.const';

interface IProps {
  children: React.ReactNode;
}

type TLocale = ConfigProviderProps['locale'];

export const AntConfigProvider: React.FC<IProps> = ({ children }) => {
  const { isDark } = useTheme();
  const { getThemeColor } = useThemeColor();

  const [locale, _setLocale] = useState<TLocale>(enUS);

  const config: ThemeConfig = {
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
    <ConfigProvider locale={locale} theme={config}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
};
