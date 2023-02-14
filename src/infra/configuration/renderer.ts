import { Configuration } from './model/Configuration';
import { ipcRenderer } from 'electron';

export const configurationStoreBridge: ConfigurationBridge<keyof Configuration> = {
  get<T>(key: string): T {
    return ipcRenderer.sendSync('configurationStore:get', key);
  },
  set<T>(property: string, val: T) {
    ipcRenderer.sendSync('configurationStore:set', property, val);
  },
  has(key: string): boolean {
    return ipcRenderer.sendSync('configurationStore:has', key);
  },
  delete(key: string): void {
    ipcRenderer.sendSync('configurationStore:delete', key);
  },
  reset(key: string): void {
    ipcRenderer.sendSync('configurationStore:reset', key);
  },
  clear(): void {
    ipcRenderer.sendSync('configurationStore:clear');
  },
};
