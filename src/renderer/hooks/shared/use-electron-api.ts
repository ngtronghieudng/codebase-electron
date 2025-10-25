import { useCallback, useEffect, useState } from 'react';

import { logger } from '@/shared/utils/logger.util';

export const useElectronAPI = () => {
  const [appVersion, setAppVersion] = useState<string>('');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const getVersion = useCallback(async () => {
    try {
      const version =
        await window.electron.ipcRenderer.invoke('app:get-version');
      setAppVersion(version);
      return version;
    } catch (error) {
      logger.error('Failed to get app version:', error);
      return '';
    }
  }, []);

  const getPlatform = useCallback(async () => {
    try {
      return await window.electron.ipcRenderer.invoke('app:get-platform');
    } catch (error) {
      logger.error('Failed to get platform:', error);
      return null;
    }
  }, []);

  const minimizeWindow = useCallback(async () => {
    try {
      await window.electron.ipcRenderer.invoke('window:minimize');
    } catch (error) {
      logger.error('Failed to minimize window:', error);
    }
  }, []);

  const maximizeWindow = useCallback(async () => {
    try {
      await window.electron.ipcRenderer.invoke('window:maximize');
      const maximized = await window.electron.ipcRenderer.invoke(
        'window:is-maximized',
      );
      setIsMaximized(maximized);
    } catch (error) {
      logger.error('Failed to maximize window:', error);
    }
  }, []);

  const closeWindow = useCallback(async () => {
    try {
      await window.electron.ipcRenderer.invoke('window:close');
    } catch (error) {
      logger.error('Failed to close window:', error);
    }
  }, []);

  const checkIsMaximized = useCallback(async () => {
    try {
      const maximized = await window.electron.ipcRenderer.invoke(
        'window:is-maximized',
      );
      setIsMaximized(maximized);
      return maximized;
    } catch (error) {
      logger.error('Failed to check if maximized:', error);
      return false;
    }
  }, []);

  const openFileDialog = useCallback(
    async (options?: { filters?: Electron.FileFilter[]; title?: string }) => {
      try {
        return await window.electron.ipcRenderer.invoke(
          'file:open-dialog',
          options,
        );
      } catch (error) {
        logger.error('Failed to open file dialog:', error);
        return undefined;
      }
    },
    [],
  );

  const saveFileDialog = useCallback(
    async (options?: { defaultPath?: string; title?: string }) => {
      try {
        return await window.electron.ipcRenderer.invoke(
          'file:save-dialog',
          options,
        );
      } catch (error) {
        logger.error('Failed to open save dialog:', error);
        return undefined;
      }
    },
    [],
  );

  const getStoreValue = useCallback(async <T = unknown>(key: string) => {
    try {
      return (await window.electron.ipcRenderer.invoke('store:get', {
        key,
      })) as T | undefined;
    } catch (error) {
      logger.error(`Failed to get store value [${key}]:`, error);
      return undefined;
    }
  }, []);

  const setStoreValue = useCallback(async (key: string, value: unknown) => {
    try {
      await window.electron.ipcRenderer.invoke('store:set', { key, value });
    } catch (error) {
      logger.error(`Failed to set store value [${key}]:`, error);
    }
  }, []);

  const deleteStoreValue = useCallback(async (key: string) => {
    try {
      await window.electron.ipcRenderer.invoke('store:delete', { key });
    } catch (error) {
      logger.error(`Failed to delete store value [${key}]:`, error);
    }
  }, []);

  useEffect(() => {
    getVersion();
    checkIsMaximized();
  }, [getVersion, checkIsMaximized]);

  return {
    appVersion,
    checkIsMaximized,
    closeWindow,
    deleteStoreValue,
    getPlatform,
    getStoreValue,
    getVersion,
    isDev: window.electron.isDev,
    isMaximized,
    maximizeWindow,
    minimizeWindow,
    openFileDialog,
    platform: window.electron.platform,
    saveFileDialog,
    setStoreValue,
  };
};
