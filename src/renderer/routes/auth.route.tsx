import { lazy } from 'react';

import { AUTH_PAGE } from '@/renderer/definitions/constants/route-pages.const';
import { GuestLayout } from '@/renderer/layouts/GuestLayout';

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
      meta: {
        guestOnly: true,
        requiresAuth: false,
        roles: [],
        title: 'Login',
      },
      path: AUTH_PAGE.LOGIN,
    },
    {
      element: <AuthRegisterPage />,
      meta: {
        guestOnly: true,
        requiresAuth: false,
        roles: [],
        title: 'Register',
      },
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
