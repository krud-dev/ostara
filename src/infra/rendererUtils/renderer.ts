import { ipcRenderer } from 'electron';

export const utilsBridge: UtilsBridge = {
  async uuidv4() {
    return ipcRenderer.invoke('utils:uuidv4');
  },
};
