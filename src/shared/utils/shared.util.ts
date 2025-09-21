import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { create, StateCreator } from 'zustand';

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

export const resetAll = <T>(stateCreator?: StateCreator<T>) => {
  const storeResetFns = new Set<() => void>();

  if (stateCreator) {
    const store = create(stateCreator);
    const initialState = store.getInitialState();
    storeResetFns.add(() => {
      store.setState(initialState, true);
    });
  }

  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
