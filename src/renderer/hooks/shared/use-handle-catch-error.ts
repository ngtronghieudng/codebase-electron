import { camelCase } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import { EToast } from '@/renderer/definitions/enums/shared.enum';
import { TFailureResponse } from '@/renderer/definitions/types/shared.type';
import { logger } from '@/renderer/utils/logger.util';
import { showToast } from '@/renderer/utils/notification.util';
import { isFailureResponse } from '@/renderer/utils/shared.util';

export const useHandleCatchError = () => {
  const { t } = useTranslation();

  const handleCatchError = <D>(error: unknown) => {
    switch (true) {
      case isFailureResponse(error as TFailureResponse<D>): {
        const errorProp = error as TFailureResponse<D>;
        const errorData = errorProp.error.data;
        const errorCode = camelCase(errorProp.error.code);
        const translatedMessage = t(`shared.errorCodes.${errorCode}`);
        const errorMessage =
          translatedMessage !== String(errorCode)
            ? translatedMessage
            : errorProp.error.message;

        showToast(errorMessage, EToast.Error);
        return errorData;
      }

      case error instanceof Error:
        showToast(error.message, EToast.Error);
        break;

      default:
        logger.error('Unhandled error', error);
    }
  };

  return { handleCatchError };
};
