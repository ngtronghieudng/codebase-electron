import { contextBridge, ipcRenderer } from 'electron';

import {
  IIpcInvokeMap,
  IPC_CHANNELS,
  TIpcChannelArgs,
  TIpcChannelReturn,
} from '@/renderer/definitions/types/ipc.type';
import { logger } from '@/renderer/utils/logger.util';

const ALLOWED_INVOKE_CHANNELS = Object.values(IPC_CHANNELS) as string[];

const electronHandler = {
  ipcRenderer: {
    invoke: async <T extends keyof IIpcInvokeMap>(
      channel: T,
      args?: TIpcChannelArgs<T>,
    ): Promise<TIpcChannelReturn<T>> => {
      if (!ALLOWED_INVOKE_CHANNELS.includes(channel)) {
        throw new Error(`Invalid IPC channel: ${channel}`);
      }

      try {
        const result = await ipcRenderer.invoke(channel, args);
        return result as TIpcChannelReturn<T>;
      } catch (error) {
        logger.error(`IPC invoke error [${channel}]:`, error);
        throw error;
      }
    },
  },

  isDev: process.env.NODE_ENV === 'development',
  platform: process.platform,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type TElectronHandler = typeof electronHandler;
