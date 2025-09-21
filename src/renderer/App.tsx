import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter } from 'react-router';

import { TheLoading } from '@/renderer/components/shared/TheLoading';
import { AntConfigProvider } from '@/renderer/contexts/AntConfigProvider';

import { AppRoutes } from './AppRoutes';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AntConfigProvider>
        <TheLoading />

        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AntConfigProvider>
    </QueryClientProvider>
  );
};
