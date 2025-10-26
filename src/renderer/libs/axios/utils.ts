import {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  isAxiosError,
} from 'axios';

import type {
  TFailureResponse,
  TSuccessResponse,
} from '@/shared/definitions/types/shared.type';

import { axiosInstance } from '@/renderer/libs/axios/configs';
import { useAuthStore } from '@/renderer/stores/auth.store';
import { AUTH_PAGE } from '@/shared/definitions/constants/route-pages.const';
import { ERROR_CODES } from '@/shared/definitions/constants/shared.const';
import { EResponseStatus } from '@/shared/definitions/enums/shared.enum';

interface IAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

type TMethods = 'delete' | 'get' | 'patch' | 'post' | 'put';

const request = async <D = unknown, M = unknown>(
  method: TMethods,
  url: string,
  data: unknown,
  config?: AxiosRequestConfig,
) => {
  try {
    let response: AxiosResponse<TSuccessResponse<D, M>>;

    if (method === 'get' || method === 'delete') {
      response = await axiosInstance[method](url, config);
    } else {
      response = await axiosInstance[method](url, data, config);
    }

    const result: TSuccessResponse<D, M> = {
      data: response.data.data,
      meta: response.data.meta,
      status: EResponseStatus.Success,
      statusCode: response.status,
    };
    return result;
  } catch (error) {
    let errorCode = ERROR_CODES.ERR_500;
    let errorData = null;
    let errorMessage = 'An error occurred';
    let statusCode = 500;

    if (isAxiosError<TFailureResponse>(error)) {
      errorCode = error.response?.data.error.code || errorCode;
      errorData = error.response?.data.error.data || errorData;
      errorMessage = error.response?.data.error.message || errorMessage;
      statusCode = error.response?.status || statusCode;
    }

    const result: TFailureResponse = {
      error: {
        code: errorCode,
        data: errorData,
        message: errorMessage,
      },
      status: EResponseStatus.Failure,
      statusCode,
    };
    return Promise.reject(result);
  }
};

export const del = async <D = unknown, M = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  return await request<D, M>('delete', url, undefined, config);
};

export const get = async <D = unknown, M = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  return await request<D, M>('get', url, undefined, config);
};

export const handleUnauthorizedError = async (
  error: AxiosError<TFailureResponse>,
) => {
  const isTokenRefreshed = await useAuthStore.getState().refreshToken();
  const accessToken = useAuthStore.getState().accessToken;
  if (!isTokenRefreshed || !accessToken) {
    useAuthStore.getState().logout();
    window.location.href = AUTH_PAGE.LOGIN;
    return Promise.reject(error);
  }

  const originalRequest = error.config as IAxiosRequestConfig;
  if (!originalRequest) return Promise.reject(error);

  if (!originalRequest.headers) originalRequest.headers = {};
  originalRequest.headers.Authorization = `Bearer ${accessToken}`;

  if (!originalRequest._retry) {
    originalRequest._retry = true;
    return await axiosInstance(originalRequest);
  }

  return Promise.reject(error);
};

export const patch = async <D = unknown, M = unknown>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig,
) => {
  return await request<D, M>('patch', url, data, config);
};

export const post = async <D = unknown, M = unknown>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig,
) => {
  return await request<D, M>('post', url, data, config);
};

export const put = async <D = unknown, M = unknown>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig,
) => {
  return await request<D, M>('put', url, data, config);
};
