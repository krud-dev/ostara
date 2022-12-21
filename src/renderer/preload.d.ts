import { Channels } from 'main/preload';

declare global {
  type Store = {
    get: <T>(key: string) => T;
    set: <T>(key: string, val: T) => void;
    has: (key: string) => boolean;
    delete: (key: string) => void;
    reset: (key: string) => void;
    clear: () => void;
  };
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(channel: Channels, func: (...args: unknown[]) => void): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
      };
      configurationStore: Store;
    };
  }
}

export {};
