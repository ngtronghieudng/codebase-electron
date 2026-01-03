import { Avatar, Badge, MenuProps } from 'antd';
import { Bell, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router';

import IconEnglish from '@/renderer/assets/icons/shared/IconEnglish.svg?react';
import IconJapanese from '@/renderer/assets/icons/shared/IconJapanese.svg?react';
import IconVietnamese from '@/renderer/assets/icons/shared/IconVietnamese.svg?react';
import styles from '@/renderer/assets/styles/components/shared/the-topbar.module.scss';
import { BaseDropdown } from '@/renderer/components/shared/BaseDropdown';
import { BaseLucideIcon } from '@/renderer/components/shared/BaseLucideIcon';
import { TheBreadcrumb } from '@/renderer/components/shared/TheBreadcrumb';
import { useLanguage } from '@/renderer/hooks/shared/use-language';
import { useTheme } from '@/renderer/hooks/shared/use-theme';
import { notifications } from '@/renderer/mocks/the-topbar.mock';
import { useAuthStore } from '@/renderer/stores/auth.store';
import { AUTH_PAGE } from '@/shared/definitions/constants/route-pages.const';
import { ELanguageCode } from '@/shared/definitions/enums/shared.enum';

export const TheTopbar: React.FC = () => {
  const { getThemeColor, isDark, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const i18nOptions = Object.entries(ELanguageCode).map(([key, value]) => ({
    label: key,
    value,
  }));

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
        label: <p>Clear All</p>,
      },
    ],
  };

  const getIconPathForLanguage = (lang: ELanguageCode) => {
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
        <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
          {getIconPathForLanguage(item.value)}
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

  const renderIcon = () => {
    return (
      <BaseLucideIcon
        color={getThemeColor('ICON_SVG')}
        icon={isDark ? Sun : Moon}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
      />
    );
  };

  return (
    <div className={styles.container}>
      <section className="flex-center">
        <TheBreadcrumb />
      </section>

      <section className={styles.containerMenu}>
        {renderIcon()}

        <BaseDropdown menu={languageMenu}>
          <span>{getIconPathForLanguage(language)}</span>
        </BaseDropdown>

        <BaseDropdown menu={notificationMenu}>
          <Badge count={notifications.length}>
            <BaseLucideIcon color={getThemeColor('ICON_SVG')} icon={Bell} />
          </Badge>
        </BaseDropdown>

        <BaseDropdown
          menu={{
            items: [
              { key: 'profile', label: 'Profile' },
              { key: 'settings', label: 'Settings' },
              { type: 'divider' },
              { key: 'logout', label: 'Logout', onClick: () => handleLogout() },
            ],
          }}
        >
          <Avatar className="cursor-pointer">H</Avatar>
        </BaseDropdown>
      </section>
    </div>
  );
};
