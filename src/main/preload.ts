import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  configurationStore: {
    get<T>(key: string): T {
      return ipcRenderer.sendSync('configurationStore:get', key);
    },
    set<T>(property: string, val: T) {
      ipcRenderer.send('configurationStore:set', property, val);
    },
    has(key: string): boolean {
      return ipcRenderer.sendSync('configurationStore:has', key);
    },
    delete(key: string): void {
      ipcRenderer.send('configurationStore:delete', key);
    },
    reset(key: string): void {
      ipcRenderer.send('configurationStore:reset', key);
    },
    clear(): void {
      ipcRenderer.send('configurationStore:clear');
    },
  },
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
});
