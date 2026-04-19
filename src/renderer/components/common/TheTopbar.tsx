import { Avatar, Badge, MenuProps } from 'antd';
import { Bell, Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import IconEnglish from '@/renderer/assets/icons/shared/IconEnglish.svg?react';
import IconJapanese from '@/renderer/assets/icons/shared/IconJapanese.svg?react';
import IconVietnamese from '@/renderer/assets/icons/shared/IconVietnamese.svg?react';
import { BaseDropdown } from '@/renderer/components/common/BaseDropdown';
import { BaseLucideIcon } from '@/renderer/components/common/BaseLucideIcon';
import { TheBreadcrumb } from '@/renderer/components/common/TheBreadcrumb';
import { AUTH_PAGE } from '@/renderer/definitions/constants/route-pages.const';
import { ELanguageCode } from '@/renderer/definitions/enums/shared.enum';
import { useLanguage } from '@/renderer/hooks/shared/use-language';
import { useTheme } from '@/renderer/hooks/shared/use-theme';
import { notifications } from '@/renderer/mocks/the-topbar.mock';
import { useAuthStore } from '@/renderer/stores/auth.store';

import styles from './TheTopbar.module.scss';

export const TheTopbar: React.FC = () => {
  const { t } = useTranslation();
  const { getThemeColor, setTheme, theme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const i18nOptions = Object.entries(ELanguageCode).map(([key, value]) => ({
    label: key,
    value,
  }));

  const themeMenu: MenuProps = {
    items: [
      {
        key: 'system',
        label: (
          <div className="flex items-center gap-2">
            <BaseLucideIcon icon={Monitor} size={16} />
            <p>{t('shared.theme.system')}</p>
          </div>
        ),
        onClick: () => setTheme('system'),
      },
      {
        key: 'light',
        label: (
          <div className="flex items-center gap-2">
            <BaseLucideIcon icon={Sun} size={16} />
            <p>{t('shared.theme.light')}</p>
          </div>
        ),
        onClick: () => setTheme('light'),
      },
      {
        key: 'dark',
        label: (
          <div className="flex items-center gap-2">
            <BaseLucideIcon icon={Moon} size={16} />
            <p>{t('shared.theme.dark')}</p>
          </div>
        ),
        onClick: () => setTheme('dark'),
      },
    ],
  };

  const notificationMenu: MenuProps = {
    items: [
      ...notifications.map((notification) => ({
        key: notification.id,
        label: (
          <>
            <p>{notification.message}</p>
            <p>{notification.time}</p>
          </>
        ),
      })),
      {
        key: 'clear-all',
        label: <p>{t('shared.clearAll')}</p>,
      },
    ],
  };

  const getThemeIcon = () => {
    if (theme === 'dark') {
      return <Moon />;
    }
    if (theme === 'light') {
      return <Sun />;
    }
    return <Monitor />;
  };

  const getLanguageIcon = (lang: ELanguageCode) => {
    const iconPaths = {
      [ELanguageCode.English]: <IconEnglish />,
      [ELanguageCode.Japanese]: <IconJapanese />,
      [ELanguageCode.Vietnamese]: <IconVietnamese />,
    };
    return iconPaths[lang];
  };

  const languageMenu: MenuProps = {
    items: i18nOptions.map((item) => ({
      key: item.value,
      label: (
        <div className="flex items-center gap-2">
          {getLanguageIcon(item.value)}
          <p>{item.label}</p>
        </div>
      ),
      onClick: () => setLanguage(item.value),
    })),
  };

  const handleLogout = async () => {
    logout();
    await navigate(AUTH_PAGE.LOGIN);
  };

  return (
    <section className={styles.container}>
      <div className="flex-center">
        <TheBreadcrumb />
      </div>

      <div className={styles.containerMenu}>
        <BaseDropdown className="cursor-pointer" menu={themeMenu}>
          <span>{getThemeIcon()}</span>
        </BaseDropdown>

        <BaseDropdown className="cursor-pointer" menu={languageMenu}>
          <span>{getLanguageIcon(language)}</span>
        </BaseDropdown>

        <BaseDropdown className="cursor-pointer" menu={notificationMenu}>
          <Badge count={notifications.length}>
            <BaseLucideIcon color={getThemeColor('ICON_SVG')} icon={Bell} />
          </Badge>
        </BaseDropdown>

        <BaseDropdown
          className="cursor-pointer"
          menu={{
            items: [
              { key: 'profile', label: 'Profile' },
              { key: 'settings', label: 'Settings' },
              { type: 'divider' },
              { key: 'logout', label: 'Logout', onClick: () => handleLogout() },
            ],
          }}
        >
          <Avatar>H</Avatar>
        </BaseDropdown>
      </div>
    </section>
  );
};
