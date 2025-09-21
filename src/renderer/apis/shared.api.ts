import { get } from '@/renderer/libs/axios/utils';
import { HEALTH_CHECK_API } from '@/shared/definitions/constants/route-apis.const';

export const healthCheckApi = async () => {
  const url = HEALTH_CHECK_API;
  return await get<unknown>(url);
};
