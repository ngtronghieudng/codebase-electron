import { HEALTH_CHECK_API } from '@/renderer/definitions/constants/route-apis.const';
import { get } from '@/renderer/libs/axios/axios.util';

export const healthCheckApi = async () => {
  const url = HEALTH_CHECK_API;
  return await get<unknown>(url);
};
