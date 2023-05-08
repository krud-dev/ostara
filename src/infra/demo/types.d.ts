declare global {
  type DemoBridge = {
    startDemo(): Promise<string>;
    stopDemo(): Promise<void>;
    getDemoAddress(): string;
    isStarted(): boolean;
  };
  interface Window {
    demo: DemoBridge;
  }
}

export {};
