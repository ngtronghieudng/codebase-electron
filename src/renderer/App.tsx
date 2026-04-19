import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { HashRouter } from 'react-router';

import { TheLoading } from '@/renderer/components/common/TheLoading';
import { AntConfigProvider } from '@/renderer/contexts/AntConfigProvider';
import { logger } from '@/renderer/utils/logger.util';

import { AppRoutes } from './AppRoutes';
import { ErrorLayout } from './layouts/ErrorLayout';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  const handleError = (error: Error, info: React.ErrorInfo) => {
    logger.error('ErrorBoundary caught an error:', error, info.componentStack);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AntConfigProvider>
        <ErrorBoundary
          FallbackComponent={ErrorLayout as React.ComponentType<FallbackProps>}
          onError={handleError}
        >
          <TheLoading />

          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </ErrorBoundary>
      </AntConfigProvider>
    </QueryClientProvider>
  );
};
