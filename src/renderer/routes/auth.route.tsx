import { GuestLayout } from '@/renderer/layouts/GuestLayout';
import { AuthLoginPage } from '@/renderer/pages/auth/AuthLoginPage';
import { AuthRegisterPage } from '@/renderer/pages/auth/AuthRegisterPage';
import { AUTH_PAGE } from '@/shared/definitions/constants/route-pages.const';

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
