import { ipcRenderer } from 'electron';
import { isLinux, isMac, isWindows } from '../utils/platform';

export const utilsBridge: UtilsBridge = {
  async uuidv4() {
    return ipcRenderer.invoke('utils:uuidv4');
  },

  isMac: isMac,
  isWindows: isWindows,
  isLinux: isLinux,
};
