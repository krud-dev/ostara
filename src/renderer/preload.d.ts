import { Channels } from 'main/preload';
import { ActuatorHealthComponentResponse, ActuatorHealthResponse } from '../infra/actuator/model/health';
import { ActuatorInfoResponse } from '../infra/actuator/model/info';
import { ActuatorCacheResponse, ActuatorCachesResponse } from '../infra/actuator/model/caches';
import { ActuatorMetricResponse, ActuatorMetricsResponse } from '../infra/actuator/model/metrics';
import { ActuatorEnvPropertyResponse, ActuatorEnvResponse } from '../infra/actuator/model/env';
import { ActuatorThreadDumpResponse } from '../infra/actuator/model/threadDump';
import { ActuatorLoggersResponse } from '../infra/actuator/model/loggers';

declare global {
  type Store = {
    get: <T>(key: string) => T;
    set: <T>(key: string, val: T) => void;
    has: (key: string) => boolean;
    delete: (key: string) => void;
    reset: (key: string) => void;
    clear: () => void;
  };
  type ActuatorFacade = {
    health: (url: string) => ActuatorHealthResponse;
    healthComponent: <T>(url: string, name: string) => ActuatorHealthComponentResponse<T>;
    info: (url: string) => ActuatorInfoResponse;
    caches: (url: string) => ActuatorCachesResponse;
    cache: (url: string, name: string) => ActuatorCacheResponse;
    evictAllCaches: (url: string) => void;
    evictCache: (url: string, name: string) => void;
    logfile: (url: string) => string;
    logfileRange: (url: string, start: number, end: number) => string;
    metrics: (url: string) => ActuatorMetricsResponse;
    metric: (
      url: string,
      name: string,
      tags: { [key: string]: string }
    ) => ActuatorMetricResponse;
    shutdown: (url: string) => void;
    env: (url: string) => ActuatorEnvResponse;
    envProperty: (url: string, name: string) => ActuatorEnvPropertyResponse;
    threadDump: (url: string) => ActuatorThreadDumpResponse;
    loggers: (url: string) => ActuatorLoggersResponse;
    logger: (url: string, name: string) => ActuatorLoggersResponse;
    updateLogger: (url: string, name: string, level: string) => void;
    clearLogger: (url: string, name: string) => void;
  };
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
      };
      configurationStore: Store;
      actuator: ActuatorFacade;
    };
  }
}

export {};
