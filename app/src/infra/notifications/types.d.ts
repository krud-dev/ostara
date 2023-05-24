import { NotificationInfo } from './models/notificationInfo';

declare global {
  type NotificationsServiceBridge = {
    sendNotification(info: NotificationInfo): Promise<void>;
  };

  interface Window {
    notifications: NotificationsServiceBridge;
  }
}

export {};
