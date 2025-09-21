import { useNavigate } from 'react-router';

import { BaseButton } from '@/renderer/components/shared/BaseButton';
import { HOME_PAGE } from '@/shared/definitions/constants/route-pages.const';

export const ErrorLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
        <div className="text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v3.75m0 3.75h.007M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="mb-2 text-xl font-semibold text-gray-800">
            Something went wrong
          </p>

          <p className="mb-6 text-gray-500">
            We’re sorry for the inconvenience. Please try again or go back.
          </p>

          <div className="flex-center gap-3">
            <BaseButton onClick={() => window.location.reload()}>
              Try again
            </BaseButton>

            <BaseButton onClick={() => navigate(HOME_PAGE)} type="default">
              Go back
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  );
};
