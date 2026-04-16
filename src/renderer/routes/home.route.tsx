import { lazy } from 'react';

import { DefaultLayout } from '@/renderer/layouts/DefaultLayout';
import { HOME_PAGE } from '@/shared/definitions/constants/route-pages.const';
import { EUserRole } from '@/shared/definitions/enums/shared.enum';

const HomePage = lazy(() =>
  import('@/renderer/pages/HomePage').then((module) => ({
    default: module.HomePage,
  })),
);

export default {
  children: [
    {
      element: <HomePage />,
      index: true,
    },
  ],
  element: <DefaultLayout />,
  meta: {
    requiresAuth: false,
    roles: [
      EUserRole.Admin,
      EUserRole.Moderator,
      EUserRole.SuperAdmin,
      EUserRole.User,
    ],
    title: 'Home',
  },
  path: HOME_PAGE,
};
