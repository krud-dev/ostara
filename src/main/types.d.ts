declare global {
  interface Window {
    isElectron: boolean;
    NODE_ENV: string;
  }
}

export {};
