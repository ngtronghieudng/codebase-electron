import { Menu } from 'antd';
import { LayoutDashboard, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';

import IconFolderShared from '@/renderer/assets/icons/shared/IconFolderShared.svg?react';
import IconLogo from '@/renderer/assets/icons/shared/IconLogo.svg?react';
import { BaseLucideIcon } from '@/renderer/components/common/BaseLucideIcon';
import {
  AUTH_PAGE,
  CODEBASE_PAGE,
  HOME_PAGE,
} from '@/renderer/definitions/constants/route-pages.const';
import { ROOT_THEME } from '@/renderer/definitions/constants/style-themes.const';
import { useTheme } from '@/renderer/hooks/shared/use-theme';

import styles from './TheSidebar.module.scss';

export const TheSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { getThemeColor, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: (
        <BaseLucideIcon
          color={getThemeColor('ICON_SVG')}
          icon={LayoutDashboard}
        />
      ),
      key: AUTH_PAGE.LOGIN,
      label: t('shared.navigator.login'),
    },
    {
      icon: (
        <BaseLucideIcon color={getThemeColor('ICON_SVG')} icon={Settings} />
      ),
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
    <section className={styles.container}>
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
    </section>
  );
};
