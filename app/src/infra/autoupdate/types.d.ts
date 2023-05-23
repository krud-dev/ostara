import { UpdateInfo } from 'electron-updater';

declare global {
  type AppUpdaterBridge = {
    checkForUpdates(): Promise<UpdateInfo | undefined>;
    downloadUpdate(): void;
    quitAndInstall(): void;
  };

  interface Window {
    appUpdater: AppUpdaterBridge;
  }
}

export {};
