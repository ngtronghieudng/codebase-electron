import { app, BrowserWindow, dialog, ipcMain } from 'electron';

import { IPC_CHANNELS } from '@/shared/definitions/types/ipc.type';

export const setupIpcHandlers = () => {
  registerAppHandlers();
  registerWindowHandlers();
  registerFileHandlers();
  registerStoreHandlers();
};

export const removeIpcHandlers = () => {
  Object.values(IPC_CHANNELS).forEach((channel) => {
    ipcMain.removeHandler(channel);
  });
};

const registerAppHandlers = () => {
  ipcMain.handle(IPC_CHANNELS.APP_GET_VERSION, () => {
    return app.getVersion();
  });

  ipcMain.handle(IPC_CHANNELS.APP_GET_PLATFORM, () => {
    return process.platform;
  });
};

const registerWindowHandlers = () => {
  ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.minimize();
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) {
      return;
    }

    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.close();
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_IS_MAXIMIZED, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    return window?.isMaximized() ?? false;
  });
};

const registerFileHandlers = () => {
  ipcMain.handle(
    IPC_CHANNELS.FILE_OPEN_DIALOG,
    async (
      event,
      args: { filters?: Electron.FileFilter[]; title?: string },
    ) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      if (!window) {
        return undefined;
      }

      const result = await dialog.showOpenDialog(window, {
        filters: args?.filters || [],
        properties: ['openFile'],
        title: args?.title || 'Select a file',
      });

      return result.canceled ? undefined : result.filePaths[0];
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.FILE_SAVE_DIALOG,
    async (event, args: { defaultPath?: string; title?: string }) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      if (!window) {
        return undefined;
      }

      const result = await dialog.showSaveDialog(window, {
        defaultPath: args?.defaultPath,
        title: args?.title || 'Save file',
      });

      return result.canceled ? undefined : result.filePath;
    },
  );
};

const inMemoryStore = new Map<string, unknown>();

const registerStoreHandlers = () => {
  ipcMain.handle(IPC_CHANNELS.STORE_GET, (_event, args: { key: string }) => {
    return inMemoryStore.get(args.key);
  });

  ipcMain.handle(
    IPC_CHANNELS.STORE_SET,
    (_event, args: { key: string; value: unknown }) => {
      inMemoryStore.set(args.key, args.value);
    },
  );

  ipcMain.handle(IPC_CHANNELS.STORE_DELETE, (_event, args: { key: string }) => {
    inMemoryStore.delete(args.key);
  });
};
