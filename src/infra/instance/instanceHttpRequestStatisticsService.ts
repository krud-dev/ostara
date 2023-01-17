import { actuatorClientStore } from '../actuator/actuatorClientStore';
import NodeCache from 'node-cache';
import { HasAbility } from '../utils/hasAbility';
import {
  HttpMethod,
  InstanceHttpRequestStatisticsForUriOptions,
  InstanceHttpRequestStatistics,
  InstanceHttpRequestStatisticsByMethod,
  HttpRequestOutcome,
  InstanceHttpRequestStatisticsByOutcome,
  InstanceHttpRequestStatisticsByStatus,
  InstanceHttpRequestStatisticsByException,
} from './models/httpRequestStatistics';
import { systemEvents } from '../events';

class InstanceHttpRequestStatisticsService {
  private readonly metricName = 'http.server.requests';

  private readonly statisticsCache = new NodeCache({
    stdTTL: 600,
  });

  constructor() {
    systemEvents.on('instance-updated', (instance) => {
      this.statisticsCache.del(instance.id);
    });
    systemEvents.on('instance-deleted', (instance) => {
      this.statisticsCache.del(instance.id);
    });
  }

  @HasAbility('http-request-statistics')
  async getStatistics(instanceId: string): Promise<InstanceHttpRequestStatistics[]> {
    const cached = this.statisticsCache.get(instanceId);
    if (cached) {
      return cached as InstanceHttpRequestStatistics[];
    }
    const statistics = await this.computeInstanceStatistics(instanceId);
    this.statisticsCache.set(instanceId, statistics);
    return statistics;
  }

  @HasAbility('http-request-statistics')
  async getStatisticsForUri(
    instanceId: string,
    uri: string,
    options: InstanceHttpRequestStatisticsForUriOptions
  ): Promise<InstanceHttpRequestStatistics> {
    const client = actuatorClientStore.getActuatorClient(instanceId);
    const metric = await client.metric(this.metricName, { uri, ...options });

    return {
      uri,
      count: metric.measurements.find((measurement) => measurement.statistic === 'COUNT')?.value ?? -1,
      totalTime: metric.measurements.find((measurement) => measurement.statistic === 'TOTAL_TIME')?.value ?? -1,
      max: metric.measurements.find((measurement) => measurement.statistic === 'MAX')?.value ?? -1,
    };
  }

  @HasAbility('http-request-statistics')
  async getStatisticsForUriByMethods(
    instanceId: string,
    uri: string
  ): Promise<InstanceHttpRequestStatisticsByMethod[]> {
    const client = actuatorClientStore.getActuatorClient(instanceId);
    const metric = await client.metric(this.metricName, { uri });
    const availableMethods: HttpMethod[] =
      (metric.availableTags.find((tag) => tag.tag === 'method')?.values as HttpMethod[]) ?? [];
    if (!availableMethods.length) {
      return [];
    }
    const promises = availableMethods.map(async (method) => {
      return { method, statistics: await this.getStatisticsForUri(instanceId, uri, { method }) };
    });
    const statistics = await Promise.all(promises);
    return statistics;
  }

  @HasAbility('http-request-statistics')
  async getStatisticsForUriByOutcomes(
    instanceId: string,
    uri: string
  ): Promise<InstanceHttpRequestStatisticsByOutcome[]> {
    const client = actuatorClientStore.getActuatorClient(instanceId);
    const metric = await client.metric(this.metricName, { uri });
    const availableOutcomes: HttpRequestOutcome[] =
      (metric.availableTags.find((tag) => tag.tag === 'outcome')?.values as HttpRequestOutcome[]) ?? [];
    if (!availableOutcomes.length) {
      return [];
    }
    const promises = availableOutcomes.map(async (outcome) => {
      return { outcome, statistics: await this.getStatisticsForUri(instanceId, uri, { outcome }) };
    });
    const statistics = await Promise.all(promises);
    return statistics;
  }

  @HasAbility('http-request-statistics')
  async getStatisticsForUriByStatuses(
    instanceId: string,
    uri: string
  ): Promise<InstanceHttpRequestStatisticsByStatus[]> {
    const client = actuatorClientStore.getActuatorClient(instanceId);
    const metric = await client.metric(this.metricName, { uri });
    const availableStatuses: string[] =
      (metric.availableTags.find((tag) => tag.tag === 'status')?.values as string[]) ?? [];
    if (!availableStatuses.length) {
      return [];
    }
    const promises = availableStatuses.map(async (status) => {
      return {
        status: Number(status) ?? -1,
        statistics: await this.getStatisticsForUri(instanceId, uri, { status: Number(status) ?? -1 }),
      };
    });
    const statistics = await Promise.all(promises);
    return statistics;
  }

  @HasAbility('http-request-statistics')
  async getStatisticsForUriByExceptions(
    instanceId: string,
    uri: string
  ): Promise<InstanceHttpRequestStatisticsByException[]> {
    const client = actuatorClientStore.getActuatorClient(instanceId);
    const metric = await client.metric(this.metricName, { uri });
    const availableExceptions: string[] =
      (metric.availableTags.find((tag) => tag.tag === 'exception')?.values as string[]) ?? [];
    if (!availableExceptions.length) {
      return [];
    }
    const promises = availableExceptions.map(async (exception) => {
      return {
        exception,
        statistics: await this.getStatisticsForUri(instanceId, uri, { exception }),
      };
    });
    const statistics = await Promise.all(promises);
    return statistics;
  }

  private async computeInstanceStatistics(instanceId: string): Promise<InstanceHttpRequestStatistics[]> {
    const client = actuatorClientStore.getActuatorClient(instanceId);
    const availableUris = await this.getAvailableUris(instanceId);
    const promises = availableUris.map(async (uri) => {
      const metric = await client.metric(this.metricName, { uri });
      const count = metric.measurements.find((measurement) => measurement.statistic === 'COUNT')?.value ?? -1;
      const totalTime = metric.measurements.find((measurement) => measurement.statistic === 'TOTAL_TIME')?.value ?? -1;
      const max = metric.measurements.find((measurement) => measurement.statistic === 'MAX')?.value ?? -1;
      return <InstanceHttpRequestStatistics>{
        uri,
        count,
        totalTime,
        max,
      };
    });

    const statistics: InstanceHttpRequestStatistics[] = await Promise.all(promises);
    return statistics;
  }

  private async getAvailableUris(instanceId: string): Promise<string[]> {
    const client = actuatorClientStore.getActuatorClient(instanceId);
    const metric = await client.metric(this.metricName);
    const uriTag = metric.availableTags.find((tag) => tag.tag === 'uri');
    if (!uriTag) {
      return [];
    }
    return uriTag.values;
  }
}

export const instanceHttpRequestStatisticsService = new InstanceHttpRequestStatisticsService();
