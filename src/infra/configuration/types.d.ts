import { Configuration } from './model/Configuration';

declare global {
  type ConfigurationBridge<Key extends keyof Configuration> = {
    get(key: Key): Configuration[Key];
    set(key: Key, value: Configuration[Key]): void;
    has(key: Key): boolean;
    delete(key: Key): void;
    reset(key: Key): void;
    clear(): void;
}

  interface Window {
    configurationStore: ConfigurationBridge<keyof Configuration>;
  }
}

export {};
