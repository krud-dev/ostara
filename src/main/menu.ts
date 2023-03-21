import { app, Menu, shell, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { isMac } from '../infra/utils/platform';

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
      label: 'SpringBoost',
      submenu: [
        {
          label: 'About SpringBoost',
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
            this.mainWindow.webContents.send('open-settings');
          },
        },
        { type: 'separator' },
        {
          label: 'Hide SpringBoost',
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
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Force Reload',
          accelerator: 'Shift+Command+R',
          click: () => {
            this.mainWindow.webContents.reloadIgnoringCache();
          },
        },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
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
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Force Reload',
          accelerator: 'Shift+Command+R',
          click: () => {
            this.mainWindow.webContents.reloadIgnoringCache();
          },
        },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
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
            shell.openExternal('https://github.com/krud-dev/spring-boost');
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
            shell.openExternal('https://github.com/krud-dev/spring-boost/issues');
          },
        },
        {
          label: 'Submit a Bug Report',
          click() {
            shell.openExternal(
              'https://github.com/krud-dev/spring-boost/issues/new?assignees=&labels=bug&template=1-Bug_report.md'
            );
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true' ? subMenuViewDev : subMenuViewProd;

    return [subMenuAbout, subMenuView, subMenuWindow, subMenuHelp];
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
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                  },
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('https://electronjs.org');
            },
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal('https://github.com/electron/electron/tree/main/docs#readme');
            },
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            },
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/electron/electron/issues');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
