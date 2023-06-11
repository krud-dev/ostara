import { autoUpdater, UpdateInfo } from 'electron-updater';
import path from 'path';
import log from 'electron-log';
import { app, BrowserWindow } from 'electron';
import { systemEvents } from '../events';
import { configurationStore } from '../store/store';
import { scheduleJob } from 'node-schedule';
import semverGt from 'semver/functions/gt';

export class AppUpdater {
  constructor(autoUpdate = false) {
    if (process.env.NODE_ENV === 'development') {
      autoUpdater.updateConfigPath = path.join(__dirname, 'app-dev-update.yml');
    }
    this.updateAutoUpdate(autoUpdate);
    log.transports.file.level = 'info';

    autoUpdater.logger = log;
    autoUpdater.on('checking-for-update', () => {
      log.silly('Checking for update...');
      systemEvents.emit('checking-for-update');
    });
    autoUpdater.on('update-available', (info) => {
      log.silly(`Update available: ${JSON.stringify(info)}`);
      if (info.version && semverGt(info.version, app.getVersion())) {
        systemEvents.emit('update-available', info);
      }
    });

    autoUpdater.on('update-not-available', (info) => {
      log.silly(`Update not available. ${JSON.stringify(info)}`);
      systemEvents.emit('update-not-available', info);
    });

    autoUpdater.on('error', (err) => {
      log.error(`Error in auto-updater. ${err}`);
      systemEvents.emit('update-error', err);
    });

    autoUpdater.on('download-progress', (info) => {
      log.silly(`Download progress: ${JSON.stringify(info)}`);
      systemEvents.emit('update-download-progress', info);
    });

    autoUpdater.on('update-downloaded', (info) => {
      log.silly(`Update downloaded: ${JSON.stringify(info)}`);
      systemEvents.emit('update-downloaded', info);
    });

    autoUpdater.on('update-cancelled', (info) => {
      log.silly(`Update cancelled: ${JSON.stringify(info)}`);
      systemEvents.emit('update-cancelled', info);
    });

    scheduleJob('0 */5 * * * *', this.checkForUpdatesJob.bind(this, false));
    this.checkForUpdatesJob(true);
  }

  updateAutoUpdate(autoUpdate: boolean) {
    autoUpdater.autoDownload = autoUpdate;
    autoUpdater.autoInstallOnAppQuit = autoUpdate;
    log.info(`autoUpdate update set to ${autoUpdate} `);
  }

  async checkForUpdates(): Promise<UpdateInfo | undefined> {
    const result = await autoUpdater.checkForUpdates();
    if (result?.updateInfo && semverGt(result.updateInfo.version, app.getVersion())) {
      return result.updateInfo;
    }
    return undefined;
  }

  downloadUpdate() {
    autoUpdater.downloadUpdate();
  }

  quitAndInstall() {
    autoUpdater.quitAndInstall();
  }

  private async checkForUpdatesJob(runAnyways = false) {
    const lastUpdateCheckTimeAfterOneHour = configurationStore.get('lastUpdateCheckTime') < Date.now() - 1000 * 60 * 60;
    if (lastUpdateCheckTimeAfterOneHour || runAnyways) {
      configurationStore.set('lastUpdateCheckTime', Date.now());
      await this.checkForUpdates();
    }
  }
}

export function initializeAppUpdaterSubscriptions(window: BrowserWindow) {
  systemEvents.on('checking-for-update', () => {
    window.webContents.send('app:checkingForUpdate');
  });

  systemEvents.on('update-available', (info) => {
    window.webContents.send('app:updateAvailable', info);
  });

  systemEvents.on('update-not-available', (info) => {
    window.webContents.send('app:updateNotAvailable', info);
  });

  systemEvents.on('update-download-progress', (info) => {
    window.webContents.send('app:updateDownloadProgress', info);
  });

  systemEvents.on('update-downloaded', (info) => {
    window.webContents.send('app:updateDownloaded', info);
  });

  systemEvents.on('update-error', (error) => {
    window.webContents.send('app:updateError', error);
  });
}

configurationStore.onDidChange('autoUpdateEnabled', (newValue) => {
  if (newValue !== undefined) {
    appUpdater.updateAutoUpdate(newValue);
  }
});

export const appUpdater = new AppUpdater(configurationStore.get('autoUpdateEnabled'));
