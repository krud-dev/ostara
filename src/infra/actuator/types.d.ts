import {
  ActuatorHealthComponentResponse,
  ActuatorHealthResponse,
} from './model/health';
import { ActuatorInfoResponse } from './model/info';
import { ActuatorCacheResponse, ActuatorCachesResponse } from './model/caches';
import {
  ActuatorMetricResponse,
  ActuatorMetricsResponse,
} from './model/metrics';
import { ActuatorEnvPropertyResponse, ActuatorEnvResponse } from './model/env';
import { ActuatorThreadDumpResponse } from './model/threadDump';
import {
  ActuatorLoggerResponse,
  ActuatorLoggersResponse,
} from './model/loggers';

declare global {
  type ActuatorBridge = {
    health: (url: string) => Promise<ActuatorHealthResponse>;
    healthComponent: <T>(
      url: string,
      name: string
    ) => Promise<ActuatorHealthComponentResponse<T>>;
    info: (url: string) => Promise<ActuatorInfoResponse>;
    caches: (url: string) => Promise<ActuatorCachesResponse>;
    cache: (url: string, name: string) => Promise<ActuatorCacheResponse>;
    evictAllCaches: (url: string) => Promise<void>;
    evictCache: (url: string, name: string) => Promise<void>;
    logfile: (url: string) => Promise<string>;
    logfileRange: (url: string, start: number, end: number) => Promise<string>;
    metrics: (url: string) => Promise<ActuatorMetricsResponse>;
    metric: (
      url: string,
      name: string,
      tags: { [key: string]: string }
    ) => Promise<ActuatorMetricResponse>;
    shutdown: (url: string) => Promise<void>;
    env: (url: string) => Promise<ActuatorEnvResponse>;
    envProperty: (
      url: string,
      name: string
    ) => Promise<ActuatorEnvPropertyResponse>;
    threadDump: (url: string) => Promise<ActuatorThreadDumpResponse>;
    loggers: (url: string) => Promise<ActuatorLoggersResponse>;
    logger: (url: string, name: string) => Promise<ActuatorLoggerResponse>;
    updateLogger: (url: string, name: string, level: string) => Promise<void>;
    clearLogger: (url: string, name: string) => Promise<void>;
  };
  interface Window {
    actuator: ActuatorBridge;
  }
}

export {};
