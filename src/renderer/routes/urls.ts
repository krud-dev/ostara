export type UrlInfo = {
  url: string;
  path: string;
  helpUrl?: string;
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
    helpUrl: 'https://boost.krud.dev/documentation/folders',
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
    helpUrl: 'https://boost.krud.dev/features/application-features/overview/instances',
  },
  applicationLoggers: {
    url: '/navigator/application/:id/loggers',
    path: 'loggers',
    helpUrl: 'https://boost.krud.dev/features/application-features/manage/loggers',
  },
  applicationCaches: {
    url: '/navigator/application/:id/caches',
    path: 'caches',
    helpUrl: 'https://boost.krud.dev/features/application-features/manage/caches',
  },
  // Instance Root
  instance: {
    url: '/navigator/instance/:id',
    path: 'instance/:id',
  },
  instanceDashboard: {
    url: '/navigator/instance/:id/dashboard',
    path: 'dashboard',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/dashboard',
  },
  instanceMetrics: {
    url: '/navigator/instance/:id/metrics',
    path: 'metrics',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/metrics',
  },
  instanceHttpRequests: {
    url: '/navigator/instance/:id/http-requests',
    path: 'http-requests',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/http-requests',
  },
  instanceQuartz: {
    url: '/navigator/instance/:id/quartz',
    path: 'quartz',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/quartz',
  },
  instanceScheduledTasks: {
    url: '/navigator/instance/:id/scheduled-tasks',
    path: 'scheduled-tasks',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/scheduled-tasks',
  },
  instanceMappings: {
    url: '/navigator/instance/:id/mappings',
    path: 'mappings',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/mappings',
  },
  instanceFlyway: {
    url: '/navigator/instance/:id/flyway',
    path: 'flyway',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/flyway',
  },
  instanceLiquibase: {
    url: '/navigator/instance/:id/liquibase',
    path: 'liquibase',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/liquibase',
  },
  instanceEnvironment: {
    url: '/navigator/instance/:id/environment',
    path: 'environment',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/system-environment',
  },
  instanceSystemEnvironment: {
    url: '/navigator/instance/:id/system-environment',
    path: 'system-environment',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/system-environment',
  },
  instanceBeans: {
    url: '/navigator/instance/:id/beans',
    path: 'beans',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/beans',
  },
  instanceBeansGraph: {
    url: '/navigator/instance/:id/beans-graph',
    path: 'beans-graph',
  },
  instanceProperties: {
    url: '/navigator/instance/:id/properties',
    path: 'properties',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/app-properties',
  },
  instanceSystemProperties: {
    url: '/navigator/instance/:id/system-properties',
    path: 'system-properties',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/system-properties',
  },
  instanceIntegrationGraph: {
    url: '/navigator/instance/:id/integration-graph',
    path: 'integration-graph',
    helpUrl: 'https://boost.krud.dev/features/instance-features/insights/integration-graph',
  },
  instanceLoggers: {
    url: '/navigator/instance/:id/loggers',
    path: 'loggers',
    helpUrl: 'https://boost.krud.dev/features/instance-features/manage/loggers',
  },
  instanceCaches: {
    url: '/navigator/instance/:id/caches',
    path: 'caches',
    helpUrl: 'https://boost.krud.dev/features/instance-features/manage/caches',
  },
  instanceThreadDump: {
    url: '/navigator/instance/:id/thread-dump',
    path: 'thread-dump',
    helpUrl: 'https://boost.krud.dev/features/instance-features/jvm/thread-profiling',
  },
  instanceHeapDump: {
    url: '/navigator/instance/:id/heap-dump',
    path: 'heap-dump',
    helpUrl: 'https://boost.krud.dev/features/instance-features/jvm/heap-dump',
  },
});
