import type {
  IAuthLoginRequest,
  IAuthLoginResponse,
  IAuthRegisterRequest,
} from '@/shared/definitions/interfaces/auth.interface';

import { get, post } from '@/renderer/libs/axios/axios.util';
import { AUTH_API } from '@/shared/definitions/constants/route-apis.const';
import { IUserInfo } from '@/shared/definitions/interfaces/shared.interface';

export const authLoginApi = async (data: IAuthLoginRequest) => {
  const url = AUTH_API.LOGIN;
  return await post<IAuthLoginResponse>(url, data, { withCredentials: true });
};

export const authProfileApi = async () => {
  const url = AUTH_API.PROFILE;
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
