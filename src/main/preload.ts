import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { utilsBridge } from '../infra/rendererUtils/renderer';
import { subscriptionsBridge } from '../infra/subscriptions/renderer';
import { uiServiceBridge } from '../infra/ui/renderer';
import { daemonAddressSupplier, daemonWsAddressSupplier } from '../infra/daemon/renderer';

export type Channels = 'trigger:openSettings';

const electronBridge = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronBridge);
contextBridge.exposeInMainWorld('utils', utilsBridge);
contextBridge.exposeInMainWorld('subscriptions', subscriptionsBridge);
contextBridge.exposeInMainWorld('ui', uiServiceBridge);
contextBridge.exposeInMainWorld('isElectron', true);
contextBridge.exposeInMainWorld('daemonAddress', daemonAddressSupplier());
contextBridge.exposeInMainWorld('daemonWsAddress', daemonWsAddressSupplier());
contextBridge.exposeInMainWorld('NODE_ENV', process.env.NODE_ENV);

export type ElectronBridge = typeof electronBridge;
