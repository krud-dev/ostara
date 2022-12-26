export const metricsKeys = {
  metrics: () => ['metrics'],
  latest: (instanceId: string, metricName: string) => [...metricsKeys.metrics(), 'latest', instanceId, metricName],
};
