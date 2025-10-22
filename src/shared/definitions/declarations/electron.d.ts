import type { TElectronHandler } from '@/main/preload';

declare global {
  interface Window {
    electron: TElectronHandler;
  }
}

export {};
