import { ipcRenderer } from 'electron';

export const configurationStoreFacade = {
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
};
