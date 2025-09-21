import { message, notification } from 'antd';
import { capitalize } from 'lodash-es';

import { EMessage, EToast } from '@/shared/definitions/enums/shared.enum';

export const showToast = (
  description: string,
  type: EToast = EToast.Success,
  message: string = capitalize(type),
) => {
  notification[type]({
    description,
    message,
  });
};

export const showMessage = (
  content: React.ReactNode,
  type: EMessage = EMessage.Success,
) => {
  message[type](content);
};
