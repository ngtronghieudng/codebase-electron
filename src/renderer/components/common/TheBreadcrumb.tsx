import { Breadcrumb } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import { HOME_PAGE } from '@/renderer/definitions/constants/route-pages.const';

export const TheBreadcrumb: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const pathNames = location.pathname.split('/').filter((item) => item);
  const items = [];

  if (pathNames.length > 0) {
    items.push({
      title: <Link to={HOME_PAGE}>{t('shared.navigator.home')}</Link>,
    });
  }

  pathNames.forEach((path, index) => {
    if (index === pathNames.length - 1) {
      items.push({
        title: <span>{t(`shared.navigator.${path}`)}</span>,
      });
      return;
    }

    items.push({
      title: <Link to={`/${path}`}>{t(`shared.navigator.${path}`)}</Link>,
    });
  });

  return <Breadcrumb items={items} />;
};
