export const IPC_CHANNELS = {
  APP_GET_PLATFORM: 'app:get-platform',
  APP_GET_VERSION: 'app:get-version',
  FILE_OPEN_DIALOG: 'file:open-dialog',
  FILE_SAVE_DIALOG: 'file:save-dialog',
  STORE_DELETE: 'store:delete',
  STORE_GET: 'store:get',
  STORE_SET: 'store:set',
  WINDOW_CLOSE: 'window:close',
  WINDOW_IS_MAXIMIZED: 'window:is-maximized',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_MINIMIZE: 'window:minimize',
} as const;

export interface IIpcInvokeMap {
  [IPC_CHANNELS.APP_GET_PLATFORM]: [undefined, NodeJS.Platform];
  [IPC_CHANNELS.APP_GET_VERSION]: [undefined, string];
  [IPC_CHANNELS.FILE_OPEN_DIALOG]: [
    { filters?: Electron.FileFilter[]; title?: string },
    string | undefined,
  ];
  [IPC_CHANNELS.FILE_SAVE_DIALOG]: [
    { defaultPath?: string; title?: string },
    string | undefined,
  ];
  [IPC_CHANNELS.STORE_DELETE]: [{ key: string }, void];
  [IPC_CHANNELS.STORE_GET]: [{ key: string }, unknown];
  [IPC_CHANNELS.STORE_SET]: [{ key: string; value: unknown }, void];
  [IPC_CHANNELS.WINDOW_CLOSE]: [undefined, void];
  [IPC_CHANNELS.WINDOW_IS_MAXIMIZED]: [undefined, boolean];
  [IPC_CHANNELS.WINDOW_MAXIMIZE]: [undefined, void];
  [IPC_CHANNELS.WINDOW_MINIMIZE]: [undefined, void];
}

export interface IIpcSendMap {}

export type TIpcChannel = keyof IIpcInvokeMap | keyof IIpcSendMap;

export type TIpcChannelArgs<T extends keyof IIpcInvokeMap> =
  IIpcInvokeMap[T][0];

export type TIpcChannelReturn<T extends keyof IIpcInvokeMap> =
  IIpcInvokeMap[T][1];
