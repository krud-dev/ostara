import { ipcRenderer } from 'electron';

export const utilsBridge: UtilsBridge = {
  async uuidv4() {
    return ipcRenderer.invoke('utils:uuidv4');
  },
  async readClipboardText() {
    return ipcRenderer.invoke('utils:readClipboardText');
  },
};
