import { lazy } from 'react';

import { GuestLayout } from '@/renderer/layouts/GuestLayout';
import { AUTH_PAGE } from '@/shared/definitions/constants/route-pages.const';

const AuthLoginPage = lazy(() =>
  import('@/renderer/pages/auth/AuthLoginPage').then((module) => ({
    default: module.AuthLoginPage,
  })),
);

const AuthRegisterPage = lazy(() =>
  import('@/renderer/pages/auth/AuthRegisterPage').then((module) => ({
    default: module.AuthRegisterPage,
  })),
);

export default {
  children: [
    {
      element: <AuthLoginPage />,
      path: AUTH_PAGE.LOGIN,
    },
    {
      element: <AuthRegisterPage />,
      path: AUTH_PAGE.REGISTER,
    },
  ],

  element: <GuestLayout />,

  meta: {
    requiresAuth: false,
    roles: [],
    title: 'Authentication',
  },

  path: AUTH_PAGE.ROOT,
};
