import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';

import IconDashboard from '@/renderer/assets/icons/shared/IconDashboard.svg?react';
import IconFolderShared from '@/renderer/assets/icons/shared/IconFolderShared.svg?react';
import IconLogo from '@/renderer/assets/icons/shared/IconLogo.svg?react';
import IconSettings from '@/renderer/assets/icons/shared/IconSettings.svg?react';
import styles from '@/renderer/assets/styles/components/shared/the-sidebar.module.scss';
import { useTheme } from '@/renderer/hooks/shared/use-theme';
import { useThemeColor } from '@/renderer/hooks/shared/use-theme-color';
import {
  AUTH_PAGE,
  CODEBASE_PAGE,
  HOME_PAGE,
} from '@/shared/definitions/constants/route-pages.const';
import { ROOT_THEME } from '@/shared/definitions/constants/theme-colors.const';

export const TheSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { getThemeColor } = useThemeColor();

  const menuItems = [
    {
      icon: <IconDashboard fill={getThemeColor('ICON_SVG')} />,
      key: AUTH_PAGE.LOGIN,
      label: t('shared.navigator.login'),
    },
    {
      icon: <IconSettings fill={getThemeColor('ICON_SVG')} />,
      key: AUTH_PAGE.REGISTER,
      label: t('shared.navigator.register'),
    },
    {
      icon: (
        <IconFolderShared
          fill={getThemeColor('ICON_SVG', {
            dark: ROOT_THEME.WHITE,
            light:
              location.pathname === CODEBASE_PAGE
                ? ROOT_THEME.WHITE
                : ROOT_THEME.BLACK,
          })}
        />
      ),
      key: CODEBASE_PAGE,
      label: t('shared.navigator.codebase'),
    },
  ];
  const selectedKey =
    menuItems.find((item) => item.key === location.pathname)?.key || '';

  return (
    <div className={styles.container}>
      <div className={styles.containerLogo}>
        <Link to={HOME_PAGE}>
          <IconLogo />
        </Link>
      </div>

      <Menu
        items={menuItems.map((item) => ({
          icon: item.icon,
          key: item.key,
          label: item.label,
        }))}
        mode="inline"
        onClick={({ key }) => navigate(key)}
        selectedKeys={[selectedKey]}
        theme={isDark ? 'dark' : 'light'}
      />
    </div>
  );
};
