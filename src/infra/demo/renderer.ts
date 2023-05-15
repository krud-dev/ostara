import { ipcRenderer } from 'electron';

export const demoBridge: DemoBridge = {
  startDemo(): Promise<string> {
    return ipcRenderer.invoke('demo:start');
  },

  stopDemo(): Promise<void> {
    return ipcRenderer.invoke('demo:stop');
  },

  getDemoAddress(): string {
    return ipcRenderer.sendSync('demo:getAddress');
  },
  isStarted(): boolean {
    return ipcRenderer.sendSync('demo:isStarted');
  },
};
