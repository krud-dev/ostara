import { ipcRenderer } from 'electron';
import { NotificationInfo } from './models/notificationInfo';

export const notificationsServiceBridge: NotificationsServiceBridge = {
  sendNotification(info: NotificationInfo): Promise<void> {
    return ipcRenderer.invoke('notificationsService:sendNotification', info);
  },
  canOpenOsSettings(): boolean {
    return ipcRenderer.sendSync('notificationsService:canOpenOsSettings');
  },
  openOsSettings() {
    ipcRenderer.send('notificationsService:openOsSettings');
  },
};
