import { crudKeys } from './requests/crud/crudKeys';
import { instanceCrudEntity } from './requests/crud/entity/entities/instance.crudEntity';

export const apiKeys = {
  theme: () => ['theme'],
  themeSource: () => ['themeSource'],

  items: () => ['items'],
  item: (id: string) => [...apiKeys.items(), id],
  itemEffectiveAuthentication: (id: string) => [...apiKeys.item(id), 'effectiveAuthentication'],
  itemAbilities: (id: string) => [...apiKeys.item(id), 'abilities'],
  itemMetrics: (id: string) => [...apiKeys.item(id), 'metrics'],
  itemMetricDetails: (id: string, name: string, tags?: { [key: string]: string }) => [
    ...apiKeys.itemMetrics(id),
    name,
    tags,
  ],
  itemCaches: (id: string) => [...apiKeys.item(id), 'caches'],
  itemCacheStatistics: (id: string, cacheName: string) => [...apiKeys.itemCaches(id), 'statistics', cacheName],
  itemLoggers: (id: string) => [...apiKeys.item(id), 'loggers'],
  itemTogglz: (id: string) => [...apiKeys.item(id), 'togglz'],
  itemTogglzByGroup: (id: string, group: string) => [...apiKeys.itemTogglz(id), 'group', group],
  itemHealth: (id: string) => [...apiKeys.item(id), 'health'],
  itemInfo: (id: string) => [...apiKeys.item(id), 'info'],
  itemEnv: (id: string) => [...apiKeys.item(id), 'env'],
  itemEnvProperties: (id: string) => [...apiKeys.item(id), 'envProperties'],
  itemSystemEnvironment: (id: string) => [...apiKeys.item(id), 'systemEnvironment'],
  itemSystemProperties: (id: string) => [...apiKeys.item(id), 'systemProperties'],
  itemBeans: (id: string) => [...apiKeys.item(id), 'beans'],
  itemProperties: (id: string) => [...apiKeys.item(id), 'properties'],
  itemMappings: (id: string) => [...apiKeys.item(id), 'mappings'],
  itemMappingsServlets: (id: string) => [...apiKeys.itemMappings(id), 'servlets'],
  itemMappingsServletFilters: (id: string) => [...apiKeys.itemMappings(id), 'servletFilters'],
  itemMappingsDispatcherServlets: (id: string) => [...apiKeys.itemMappings(id), 'dispatcherServlets'],
  itemMappingsDispatcherHandlers: (id: string) => [...apiKeys.itemMappings(id), 'dispatcherHandlers'],
  itemFlyway: (id: string) => [...apiKeys.item(id), 'flyway'],
  itemFlywayByContext: (id: string, context: string) => [...apiKeys.itemFlyway(id), 'context', context],
  itemQuartz: (id: string) => [...apiKeys.item(id), 'quartz'],
  itemQuartzJobs: (id: string) => [...apiKeys.itemQuartz(id), 'jobs'],
  itemQuartzTriggers: (id: string) => [...apiKeys.itemQuartz(id), 'triggers'],
  itemQuartzGroupJobDetails: (id: string, group: string, name: string) => [
    ...apiKeys.itemQuartzJobs(id),
    'group',
    group,
    'details',
    name,
  ],
  itemQuartzGroupTriggerDetails: (id: string, group: string, name: string) => [
    ...apiKeys.itemQuartzTriggers(id),
    'group',
    group,
    'details',
    name,
  ],
  itemScheduledTasks: (id: string) => [...apiKeys.item(id), 'scheduledTasks'],
  itemScheduledTasksCron: (id: string) => [...apiKeys.itemScheduledTasks(id), 'cron'],
  itemScheduledTasksFixedDelay: (id: string) => [...apiKeys.itemScheduledTasks(id), 'fixedDelay'],
  itemScheduledTasksFixedRate: (id: string) => [...apiKeys.itemScheduledTasks(id), 'fixedRate'],
  itemScheduledTasksFixed: (id: string, type: string) => [...apiKeys.itemScheduledTasks(id), 'fixed', type],
  itemScheduledTasksCustom: (id: string) => [...apiKeys.itemScheduledTasks(id), 'custom'],
  itemLiquibase: (id: string) => [...apiKeys.item(id), 'liquibase'],
  itemLiquibaseByContext: (id: string, context: string) => [...apiKeys.itemLiquibase(id), 'context', context],
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
  itemIntegrationGraph: (id: string) => [...apiKeys.item(id), 'integrationGraph'],
  itemHeapdumps: (id: string) => [...apiKeys.item(id), 'heapdumps'],
  itemThreadProfilingRequests: (id: string) => [...apiKeys.item(id), 'threadProfilingRequests'],
  itemThreadProfilingRequestLogs: (id: string, requestId: string) => [
    ...apiKeys.item(id),
    'threadProfilingRequests',
    'logs',
    requestId,
  ],
  itemMetricRules: (id: string) => [...apiKeys.item(id), 'metricRules'],
  itemMetricRulesByName: (id: string, name: string) => [...apiKeys.itemMetricRules(id), 'name', name],

  itemInstances: (id: string) => [...crudKeys.entity(instanceCrudEntity), 'item', id],

  applicationsHealth: () => ['applicationsHealth'],
  instanceHealth: (id: string) => ['instanceHealth'],

  actuator: () => ['actuator'],
  actuatorConnection: (url: string) => [...apiKeys.actuator(), 'connection', url],

  metrics: () => ['metrics'],
  metricLatest: (instanceId: string, metricName: string) => [...apiKeys.metrics(), 'latest', instanceId, metricName],

  systemBackups: () => ['systemBackups'],
};
