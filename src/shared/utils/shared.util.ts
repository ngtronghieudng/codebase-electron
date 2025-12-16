import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { EResponseStatus } from '@/shared/definitions/enums/shared.enum';
import { TFailureResponse } from '@/shared/definitions/types/shared.type';

export const isFailureResponse = (
  response: Error | TFailureResponse,
): response is TFailureResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    response.status === EResponseStatus.Failure
  );
};

export const sleep = async (second: number) => {
  return await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      resolve();
      clearTimeout(timer);
    }, 1000 * second);
  });
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
