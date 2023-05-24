import { IpcRendererEvent } from 'electron';
import { ElectronTheme } from '../ui/models/electronTheme';
import { UpdateInfo } from 'electron-updater';
import { ProgressInfo } from 'electron-builder';
import { NotificationInfo } from '../notifications/models/notificationInfo';

export type Subscriptions = {
  'app:themeUpdated': (event: IpcRendererEvent, data: ElectronTheme) => void;
  'app:daemonHealthy': (event: IpcRendererEvent) => void;
  'app:daemonUnhealthy': (event: IpcRendererEvent) => void;
  'trigger:openSettings': (event: IpcRendererEvent) => void;

  /**
   * Updates
   */
  'app:checkingForUpdate': (event: IpcRendererEvent) => void;
  'app:updateAvailable': (event: IpcRendererEvent, data: UpdateInfo) => void;
  'app:updateNotAvailable': (event: IpcRendererEvent, data: UpdateInfo) => void;
  'app:updateDownloadProgress': (event: IpcRendererEvent, data: ProgressInfo) => void;
  'app:updateDownloaded': (event: IpcRendererEvent, data: UpdateInfo) => void;
  'app:updateError': (event: IpcRendererEvent, data: Error) => void;
  'app:updateCancelled': (event: IpcRendererEvent, data: UpdateInfo) => void;

  /**
   * Notifications
   */
  'app:notificationClicked': (event: IpcRendererEvent, data: NotificationInfo) => void;
};
