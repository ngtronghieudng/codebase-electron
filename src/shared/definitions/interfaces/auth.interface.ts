import type {
  TAuthActions,
  TAuthSubjects,
} from '@/shared/definitions/types/auth.type';

export interface IAuthLoginRequest {
  email: string;
  password: string;
}

export interface IAuthLoginResponse {
  accessToken: string;
}

export interface IAuthPermission {
  action: TAuthActions;
  subject: TAuthSubjects;
}

export interface IAuthRegisterRequest {
  displayName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
}
