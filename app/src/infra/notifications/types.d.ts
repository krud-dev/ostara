import { NotificationInfo } from './models/notificationInfo';

declare global {
  type NotificationsServiceBridge = {
    sendNotification(info: NotificationInfo): Promise<void>;
    canOpenOsSettings(): boolean;
    openOsSettings(): void;
  };

  interface Window {
    notifications: NotificationsServiceBridge;
  }
}

export {};
