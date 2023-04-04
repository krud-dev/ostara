import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from 'electron';
import { isMac } from '../infra/utils/platform';
import { MAX_ZOOM_FACTOR, MIN_ZOOM_FACTOR } from './consts';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment();
    }

    const template = isMac ? this.buildMacTemplate() : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildMacTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Boost',
      submenu: [
        {
          label: 'About Boost',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Services',
          submenu: [],
        },
        { type: 'separator' },
        {
          label: 'Settings',
          click: () => {
            this.mainWindow.webContents.send('trigger:openSettings');
          },
        },
        { type: 'separator' },
        {
          label: 'Hide Boost',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };

    const reloadOptions: MenuItemConstructorOptions[] = [
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: () => {
          this.mainWindow.webContents.getZoomLevel();
        },
      },
      {
        label: 'Force Reload',
        accelerator: 'Shift+Command+R',
        click: () => {
          this.mainWindow.webContents.reloadIgnoringCache();
        },
      },
    ];

    const fullScreenOption: MenuItemConstructorOptions = {
      label: 'Toggle Full Screen',
      accelerator: 'Ctrl+Command+F',
      click: () => {
        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
      },
    };

    const zoomOptions: MenuItemConstructorOptions[] = [
      {
        label: 'Zoom In',
        accelerator: 'Command+Plus',
        click: () => {
          this.mainWindow.webContents.setZoomFactor(
            Math.min(MAX_ZOOM_FACTOR, this.mainWindow.webContents.getZoomFactor() + 0.1)
          );
          console.log(this.mainWindow.webContents.getZoomFactor());
        },
      },
      {
        label: 'Zoom Out',
        accelerator: 'Command+-',
        click: () => {
          this.mainWindow.webContents.setZoomFactor(
            Math.max(MIN_ZOOM_FACTOR, this.mainWindow.webContents.getZoomFactor() - 0.1)
          );
          console.log(this.mainWindow.webContents.getZoomFactor());
        },
      },
      {
        label: 'Reset Zoom',
        accelerator: 'Command+0',
        click: () => {
          this.mainWindow.webContents.setZoomFactor(1);
        },
      },
    ];

    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        ...reloadOptions,
        { type: 'separator' },
        fullScreenOption,
        { type: 'separator' },
        ...zoomOptions,
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [...reloadOptions, { type: 'separator' }, fullScreenOption, { type: 'separator' }, ...zoomOptions],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Star us on GitHub',
          click() {
            shell.openExternal('https://github.com/krud-dev/boost');
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://boost.krud.dev/');
          },
        },
        { type: 'separator' },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/krud-dev/boost/issues');
          },
        },
        {
          label: 'Submit a Bug Report',
          click() {
            shell.openExternal(
              'https://github.com/krud-dev/boost/issues/new?assignees=&labels=bug&template=1-Bug_report.md'
            );
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true' ? subMenuViewDev : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                  },
                },
              ]
            : [
                {
                  label: 'Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Force Reload',
                  accelerator: 'Shift+Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reloadIgnoringCache();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                  },
                },
              ],
      },
    ];

    return templateDefault;
  }
}
