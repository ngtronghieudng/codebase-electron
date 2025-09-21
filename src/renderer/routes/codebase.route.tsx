import { DefaultLayout } from '@/renderer/layouts/DefaultLayout';
import { ErrorLayout } from '@/renderer/layouts/ErrorLayout';
import { CodebasePage } from '@/renderer/pages/CodebasePage';
import { CODEBASE_PAGE } from '@/shared/definitions/constants/route-pages.const';
import { NODE_ENVS } from '@/shared/definitions/constants/shared.const';

const isDevelop = import.meta.env.VITE_NODE_ENV === NODE_ENVS.DEVELOP;

export default {
  children: [
    {
      element: <CodebasePage />,
      index: true,
    },
  ],

  element: isDevelop ? <DefaultLayout /> : <ErrorLayout />,

  meta: {
    requiresAuth: false,
    roles: [],
    title: 'Codebase',
  },

  path: CODEBASE_PAGE,
};
