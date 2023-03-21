import { ElectronBridge } from './preload';

declare global {
  interface Window {
    electron: ElectronBridge;
    isElectron: boolean;
    NODE_ENV: string;
  }
}

export {};
