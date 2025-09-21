import { ErrorLayout } from '@/renderer/layouts/ErrorLayout';
import { FORBIDDEN_PAGE } from '@/shared/definitions/constants/route-pages.const';

export default {
  element: <ErrorLayout />,

  meta: {
    requiresAuth: false,
    roles: [],
    title: 'Forbidden',
  },

  path: FORBIDDEN_PAGE,
};
