import { InstanceHealth } from '../configuration/model/configuration';
import { ApplicationCache, InstanceCache } from './models/cache';
import { ApplicationLogger, InstanceLogger } from './models/logger';
import { LogLevel } from 'electron-log';
import { InstanceHttpRequestStatistics } from './models/httpRequestStatistics';

declare global {
  type InstancePropertyServiceBridge = {
    getProperties(instanceId: string): Promise<{ [key: string]: { [key: string]: unknown } }>;
  };

  type InstanceHttpRequestStatisticsServiceBridge = {
    getStatistics(instanceId: string): Promise<InstanceHttpRequestStatistics[]>;
  };

  type InstanceServiceBridge = {
    propertyService: InstancePropertyServiceBridge;
    httpRequestStatisticsService: InstanceHttpRequestStatisticsServiceBridge;
    fetchInstanceHealthById: (instanceId: string) => Promise<InstanceHealth>;
    getInstanceLoggers: (instanceId: string) => Promise<InstanceLogger[]>;
    getInstanceLogger: (instanceId: string, loggerName: string) => Promise<InstanceLogger>;
    setInstanceLoggerLevel: (instanceId: string, loggerName: string, level: LogLevel | undefined) => Promise<void>;
    getApplicationLoggers: (applicationId: string) => Promise<ApplicationLogger[]>;
    getApplicationLogger: (applicationId: string, loggerName: string) => Promise<ApplicationLogger>;
    setApplicationLoggerLevel: (
      applicationId: string,
      loggerName: string,
      level: LogLevel | undefined
    ) => Promise<void>;
    getInstanceCaches: (instanceId: string) => Promise<InstanceCache[]>;
    getInstanceCache: (instanceId: string, cacheName: string) => Promise<InstanceCache>;
    evictInstanceCaches: (instanceId: string, cacheNames: string[]) => Promise<void>;
    evictAllInstanceCaches: (instanceId: string) => Promise<void>;

    getApplicationCaches: (applicationId: string) => Promise<ApplicationCache[]>;
    getApplicationCache: (applicationId: string, cacheName: string) => Promise<ApplicationCache>;
    evictApplicationCaches: (applicationId: string, cacheNames: string[]) => Promise<void>;
    evictAllApplicationCaches: (applicationId: string) => Promise<void>;
  };

  interface Window {
    instance: InstanceServiceBridge;
  }
}

export {};
