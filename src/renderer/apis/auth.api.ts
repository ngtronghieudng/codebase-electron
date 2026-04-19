import type {
  IAuthLoginRequest,
  IAuthLoginResponse,
  IAuthRegisterRequest,
} from '@/renderer/definitions/interfaces/auth.interface';

import { AUTH_API } from '@/renderer/definitions/constants/route-apis.const';
import { IUserInfo } from '@/renderer/definitions/interfaces/shared.interface';
import { get, post } from '@/renderer/libs/axios/axios.util';

export const authLoginApi = async (data: IAuthLoginRequest) => {
  const url = AUTH_API.LOGIN;
  return await post<IAuthLoginResponse>(url, data, { withCredentials: true });
};

export const authMeApi = async () => {
  const url = AUTH_API.ME;
  return await get<IUserInfo>(url);
};

export const authRefreshTokenApi = async () => {
  const url = AUTH_API.REFRESH_TOKEN;
  return await post<IAuthLoginResponse>(url, undefined, {
    withCredentials: true,
  });
};

export const authRegisterApi = async (data: IAuthRegisterRequest) => {
  const url = AUTH_API.REGISTER;
  return await post<unknown>(url, data);
};
