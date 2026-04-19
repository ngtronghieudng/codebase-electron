import { FORBIDDEN_PAGE } from '@/renderer/definitions/constants/route-pages.const';
import { ErrorLayout } from '@/renderer/layouts/ErrorLayout';

export default {
  element: <ErrorLayout />,
  meta: {
    requiresAuth: false,
    roles: [],
    title: 'Forbidden',
  },
  path: FORBIDDEN_PAGE,
};
