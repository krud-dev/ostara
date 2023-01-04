export const metricsKeys = {
  metrics: () => ['metrics'],
  latest: (instanceId: string, metricName: string) => [...metricsKeys.metrics(), 'latest', instanceId, metricName],
  history: (instanceId: string, metricName: string, from: Date, to: Date) => [
    ...metricsKeys.metrics(),
    'history',
    instanceId,
    metricName,
    from,
    to,
  ],
};
