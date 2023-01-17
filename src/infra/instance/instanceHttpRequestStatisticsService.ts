import { actuatorClientStore } from '../actuator/actuatorClientStore';
import NodeCache from 'node-cache';
import { HasAbility } from '../utils/hasAbility';
import { InstanceHttpRequestStatistics } from './models/httpRequestStatistics';
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

  private async computeInstanceStatistics(instanceId: string): Promise<InstanceHttpRequestStatistics[]> {
    const client = actuatorClientStore.getActuatorClient(instanceId);
    const availableUris = await this.getAvailableUris(instanceId);
    const statistics: InstanceHttpRequestStatistics[] = [];
    for (const uri of availableUris) {
      const metric = await client.metric(this.metricName, { uri });
      const count = metric.measurements.find((measurement) => measurement.statistic === 'COUNT')?.value ?? -1;
      const totalTime = metric.measurements.find((measurement) => measurement.statistic === 'TOTAL_TIME')?.value ?? -1;
      const max = metric.measurements.find((measurement) => measurement.statistic === 'MAX')?.value ?? -1;
      statistics.push({
        uri,
        count,
        totalTime,
        max,
      });
    }
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
