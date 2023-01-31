import { InstanceHealth } from '../configuration/model/configuration';
import { ApplicationCache, ApplicationCacheStatistics, InstanceCache, InstanceCacheStatistics } from './models/cache';
import { ApplicationLogger, InstanceLogger } from './models/logger';
import {
  InstanceHttpRequestStatistics,
  InstanceHttpRequestStatisticsByException,
  InstanceHttpRequestStatisticsByMethod,
  InstanceHttpRequestStatisticsByOutcome,
  InstanceHttpRequestStatisticsByStatus,
  InstanceHttpRequestStatisticsForUriOptions,
} from './models/httpRequestStatistics';
import { HeapdumpReference } from './heapdump/entities/HeapdumpReference';
import { ActuatorLogLevel } from 'infra/actuator/model/loggers';

declare global {
  type InstancePropertyServiceBridge = {
    getProperties(instanceId: string): Promise<{ [key: string]: { [key: string]: unknown } }>;
  };

  type InstanceHttpRequestStatisticsServiceBridge = {
    getStatistics(instanceId: string): Promise<InstanceHttpRequestStatistics[]>;
    getStatisticsForUri(
      instanceId: string,
      uri: string,
      options: InstanceHttpRequestStatisticsForUriOptions
    ): Promise<InstanceHttpRequestStatistics>;
    getStatisticsForUriByMethods(instanceId: string, uri: string): Promise<InstanceHttpRequestStatisticsByMethod[]>;
    getStatisticsForUriByOutcomes(instanceId: string, uri: string): Promise<InstanceHttpRequestStatisticsByOutcome[]>;
    getStatisticsForUriByStatuses(instanceId: string, uri: string): Promise<InstanceHttpRequestStatisticsByStatus[]>;
    getStatisticsForUriByExceptions(
      instanceId: string,
      uri: string
    ): Promise<InstanceHttpRequestStatisticsByException[]>;
  };

  type InstanceHeapdumpServiceBridge = {
    getHeapdumps(instanceId: string): Promise<HeapdumpReference[]>;
    requestDownloadHeapdump(instanceId: string): Promise<HeapdumpReference>;
    deleteHeapdump(instanceId: string, referenceId: string): Promise<void>;
  };

  type InstanceServiceBridge = {
    propertyService: InstancePropertyServiceBridge;
    httpRequestStatisticsService: InstanceHttpRequestStatisticsServiceBridge;
    heapdumpService: InstanceHeapdumpServiceBridge;
    fetchInstanceHealthById: (instanceId: string) => Promise<InstanceHealth>;
    getInstanceLoggers: (instanceId: string) => Promise<InstanceLogger[]>;
    getInstanceLogger: (instanceId: string, loggerName: string) => Promise<InstanceLogger>;
    setInstanceLoggerLevel: (
      instanceId: string,
      loggerName: string,
      level: ActuatorLogLevel | undefined
    ) => Promise<void>;
    getApplicationLoggers: (applicationId: string) => Promise<ApplicationLogger[]>;
    getApplicationLogger: (applicationId: string, loggerName: string) => Promise<ApplicationLogger>;
    setApplicationLoggerLevel: (
      applicationId: string,
      loggerName: string,
      level: ActuatorLogLevel | undefined
    ) => Promise<void>;
    getInstanceCaches: (instanceId: string) => Promise<InstanceCache[]>;
    getInstanceCache: (instanceId: string, cacheName: string) => Promise<InstanceCache>;
    evictInstanceCaches: (instanceId: string, cacheNames: string[]) => Promise<void>;
    evictAllInstanceCaches: (instanceId: string) => Promise<void>;
    getInstanceCacheStatistics: (instanceId: string, cacheName: string) => Promise<InstanceCacheStatistics>;
    getApplicationCaches: (applicationId: string) => Promise<ApplicationCache[]>;
    getApplicationCache: (applicationId: string, cacheName: string) => Promise<ApplicationCache>;
    evictApplicationCaches: (applicationId: string, cacheNames: string[]) => Promise<void>;
    evictAllApplicationCaches: (applicationId: string) => Promise<void>;
    getApplicationCacheStatistics: (applicationId: string, cacheName: string) => Promise<ApplicationCacheStatistics>;
  };

  interface Window {
    instance: InstanceServiceBridge;
  }
}

export {};
