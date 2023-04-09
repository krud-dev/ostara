import { Configuration } from './store';

declare global {
  type ConfigurationBridge<Key extends keyof Configuration> = {
    get(key: Key): Configuration[Key];
    set(key: Key, value: Configuration[Key]): void;
    has(key: Key): boolean;
    delete(key: Key): void;
    reset(key: Key): void;
    clear(): void;
    isErrorReportingEnabled(): boolean;
    setElectronErrorReportingEnabled(enabled: boolean): void;
  };

  interface Window {
    configurationStore: ConfigurationBridge<keyof Configuration>;
  }
}

export {};
