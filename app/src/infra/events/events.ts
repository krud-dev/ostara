import { UpdateInfo } from 'electron-updater';
import { ProgressInfo } from 'electron-builder';
import { NotificationInfo } from '../notifications/models/notificationInfo';

export type Events = {
  /**
   * System
   */
  'daemon-ready': () => void;
  'daemon-healthy': () => void;
  'daemon-unhealthy': () => void;

  /**
   * Updates
   */
  'checking-for-update': () => void;
  'update-available': (info: UpdateInfo) => void;
  'update-not-available': (info: UpdateInfo) => void;
  'update-download-progress': (info: ProgressInfo) => void;
  'update-downloaded': (info: UpdateInfo) => void;
  'update-error': (error: Error) => void;
  'update-cancelled': (info: UpdateInfo) => void;

  /**
   * Notifications
   */
  'notification-clicked': (info: NotificationInfo) => void;
};
