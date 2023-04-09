import { UpdateInfo } from 'electron-updater';

declare global {
  type AppUpdaterBridge = {
    checkForUpdates(): Promise<UpdateInfo>;
    downloadUpdate(): void;
    quitAndInstall(): void;
  };

  interface Window {
    appUpdater: AppUpdaterBridge;
  }
}

export {};
