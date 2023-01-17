export type InstanceCacheStatistics = {
  gets: number;
  puts: number;
  evictions: number;
  hits: number;
  misses: number;
  removals: number;
  size: number;
};

export type ApplicationCacheStatistics = {
  [instanceId: string]: InstanceCacheStatistics;
};

export type InstanceCache = {
  name: string;
  cacheManager: string;
  target: string;
};

export type ApplicationCache = {
  name: string;
  instanceCaches: {
    [instanceId: string]: Omit<InstanceCache, 'name'>;
  };
};
