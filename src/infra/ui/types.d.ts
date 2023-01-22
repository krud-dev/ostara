declare global {
  type UiServiceBridge = {
    getThemeSource(): Promise<'system' | 'light' | 'dark'>;
    setThemeSource(themeSource: 'system' | 'light' | 'dark'): Promise<void>;
  };

  interface Window {
    subscriptions: SubscriptionsBridge;
  }
}

export {};
