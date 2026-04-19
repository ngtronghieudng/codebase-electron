import { lazy } from 'react';

import { CODEBASE_PAGE } from '@/renderer/definitions/constants/route-pages.const';
import { NODE_ENVS } from '@/renderer/definitions/constants/shared.const';
import { DefaultLayout } from '@/renderer/layouts/DefaultLayout';
import { ErrorLayout } from '@/renderer/layouts/ErrorLayout';

const isDevelopment = import.meta.env.VITE_NODE_ENV === NODE_ENVS.DEVELOPMENT;

const CodebasePage = lazy(() =>
  import('@/renderer/pages/CodebasePage').then((module) => ({
    default: module.CodebasePage,
  })),
);

export default {
  children: [
    {
      element: <CodebasePage />,
      index: true,
    },
  ],
  element: isDevelopment ? <DefaultLayout /> : <ErrorLayout />,
  meta: {
    requiresAuth: false,
    roles: [],
    title: 'Codebase',
  },
  path: CODEBASE_PAGE,
};
