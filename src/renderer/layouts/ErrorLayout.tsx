import { Result } from 'antd';
import { FallbackProps } from 'react-error-boundary';
import { useNavigate } from 'react-router';

import { BaseButton } from '@/renderer/components/shared/BaseButton';
import { HOME_PAGE } from '@/shared/definitions/constants/route-pages.const';

type TProps = Partial<FallbackProps>;

export const ErrorLayout: React.FC<TProps> = ({ resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (resetErrorBoundary) resetErrorBoundary();
    else window.location.reload();
  };

  return (
    <div className="flex-center min-h-screen p-4">
      <Result
        extra={[
          <BaseButton key="retry" onClick={handleRetry}>
            Try again
          </BaseButton>,
          <BaseButton
            key="home"
            onClick={() => navigate(HOME_PAGE)}
            type="default"
          >
            Go back
          </BaseButton>,
        ]}
        status="error"
        subTitle="We're sorry for the inconvenience. Please try again or go back."
        title="Something went wrong"
      />
    </div>
  );
};
