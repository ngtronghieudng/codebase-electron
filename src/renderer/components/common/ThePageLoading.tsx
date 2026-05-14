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
      <Skeleton.Node active className="block !h-screen !w-screen">
        <div />
      </Skeleton.Node>
    </div>
  );
};
