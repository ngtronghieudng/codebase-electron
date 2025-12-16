import { HttpStatusCode } from 'axios';

import { ERROR_CODES } from '@/shared/definitions/constants/shared.const';
import { EResponseStatus } from '@/shared/definitions/enums/shared.enum';

export type TDate = Date | number | string;
export type TErrorCodes = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type TFailureResponse<D = unknown> = {
  error: {
    code: TErrorCodes;
    data: D;
    message: string;
  };
  status: EResponseStatus;
  statusCode: HttpStatusCode;
};

export type TKeyLabel<L = string> = {
  key: string;
  label: L;
};

export type TObjectBoolean = Record<string, boolean>;
export type TObjectNumber = Record<string, number>;
export type TObjectString = Record<string, string>;
export type TObjectUnknown = Record<string, unknown>;

export type TOptions<V = boolean | number | string | TObjectUnknown> = {
  key?: number | string;
  label: string;
  value: V;
};

export type TSuccessResponse<D = unknown, M = unknown> = {
  data: D;
  meta: M;
  status: EResponseStatus;
  statusCode: HttpStatusCode;
};
