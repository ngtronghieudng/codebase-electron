import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import path from 'node:path';

import { removeIpcHandlers, setupIpcHandlers } from '@/main/ipc-handlers';

if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
    },
    width: 800,
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

app.on('ready', () => {
  setupIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  removeIpcHandlers();
});
