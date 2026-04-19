import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import jsCookie from 'js-cookie';
import { stringify } from 'qs';
import store2 from 'store2';

import {
  COOKIE_KEYS,
  STORAGE_KEYS,
} from '@/renderer/definitions/constants/shared.const';
import {
  TFailureResponse,
  TSuccessResponse,
} from '@/renderer/definitions/types/shared.type';
import { handleUnauthorizedError } from '@/renderer/libs/axios/axios.util';
import {
  convertToCamelCase,
  convertToSnakeCase,
} from '@/renderer/utils/convert.util';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => stringify(params, { indices: true }),
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store2.get(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const csrftoken = jsCookie.get(COOKIE_KEYS.CSRF_TOKEN);
    if (csrftoken) {
      config.headers['x-csrftoken'] = csrftoken;
    }

    if (config.params) {
      config.params = convertToSnakeCase(config.params);
    }
    if (config.data && !(config.data instanceof FormData)) {
      config.data = convertToSnakeCase(config.data);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<TSuccessResponse>) => {
    if (response.data) {
      response.data = convertToCamelCase(response.data);
    }
    return response;
  },
  async (error: AxiosError<TFailureResponse>) => {
    const statusCode = error.response?.status;
    if (statusCode === HttpStatusCode.Unauthorized) {
      return await handleUnauthorizedError(error);
    }

    return Promise.reject(error);
  },
);
