import { Skeleton } from 'antd';

export const ThePageLoading: React.FC = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page"
      aria-live="polite"
      className="fixed inset-0 z-[9999]"
      role="status"
    >
      <Skeleton.Node
        active
        style={{ display: 'block', height: '100vh', width: '100vw' }}
      >
        <div />
      </Skeleton.Node>
    </div>
  );
};
