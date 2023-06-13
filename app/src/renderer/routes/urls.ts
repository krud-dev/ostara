export type UrlInfo = {
  url: string;
  path: string;
  helpUrl?: string;
  redirect?: boolean;
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
    redirect: true,
  },
  daemonUnhealthy: {
    url: '/daemon/unhealthy',
    path: 'unhealthy',
  },
  // Navigator Root
  navigator: {
    url: '/navigator',
    path: 'navigator',
    redirect: true,
  },
  home: {
    url: '/navigator/home',
    path: 'home',
  },
  dashboard: {
    url: '/navigator/dashboard',
    path: 'dashboard',
  },
  // Folder Root
  folder: {
    url: '/navigator/folder/:id',
    path: 'folder/:id',
    redirect: true,
  },
  folderDashboard: {
    url: '/navigator/folder/:id/dashboard',
    path: 'dashboard',
    helpUrl: 'https://docs.ostara.dev/features/folder-features/overview/dashboard',
  },
  folderApplications: {
    url: '/navigator/folder/:id/applications',
    path: 'applications',
    helpUrl: 'https://docs.ostara.dev/documentation/folders',
  },
  // Application Root
  application: {
    url: '/navigator/application/:id',
    path: 'application/:id',
    redirect: true,
  },
  applicationDashboard: {
    url: '/navigator/application/:id/dashboard',
    path: 'dashboard',
    helpUrl: 'https://docs.ostara.dev/features/application-features/overview/dashboard',
  },
  applicationInstances: {
    url: '/navigator/application/:id/instances',
    path: 'instances',
    helpUrl: 'https://docs.ostara.dev/features/application-features/overview/instances',
  },
  applicationLoggers: {
    url: '/navigator/application/:id/loggers',
    path: 'loggers',
    helpUrl: 'https://docs.ostara.dev/features/application-features/manage/loggers',
  },
  applicationCaches: {
    url: '/navigator/application/:id/caches',
    path: 'caches',
    helpUrl: 'https://docs.ostara.dev/features/application-features/manage/caches',
  },
  applicationMetricRules: {
    url: '/navigator/application/:id/metric-rules',
    path: 'metric-rules',
    helpUrl: 'https://docs.ostara.dev/features/application-features/monitor/metric-notifications',
  },
  // Instance Root
  instance: {
    url: '/navigator/instance/:id',
    path: 'instance/:id',
    redirect: true,
  },
  instanceDashboard: {
    url: '/navigator/instance/:id/dashboard',
    path: 'dashboard',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/dashboard',
  },
  instanceHealth: {
    url: '/navigator/instance/:id/health',
    path: 'health',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/health',
  },
  instanceInfo: {
    url: '/navigator/instance/:id/info',
    path: 'info',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/info',
  },
  instanceMetrics: {
    url: '/navigator/instance/:id/metrics',
    path: 'metrics',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/metrics',
  },
  instanceHttpRequests: {
    url: '/navigator/instance/:id/http-requests',
    path: 'http-requests',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/http-requests',
  },
  instanceQuartz: {
    url: '/navigator/instance/:id/quartz',
    path: 'quartz',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/quartz',
  },
  instanceScheduledTasks: {
    url: '/navigator/instance/:id/scheduled-tasks',
    path: 'scheduled-tasks',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/scheduled-tasks',
  },
  instanceMappings: {
    url: '/navigator/instance/:id/mappings',
    path: 'mappings',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/mappings',
  },
  instanceFlyway: {
    url: '/navigator/instance/:id/flyway',
    path: 'flyway',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/flyway',
  },
  instanceLiquibase: {
    url: '/navigator/instance/:id/liquibase',
    path: 'liquibase',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/liquibase',
  },
  instanceEnvironment: {
    url: '/navigator/instance/:id/environment',
    path: 'environment',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/system-environment',
  },
  instanceSystemEnvironment: {
    url: '/navigator/instance/:id/system-environment',
    path: 'system-environment',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/system-environment',
  },
  instanceBeans: {
    url: '/navigator/instance/:id/beans',
    path: 'beans',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/beans',
  },
  instanceBeansGraph: {
    url: '/navigator/instance/:id/beans-graph',
    path: 'beans-graph',
  },
  instanceProperties: {
    url: '/navigator/instance/:id/properties',
    path: 'properties',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/app-properties',
  },
  instanceSystemProperties: {
    url: '/navigator/instance/:id/system-properties',
    path: 'system-properties',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/system-properties',
  },
  instanceIntegrationGraph: {
    url: '/navigator/instance/:id/integration-graph',
    path: 'integration-graph',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/insights/integration-graph',
  },
  instanceLoggers: {
    url: '/navigator/instance/:id/loggers',
    path: 'loggers',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/manage/loggers',
  },
  instanceCaches: {
    url: '/navigator/instance/:id/caches',
    path: 'caches',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/manage/caches',
  },
  instanceTogglz: {
    url: '/navigator/instance/:id/togglz',
    path: 'togglz',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/manage/togglz',
  },
  instanceThreadDump: {
    url: '/navigator/instance/:id/thread-dump',
    path: 'thread-dump',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/jvm/thread-profiling',
  },
  instanceHeapDump: {
    url: '/navigator/instance/:id/heap-dump',
    path: 'heap-dump',
    helpUrl: 'https://docs.ostara.dev/features/instance-features/jvm/heap-dump',
  },
});
