import { dataSource } from '../dataSource';
import { ApplicationMetricValue } from '../entity/ApplicationMetricValue';
import { Between, In } from 'typeorm';

class MetricsService {
  async getHistory(
    instanceIds: string[],
    metrics: string[],
    from: Date,
    to: Date
  ): Promise<GetMetricsResponse> {
    const repository = dataSource.getRepository(ApplicationMetricValue);
    const results = await repository.findBy({
      instanceId: In(instanceIds),
      timestamp: Between(from, to),
      applicationMetric: {
        metric: In(metrics),
      },
    });
    let response: GetMetricsResponse = {};
    results
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .forEach((value) => {
        response = {
          [value.instanceId]: {
            ...response[value.instanceId],
            [value.applicationMetric.metric]: {
              ...response[value.instanceId]?.[value.applicationMetric.metric],
              metric: value.applicationMetric.metric,
              description: value.applicationMetric.description,
              unit: value.applicationMetric.unit,
              values: [
                ...response[value.instanceId]?.[value.applicationMetric.metric]
                  ?.values,
                {
                  value: value.value,
                  timestamp: value.timestamp,
                },
              ],
            },
          },
        };
      });
    return response;
  }
}

type ApplicationMetricDTO = {
  metric: string;
  description?: string;
  unit?: string;
  values: ApplicationMetricValueDTO[];
};

type ApplicationMetricValueDTO = {
  value: string;
  timestamp: Date;
};

type GetMetricsResponse = {
  [instanceId: string]: {
    [metric: string]: ApplicationMetricDTO;
  };
};
