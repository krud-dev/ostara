/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'reflect-metadata';
import path from 'path';
import { app, BrowserWindow, nativeTheme, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import '../infra';
import { dataSource } from '../infra/dataSource';
import { taskService } from '../infra/tasks/taskService';
import { instanceService } from '../infra/instance/instanceService';
import { uiService } from '../infra/ui/uiService';
import { DaemonController } from './daemon';
import { systemEvents } from '../infra/events';
import { isMac, isWindows } from '../infra/utils/platform';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let splashWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const initDaemon = async () => {
  let daemonController: DaemonController;
  if (app.isPackaged) {
    daemonController = new DaemonController({
      type: 'internal',
      protocol: 'http',
      host: '127.0.0.1',
      port: 'random',
    });
  } else {
    daemonController = new DaemonController({
      type: 'external',
      address: 'http://127.0.0.1:12222',
    });
  }
  daemonController.start().catch((e) => {
    log.error('Error starting daemon', e);
    app.exit(1);
  });
};

const createSplashWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const backgroundColor = nativeTheme.shouldUseDarkColors ? '#161C24' : '#ffffff';
  const color = nativeTheme.shouldUseDarkColors ? '#ffffff' : '#212B36';

  splashWindow = new BrowserWindow({
    show: true,
    width: 300,
    height: 300,
    icon: getAssetPath('icon.png'),
    minWidth: 300, // accommodate 800 x 600 display minimum
    minHeight: 300, // accommodate 800 x 600 display minimum
    backgroundColor: backgroundColor,
    frame: false,
    webPreferences: {
      devTools: false,
    },
  });

  splashWindow.loadFile(getAssetPath('splash.html'));

  splashWindow.on('ready-to-show', () => {
    if (!splashWindow) {
      throw new Error('"splashWindow" is not defined');
    }
    splashWindow.show();
  });

  splashWindow.on('closed', () => {
    mainWindow = null;
  });
};

const createMainWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  try {
    log.debug('Initializing data source...');
    await dataSource.initialize();
    log.debug('Data source initialized');
  } catch (e) {
    app.quit();
  }

  await taskService.initialize();

  const backgroundColor = nativeTheme.shouldUseDarkColors ? '#161C24' : '#ffffff';
  const color = nativeTheme.shouldUseDarkColors ? '#ffffff' : '#212B36';

  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 900,
    icon: getAssetPath('icon.png'),
    minWidth: 700, // accommodate 800 x 600 display minimum
    minHeight: 500, // accommodate 800 x 600 display minimum
    backgroundColor: backgroundColor,
    frame: isMac,
    titleBarStyle: isMac ? 'hidden' : undefined,
    titleBarOverlay: isMac
      ? {
          height: 40 + (isWindows ? -1 : 0),
          color: backgroundColor,
          symbolColor: color,
        }
      : undefined,
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  instanceService.initialize(mainWindow);
  uiService.initialize(mainWindow);

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  app.quit();
});

app
  .whenReady()
  .then(async () => {
    await createSplashWindow();
    systemEvents.on('daemon-ready', () => {
      createMainWindow();
    });
    await initDaemon();
    app.on('activate', () => {
      // On macOS it's common to re-dialogs a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createMainWindow();
    });
  })
  .catch(console.log);
