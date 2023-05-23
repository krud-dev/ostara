import { ipcRenderer } from 'electron';

export const daemonAddressSupplier = (): string => ipcRenderer.sendSync('daemon:address');

export const daemonWsAddressSupplier = (): string => ipcRenderer.sendSync('daemon:wsAddress');

export const daemonHealthySupplier = (): boolean => ipcRenderer.sendSync('daemon:healthy');
