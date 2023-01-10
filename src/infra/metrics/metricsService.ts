import { dataSource } from '../dataSource';
import { configurationService } from '../configuration/configurationService';
import { actuatorClientStore } from '../actuator/actuatorClientStore';

export type ApplicationMetricDTO = {
  name: string;
  description?: string;
  unit?: string;
  values: ApplicationMetricValueDTO[];
};

export type ApplicationMetricValueDTO = {
  value: number;
  timestamp: Date;
};

class MetricsService {
  async getLatestMetric(instanceId: string, metricName: string): Promise<ApplicationMetricDTO | undefined> {
    const instance = configurationService.getInstanceOrThrow(instanceId);
    const [metric, measurement] = /(.*)\[(.*)\]/.exec(metricName)!.slice(1);
    const actuatorClient = actuatorClientStore.getActuatorClient(instance.id);
    const response = await actuatorClient.metric(metric, {});
    return {
      name: response.name,
      description: response.description,
      unit: response.baseUnit,
      values: [
        {
          value: response.measurements.find((m) => m.statistic === measurement)?.value ?? -1,
          timestamp: new Date(),
        },
      ],
    };
  }
}

export const metricsService = new MetricsService();
