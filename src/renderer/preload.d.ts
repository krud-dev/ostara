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
      configurationStore: Store;
    };
  }
}

export {};
