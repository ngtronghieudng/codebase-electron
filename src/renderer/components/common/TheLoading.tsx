import { useLoadingStore } from '@/renderer/stores/loading.store';

import { BaseSpin } from './BaseSpin';

export const TheLoading: React.FC = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <div aria-busy="true" aria-live="assertive" role="alert">
      <BaseSpin fullscreen={true} size="large" tip="Loading" />
    </div>
  );
};
