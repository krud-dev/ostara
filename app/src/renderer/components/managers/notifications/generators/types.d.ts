import { NotificationInfo } from 'infra/notifications/models/notificationInfo';

export type NotificationsGeneratorProps = {
  sendNotification: (notificationInfo: NotificationInfo) => Promise<void>;
};
