declare global {
  interface Window {
    daemonAddress: string;
    daemonWsAddress: string;
    daemonHealthy: boolean;
  }
}

export {};
