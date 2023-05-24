declare global {
  type UtilsBridge = {
    uuidv4: () => Promise<string>;
    readClipboardText: () => Promise<string>;
  };

  interface Window {
    utils: UtilsBridge;
  }
}

export {};
