declare global {
  type UtilsBridge = {
    uuidv4: () => Promise<string>;

    isMac: boolean;
    isWindows: boolean;
    isLinux: boolean;
  };

  interface Window {
    utils: UtilsBridge;
  }
}

export {};
