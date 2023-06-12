import { app, BrowserWindow, Notification, shell } from 'electron';
import log from 'electron-log';
import { systemEvents } from '../events';
import { uiService } from '../ui/uiService';
import { isMac, isWindows } from '../utils/platform';
import { NotificationInfo } from './models/notificationInfo';

class NotificationsService {
  private window: BrowserWindow | undefined;

  initialize(window: BrowserWindow) {
    log.info(`Initializing notifications service for window ${window.id}`);

    this.window = window;

    systemEvents.on('notification-clicked', (info) => {
      window.webContents.send('app:notificationClicked', info);
    });

    if (isWindows) {
      app.setAppUserModelId(uiService.getAppId());
    }
  }

  canSendNotifications(): boolean {
    return Notification.isSupported();
  }

  canOpenOsSettings(): boolean {
    return isWindows || isMac;
  }

  async openOsSettings(): Promise<void> {
    if (!this.canOpenOsSettings()) {
      throw new Error('Unable to open OS settings for this platform');
    }
    if (isWindows) {
      await shell.openExternal('ms-settings:notifications');
    } else if (isMac) {
      await shell.openExternal('x-apple.systempreferences:com.apple.preference.notifications');
    }
  }

  sendNotification(info: NotificationInfo): void {
    const notification = new Notification({ title: info.title, body: info.body, silent: info.silent });
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
