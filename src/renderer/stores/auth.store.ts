import store2 from 'store2';
import { devtools } from 'zustand/middleware';

import { authMeApi, authRefreshTokenApi } from '@/renderer/apis/auth.api';
import { STORAGE_KEYS } from '@/renderer/definitions/constants/shared.const';
import { IUserInfo } from '@/renderer/definitions/interfaces/shared.interface';
import { create, resetAllStores } from '@/renderer/libs/zustand/zustand.util';
import { logger } from '@/renderer/utils/logger.util';

interface IState {
  accessToken: null | string;
  initialize: () => Promise<void>;
  isAuthenticated: boolean;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  setAccessToken: (token: string) => void;
  setUser: (data: IUserInfo) => void;
  userInfo?: IUserInfo;
}

export const useAuthStore = create<IState>()(
  devtools((set, get) => ({
    accessToken: store2.get(STORAGE_KEYS.ACCESS_TOKEN),
    initialize: async () => {
      if (get().isAuthenticated) {
        return;
      }

      const isLoggedIn = Boolean(get().accessToken);
      if (!isLoggedIn) {
        return;
      }

      try {
        const response = await authMeApi();
        get().setUser(response.data);
      } catch (error) {
        logger.error('Auth initialization failed', error);
      }
    },
    isAuthenticated: false,
    logout: () => {
      store2.remove(STORAGE_KEYS.ACCESS_TOKEN);
      resetAllStores();
    },
    refreshToken: async (): Promise<boolean> => {
      let result = true;
      try {
        const response = await authRefreshTokenApi();
        get().setAccessToken(response.data.accessToken);
      } catch (error) {
        logger.error('Token refresh failed', error);
        result = false;
      }
      return result;
    },
    setAccessToken: (token: string) => {
      store2.set(STORAGE_KEYS.ACCESS_TOKEN, token);
      set({ accessToken: token });
    },
    setUser: (data: IUserInfo) => {
      set({ isAuthenticated: true, userInfo: data });
    },
    userInfo: undefined,
  })),
);
