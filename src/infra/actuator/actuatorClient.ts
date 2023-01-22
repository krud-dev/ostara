import axios, { Axios } from 'axios';
import log from 'electron-log';
import { ActuatorHealthComponentResponse, ActuatorHealthResponse } from './model/health';
import { ActuatorInfoResponse } from './model/info';
import { ActuatorCacheResponse, ActuatorCachesResponse } from './model/caches';
import { ActuatorMetricResponse, ActuatorMetricsResponse } from './model/metrics';
import { ActuatorEnvPropertyResponse, ActuatorEnvResponse } from './model/env';
import { ActuatorLoggerResponse, ActuatorLoggersResponse, ActuatorLogLevel } from './model/loggers';
import { ActuatorThreadDumpResponse } from './model/threadDump';
import { ActuatorMainResponse, ActuatorTestConnectionResponse } from './model/base';
import { ActuatorBeansResponse } from './model/beans';
import { ActuatorConfigPropsResponse } from './model/configprops';
import { ActuatorFlywayResponse } from './model/flyway';
import { ActuatorLiquibaseResponse } from './model/liquibase';

export class ActuatorClient {
  readonly axios: Axios;

  constructor(private readonly baseUrl: string) {
    const url = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    this.axios = axios.create({
      baseURL: url,
      timeout: 10000,
    });
  }

  async testConnection(): Promise<ActuatorTestConnectionResponse> {
    const response = await this.axios.get('');
    try {
      const data = <ActuatorMainResponse>response.data;
      if (data._links && data._links.health) {
        return {
          statusCode: response.status,
          statusText: response.statusText,
          validActuator: true,
          success: true,
        };
      }
      return {
        statusCode: response.status,
        statusText: 'Did not receive expected response from an actuator endpoint',
        validActuator: false,
        success: true,
      };
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        return {
          statusCode: e.response?.status ?? 0,
          statusText: e.response?.statusText ?? '',
          validActuator: false,
          success: false,
        };
      }
      log.error("Couldn't parse actuator response", e);
      return {
        statusCode: 0,
        statusText: 'Unknown error',
        validActuator: false,
        success: false,
      };
    }
  }

  /**
   * Capabilities
   */

  async endpoints(): Promise<string[]> {
    const response = await this.axios.get('');
    const data = <ActuatorMainResponse>response.data;
    if (data._links) {
      return Object.keys(data._links).filter((key) => key !== 'self');
    }
    return [];
  }

  /**
   * Health
   */

  async health(): Promise<ActuatorHealthResponse> {
    const response = await this.axios.get<ActuatorHealthResponse>('health');
    if (!response.data.status) {
      // Todo: replace with a guard
      throw new Error('Invalid actuator response');
    }
    return response.data;
  }

  async healthComponent<T>(...name: string[]): Promise<ActuatorHealthComponentResponse<T>> {
    const path = `health/${name.join('/')}`;
    const response = await this.axios.get(path);
    return response.data;
  }

  /**
   * Info
   */

  async info(): Promise<ActuatorInfoResponse> {
    const response = await this.axios.get('info');
    return response.data;
  }

  /**
   * Caching
   */

  async caches(): Promise<ActuatorCachesResponse> {
    const response = await this.axios.get('caches');
    return response.data;
  }

  async cache(name: string): Promise<ActuatorCacheResponse> {
    const response = await this.axios.get(`caches/${name}`);
    return response.data;
  }

  async evictAllCaches(): Promise<void> {
    await this.axios.delete('caches');
  }

  async evictCache(name: string): Promise<void> {
    await this.axios.delete(`caches/${name}`);
  }

  /**
   * Beans
   */
  async beans(): Promise<ActuatorBeansResponse> {
    const response = await this.axios.get('beans');
    return response.data;
  }

  /**
   * Logfile
   */

  async logfile(): Promise<string> {
    const response = await this.axios.get('logfile');
    return response.data;
  }

  async logfileRange(startByte: number, endByte: number): Promise<string> {
    const response = await this.axios.get('logfile', {
      headers: {
        Range: `bytes=${startByte}-${endByte}`,
      },
    });
    return response.data;
  }

  /**
   * Metrics
   */

  async metrics(): Promise<ActuatorMetricsResponse> {
    const response = await this.axios.get('metrics');
    return response.data;
  }

  async metric(name: string, tags: { [key: string]: unknown } = {}): Promise<ActuatorMetricResponse> {
    const params = {
      tag: Object.keys(tags).map((key) => `${key}:${tags[key]}`),
    };
    const response = await this.axios.get(`metrics/${name}`, {
      params,
      paramsSerializer: { indexes: null },
    });
    return response.data;
  }

  /**
   * Shutdown
   */

  async shutdown(): Promise<void> {
    await this.axios.post('shutdown');
  }

  /**
   * Env
   */

  async env(): Promise<ActuatorEnvResponse> {
    const response = await this.axios.get('env');
    return response.data;
  }

  async envProperty(name: string): Promise<ActuatorEnvPropertyResponse> {
    const response = await this.axios.get(`env/${name}`);
    return response.data;
  }

  /**
   * Configprops
   */

  async configProps(): Promise<ActuatorConfigPropsResponse> {
    const response = await this.axios.get('configprops');
    return response.data;
  }

  /**
   * FLyway
   */

  async flyway(): Promise<ActuatorFlywayResponse> {
    const response = await this.axios.get('flyway');
    return response.data;
  }

  /**
   * Liquibase
   */

  async liquibase(): Promise<ActuatorLiquibaseResponse> {
    const response = await this.axios.get('liquibase');
    return response.data;
  }

  /**
   * Thread Dump
   */

  async threadDump(): Promise<ActuatorThreadDumpResponse> {
    const headers = {
      Accept: 'application/json',
    };
    const response = await this.axios.get('threaddump', { headers });
    return response.data;
  }

  /**
   * Heap Dump
   */

  async heapDump(): Promise<ArrayBuffer> {
    const response = await this.axios.get('heapdump', {
      responseType: 'arraybuffer',
    });
    return response.data;
  }

  /**
   * Loggers
   */

  async loggers(): Promise<ActuatorLoggersResponse> {
    const response = await this.axios.get('loggers');
    return response.data;
  }

  async logger(loggerOrGroupName: string): Promise<ActuatorLoggerResponse> {
    const response = await this.axios.get(`loggers/${loggerOrGroupName}`);
    return response.data;
  }

  async updateLogger(loggerOrGroupName: string, level: ActuatorLogLevel | undefined): Promise<void> {
    await this.axios.post(`loggers/${loggerOrGroupName}`, {
      configuredLevel: level,
    });
  }

  async clearLogger(loggerOrGroupName: string): Promise<void> {
    await this.axios.post(`loggers/${loggerOrGroupName}`, {});
  }
}
