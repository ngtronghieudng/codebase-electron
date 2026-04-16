import { ErrorLayout } from '@/renderer/layouts/ErrorLayout';

export default {
  element: <ErrorLayout />,
  meta: {
    requiresAuth: false,
    roles: [],
    title: 'Page Not Found',
  },
  path: '*',
};
