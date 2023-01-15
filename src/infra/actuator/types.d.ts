import { ActuatorHealthComponentResponse, ActuatorHealthResponse } from './model/health';
import { ActuatorInfoResponse } from './model/info';
import { ActuatorCacheResponse, ActuatorCachesResponse } from './model/caches';
import { ActuatorMetricResponse, ActuatorMetricsResponse } from './model/metrics';
import { ActuatorEnvPropertyResponse, ActuatorEnvResponse } from './model/env';
import { ActuatorThreadDumpResponse } from './model/threadDump';
import { ActuatorLoggerResponse, ActuatorLoggersResponse } from './model/loggers';
import { ActuatorTestConnectionResponse } from './model/base';
import { ActuatorBeansResponse } from './model/beans';

declare global {
  type ActuatorBridge = {
    testConnectionByUrl: (url: string) => Promise<ActuatorTestConnectionResponse>;
    testConnection: (instanceId: string) => Promise<ActuatorTestConnectionResponse>;
    endpoints: (instanceId: string) => Promise<string[] | undefined>;
    health: (instanceId: string) => Promise<ActuatorHealthResponse>;
    healthComponent: <T>(instanceId: string, name: string) => Promise<ActuatorHealthComponentResponse<T>>;
    info: (instanceId: string) => Promise<ActuatorInfoResponse>;
    caches: (instanceId: string) => Promise<ActuatorCachesResponse>;
    cache: (instanceId: string, name: string) => Promise<ActuatorCacheResponse>;
    evictAllCaches: (instanceId: string) => Promise<void>;
    evictCache: (instanceId: string, name: string) => Promise<void>;
    beans: (instanceId: string) => Promise<ActuatorBeansResponse>;
    logfile: (instanceId: string) => Promise<string>;
    logfileRange: (instanceId: string, start: number, end: number) => Promise<string>;
    flyway: (instanceId: string) => Promise<string>;
    metrics: (instanceId: string) => Promise<ActuatorMetricsResponse>;
    metric: (instanceId: string, name: string, tags: { [key: string]: string }) => Promise<ActuatorMetricResponse>;
    shutdown: (instanceId: string) => Promise<void>;
    env: (instanceId: string) => Promise<ActuatorEnvResponse>;
    envProperty: (instanceId: string, name: string) => Promise<ActuatorEnvPropertyResponse>;
    threadDump: (instanceId: string) => Promise<ActuatorThreadDumpResponse>;
    loggers: (instanceId: string) => Promise<ActuatorLoggersResponse>;
    logger: (instanceId: string, name: string) => Promise<ActuatorLoggerResponse>;
    updateLogger: (instanceId: string, name: string, level: string) => Promise<void>;
    clearLogger: (instanceId: string, name: string) => Promise<void>;
  };
  interface Window {
    actuator: ActuatorBridge;
  }
}

export {};
