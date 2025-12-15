import store2 from 'store2';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { authProfileApi, authRefreshTokenApi } from '@/renderer/apis/auth.api';
import { STORAGE_KEYS } from '@/shared/definitions/constants/shared.const';
import { IUserInfo } from '@/shared/definitions/interfaces/shared.interface';
import { logger } from '@/shared/utils/logger.util';

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
      if (get().isAuthenticated) return;

      const isLoggedIn = Boolean(get().accessToken);
      if (!isLoggedIn) return;

      try {
        const response = await authProfileApi();
        get().setUser(response.data);
      } catch (error) {
        logger.error('Auth initialization failed', error);
      }
    },

    isAuthenticated: false,

    logout: () => {
      set({
        accessToken: null,
        isAuthenticated: false,
        userInfo: undefined,
      });
      store2.remove(STORAGE_KEYS.ACCESS_TOKEN);
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

    userInfo: undefined as IUserInfo,
  })),
);
