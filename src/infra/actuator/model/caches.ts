export type ActuatorCache = {
  target: string;
};

export type ActuatorCacheManager = {
  caches: { [key: string]: ActuatorCache };
};

export type ActuatorCachesResponse = {
  cacheManagers: { [key: string]: ActuatorCacheManager };
};

export type ActuatorCacheResponse = {
  name: string;
  target: string;
  cacheManager: string;
};
