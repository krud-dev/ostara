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
  // Navigator Root
  navigator: {
    url: '/navigator',
    path: 'navigator',
  },
  home: {
    url: '/navigator/home',
    path: 'home',
  },
  folder: {
    url: '/navigator/folder/:id',
    path: 'folder/:id',
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
  instanceQuartz: {
    url: '/navigator/instance/:id/quartz',
    path: 'quartz',
  },
  instanceFlyway: {
    url: '/navigator/instance/:id/flyway',
    path: 'flyway',
  },
  instanceEnvironment: {
    url: '/navigator/instance/:id/environment',
    path: 'environment',
  },
  instanceBeans: {
    url: '/navigator/instance/:id/beans',
    path: 'beans',
  },
  instanceProperties: {
    url: '/navigator/instance/:id/properties',
    path: 'properties',
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
  // Settings Root
  settings: {
    url: '/settings',
    path: 'settings',
  },
  tasks: {
    url: '/settings/tasks',
    path: 'tasks',
  },
});
