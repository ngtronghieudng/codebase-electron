import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { stringify } from 'qs';

import { TDate, TObjectUnknown } from '@/shared/definitions/types/shared.type';

dayjs.extend(utc);

export const cleanQueryString = <T>(queryParams: TObjectUnknown): T => {
  const result = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== undefined && value !== '',
    ),
  );
  return result as T;
};

export const formatDateUTC = (date: TDate) => {
  return dayjs(date).utc().toISOString();
};

export const formatQueryString = (
  baseUrl: string,
  queryParams: string | string[] | TObjectUnknown,
): string => {
  if (
    !queryParams ||
    (Array.isArray(queryParams) && queryParams.length === 0) ||
    (typeof queryParams === 'object' && Object.keys(queryParams).length === 0)
  )
    return baseUrl;

  const queryString =
    typeof queryParams === 'string'
      ? queryParams
      : stringify(queryParams, { arrayFormat: 'brackets' });

  return `${baseUrl}?${queryString}`;
};
