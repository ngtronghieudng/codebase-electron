import store2 from 'store2';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { authProfileApi, authRefreshTokenApi } from '@/renderer/apis/auth.api';
import { STORAGE_KEYS } from '@/shared/definitions/constants/shared.const';
import { IUserInfo } from '@/shared/definitions/interfaces/shared.interface';

interface IState {
  accessToken: null | string;
  initialize: () => Promise<void>;
  isAuthenticated: boolean;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  setToken: (token: string) => void;
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
      } catch (_error) {
        console.error('Auth initialization failed');
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
        get().setToken(response.data.accessToken);
      } catch (_error) {
        result = false;
        console.error('Token refresh failed');
      }
      return result;
    },

    setToken: (token: string) => {
      store2.set(STORAGE_KEYS.ACCESS_TOKEN, token);
      set({ accessToken: token });
    },

    setUser: (data: IUserInfo) =>
      set({ isAuthenticated: true, userInfo: data }),

    userInfo: undefined as IUserInfo,
  })),
);
