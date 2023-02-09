import { ipcRenderer } from 'electron';

export const daemonAddressSupplier = (): string => ipcRenderer.sendSync('daemon:address');
