import { useMutation } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { authLoginApi, authRegisterApi } from '@/renderer/apis/auth.api';
import { useHandleCatchError } from '@/renderer/hooks/shared/use-handle-catch-error';
import { useAuthStore } from '@/renderer/stores/auth.store';
import {
  AUTH_PAGE,
  HOME_PAGE,
} from '@/shared/definitions/constants/route-pages.const';
import {
  IAuthLoginRequest,
  IAuthRegisterRequest,
} from '@/shared/definitions/interfaces/auth.interface';

export const useAuthLoginMutation = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const { handleCatchError } = useHandleCatchError();

  return useMutation({
    mutationFn: async (data: IAuthLoginRequest) => {
      const response = await authLoginApi(data);
      return response.data;
    },
    onError: (error) => {
      handleCatchError(error);
    },
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      await navigate(HOME_PAGE);
    },
  });
};

export const useAuthRegisterMutation = (
  registerForm: UseFormReturn<IAuthRegisterRequest>,
) => {
  const navigate = useNavigate();
  const { handleCatchError } = useHandleCatchError();

  return useMutation({
    mutationFn: async (data: IAuthRegisterRequest) => {
      const response = await authRegisterApi(data);
      return response.data;
    },
    onError: (error) => {
      const errorData = handleCatchError<{
        fields: (keyof IAuthRegisterRequest)[];
      }>(error);
      if (errorData?.fields)
        errorData.fields.forEach((field) => {
          registerForm.setError(field, {
            message: `${field} is already taken`,
            type: 'manual',
          });
        });
    },
    onSuccess: async () => {
      await navigate(AUTH_PAGE.LOGIN);
    },
  });
};
