import { BrowserWindow, Notification } from 'electron';
import log from 'electron-log';
import { NotificationInfo } from './models/notificationInfo';
import { systemEvents } from '../events';

class NotificationsService {
  private window: BrowserWindow | undefined;

  initialize(window: BrowserWindow) {
    log.info(`Initializing notifications service for window ${window.id}`);

    this.window = window;

    systemEvents.on('notification-clicked', (info) => {
      window.webContents.send('app:notificationClicked', info);
    });
  }

  sendNotification(info: NotificationInfo): void {
    const notification = new Notification({ title: info.title, body: info.body });
    notification.show();
    notification.on('click', (event: Event) => {
      if (this.window?.isMinimized()) {
        this.window?.restore();
      }
      this.window?.focus();

      systemEvents.emit('notification-clicked', info);
    });
  }
}

export const notificationsService = new NotificationsService();
