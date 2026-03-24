import store2 from 'store2';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { authMeApi, authRefreshTokenApi } from '@/renderer/apis/auth.api';
import { resetAllStores } from '@/renderer/libs/zustand/zustand.util';
import { useAuthStore } from '@/renderer/stores/auth.store';
import { STORAGE_KEYS } from '@/shared/definitions/constants/shared.const';
import {
  EResponseStatus,
  EUserRole,
} from '@/shared/definitions/enums/shared.enum';
import { IUserInfo } from '@/shared/definitions/interfaces/shared.interface';

vi.mock('@/renderer/apis/auth.api', () => ({
  authMeApi: vi.fn(),
  authRefreshTokenApi: vi.fn(),
}));

vi.mock('@/renderer/libs/zustand/zustand.util', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('@/renderer/libs/zustand/zustand.util')
    >();

  return {
    ...actual,
    resetAllStores: vi.fn(),
  };
});

vi.mock('@/shared/utils/logger.util', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

const mockUserInfo: IUserInfo = {
  createdAt: '2026-01-01T00:00:00.000Z',
  displayName: 'Test User',
  email: 'test@example.com',
  id: 1,
  role: EUserRole.User,
  updatedAt: '2026-01-01T00:00:00.000Z',
  username: 'testuser',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store2.clearAll();
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
      userInfo: undefined,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();

      expect(state.accessToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.userInfo).toBeUndefined();
    });
  });

  describe('setAccessToken', () => {
    it('should set access token in state and storage', () => {
      const token = 'test-access-token';

      useAuthStore.getState().setAccessToken(token);

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe(token);
      expect(store2.get(STORAGE_KEYS.ACCESS_TOKEN)).toBe(token);
    });
  });

  describe('setUser', () => {
    it('should set user info and mark as authenticated', () => {
      useAuthStore.getState().setUser(mockUserInfo);

      const state = useAuthStore.getState();
      expect(state.userInfo).toEqual(mockUserInfo);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('should remove access token from storage and reset stores', () => {
      store2.set(STORAGE_KEYS.ACCESS_TOKEN, 'test-token');
      useAuthStore.setState({
        accessToken: 'test-token',
        isAuthenticated: true,
        userInfo: mockUserInfo,
      });

      useAuthStore.getState().logout();

      expect(store2.get(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
      expect(resetAllStores).toHaveBeenCalled();
    });
  });

  describe('initialize', () => {
    it('should skip initialization if already authenticated', async () => {
      useAuthStore.setState({ isAuthenticated: true });

      await useAuthStore.getState().initialize();

      expect(authMeApi).not.toHaveBeenCalled();
    });

    it('should skip initialization if no access token exists', async () => {
      useAuthStore.setState({ accessToken: null, isAuthenticated: false });

      await useAuthStore.getState().initialize();

      expect(authMeApi).not.toHaveBeenCalled();
    });

    it('should fetch user info when access token exists', async () => {
      useAuthStore.setState({
        accessToken: 'test-token',
        isAuthenticated: false,
      });
      vi.mocked(authMeApi).mockResolvedValueOnce({
        data: mockUserInfo,
        meta: undefined,
        status: EResponseStatus.Success,
        statusCode: 200,
      });

      await useAuthStore.getState().initialize();

      expect(authMeApi).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.userInfo).toEqual(mockUserInfo);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle initialization error gracefully', async () => {
      useAuthStore.setState({
        accessToken: 'test-token',
        isAuthenticated: false,
      });
      vi.mocked(authMeApi).mockRejectedValueOnce(new Error('API Error'));

      await useAuthStore.getState().initialize();

      expect(authMeApi).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const newToken = 'new-access-token';
      vi.mocked(authRefreshTokenApi).mockResolvedValueOnce({
        data: { accessToken: newToken },
        meta: undefined,
        status: EResponseStatus.Success,
        statusCode: 200,
      });

      const result = await useAuthStore.getState().refreshToken();

      expect(result).toBe(true);
      expect(authRefreshTokenApi).toHaveBeenCalled();
      expect(useAuthStore.getState().accessToken).toBe(newToken);
      expect(store2.get(STORAGE_KEYS.ACCESS_TOKEN)).toBe(newToken);
    });

    it('should return false when refresh fails', async () => {
      vi.mocked(authRefreshTokenApi).mockRejectedValueOnce(
        new Error('Refresh failed'),
      );

      const result = await useAuthStore.getState().refreshToken();

      expect(result).toBe(false);
      expect(authRefreshTokenApi).toHaveBeenCalled();
    });
  });
});
