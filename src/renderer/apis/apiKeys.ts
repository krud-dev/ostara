export const apiKeys = {
  items: () => ['items'],
  item: (id: string) => [...apiKeys.items(), id],
  itemCaches: (id: string) => [...apiKeys.item(id), 'caches'],
  itemCacheStatistics: (id: string, cacheName: string) => [...apiKeys.itemCaches(id), 'statistics', cacheName],
  itemEnv: (id: string) => [...apiKeys.item(id), 'env'],
  itemEnvProperties: (id: string) => [...apiKeys.item(id), 'envProperties'],
  itemBeans: (id: string) => [...apiKeys.item(id), 'beans'],
  itemProperties: (id: string) => [...apiKeys.item(id), 'properties'],
  itemHttpRequestStatistics: (id: string) => [...apiKeys.item(id), 'httpRequestStatistics'],
  itemHttpRequestStatisticsForUriByMethods: (id: string, uri: string) => [
    ...apiKeys.itemHttpRequestStatistics(id),
    'uri',
    uri,
    'methods',
  ],
  itemHttpRequestStatisticsForUriByStatuses: (id: string, uri: string) => [
    ...apiKeys.itemHttpRequestStatistics(id),
    'uri',
    uri,
    'statuses',
  ],
  itemHttpRequestStatisticsForUriByOutcomes: (id: string, uri: string) => [
    ...apiKeys.itemHttpRequestStatistics(id),
    'uri',
    uri,
    'outcomes',
  ],
  itemHttpRequestStatisticsForUriByExceptions: (id: string, uri: string) => [
    ...apiKeys.itemHttpRequestStatistics(id),
    'uri',
    uri,
    'exceptions',
  ],
  itemInstances: (id: string) => [...apiKeys.item(id), 'instances'],

  actuator: () => ['actuator'],
  actuatorConnection: (url: string) => [...apiKeys.actuator(), 'connection', url],

  metrics: () => ['metrics'],
  metricLatest: (instanceId: string, metricName: string) => [...apiKeys.metrics(), 'latest', instanceId, metricName],

  tasks: () => ['tasks'],
  task: (name: string) => [...apiKeys.tasks(), name],
};
