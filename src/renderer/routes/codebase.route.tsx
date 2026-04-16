import { lazy } from 'react';

import { DefaultLayout } from '@/renderer/layouts/DefaultLayout';
import { ErrorLayout } from '@/renderer/layouts/ErrorLayout';
import { CODEBASE_PAGE } from '@/shared/definitions/constants/route-pages.const';
import { NODE_ENVS } from '@/shared/definitions/constants/shared.const';

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
