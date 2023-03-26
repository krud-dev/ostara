export type UrlInfo = {
  url: string;
  path: string;
};

function asUrlInfos<T extends { [key: string]: UrlInfo }>(arg: T): T {
  return arg;
}

export const urls = asUrlInfos({
  // Error Root
  error: {
    url: '/error',
    path: 'error',
  },
  // Daemon Root
  daemon: {
    url: '/daemon',
    path: 'daemon',
  },
  daemonUnhealthy: {
    url: '/daemon/unhealthy',
    path: 'unhealthy',
  },
  // Navigator Root
  navigator: {
    url: '/navigator',
    path: 'navigator',
  },
  home: {
    url: '/navigator/home',
    path: 'home',
  },
  // Folder Root
  folder: {
    url: '/navigator/folder/:id',
    path: 'folder/:id',
  },
  folderApplications: {
    url: '/navigator/folder/:id/applications',
    path: 'applications',
  },
  // Application Root
  application: {
    url: '/navigator/application/:id',
    path: 'application/:id',
  },
  applicationDashboard: {
    url: '/navigator/application/:id/dashboard',
    path: 'dashboard',
  },
  applicationInstances: {
    url: '/navigator/application/:id/instances',
    path: 'instances',
  },
  applicationLoggers: {
    url: '/navigator/application/:id/loggers',
    path: 'loggers',
  },
  applicationCaches: {
    url: '/navigator/application/:id/caches',
    path: 'caches',
  },
  // Instance Root
  instance: {
    url: '/navigator/instance/:id',
    path: 'instance/:id',
  },
  instanceDashboard: {
    url: '/navigator/instance/:id/dashboard',
    path: 'dashboard',
  },
  instanceMetrics: {
    url: '/navigator/instance/:id/metrics',
    path: 'metrics',
  },
  instanceHttpRequests: {
    url: '/navigator/instance/:id/http-requests',
    path: 'http-requests',
  },
  instanceQuartz: {
    url: '/navigator/instance/:id/quartz',
    path: 'quartz',
  },
  instanceScheduledTasks: {
    url: '/navigator/instance/:id/scheduled-tasks',
    path: 'scheduled-tasks',
  },
  instanceMappings: {
    url: '/navigator/instance/:id/mappings',
    path: 'mappings',
  },
  instanceFlyway: {
    url: '/navigator/instance/:id/flyway',
    path: 'flyway',
  },
  instanceLiquibase: {
    url: '/navigator/instance/:id/liquibase',
    path: 'liquibase',
  },
  instanceEnvironment: {
    url: '/navigator/instance/:id/environment',
    path: 'environment',
  },
  instanceSystemEnvironment: {
    url: '/navigator/instance/:id/system-environment',
    path: 'system-environment',
  },
  instanceBeans: {
    url: '/navigator/instance/:id/beans',
    path: 'beans',
  },
  instanceBeansGraph: {
    url: '/navigator/instance/:id/beans-graph',
    path: 'beans-graph',
  },
  instanceProperties: {
    url: '/navigator/instance/:id/properties',
    path: 'properties',
  },
  instanceSystemProperties: {
    url: '/navigator/instance/:id/system-properties',
    path: 'system-properties',
  },
  instanceIntegrationGraph: {
    url: '/navigator/instance/:id/integration-graph',
    path: 'integration-graph',
  },
  instanceLoggers: {
    url: '/navigator/instance/:id/loggers',
    path: 'loggers',
  },
  instanceCaches: {
    url: '/navigator/instance/:id/caches',
    path: 'caches',
  },
  instanceThreadDump: {
    url: '/navigator/instance/:id/thread-dump',
    path: 'thread-dump',
  },
  instanceHeapDump: {
    url: '/navigator/instance/:id/heap-dump',
    path: 'heap-dump',
  },
});
