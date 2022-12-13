export interface ActuatorCache {
  target: string;
}

export interface ActuatorCacheManager {
  caches: { [key: string]: ActuatorCache };
}

export interface ActuatorCachesResponse {
  cacheManagers: { [key: string]: ActuatorCacheManager };
}

export interface ActuatorCacheResponse {
  name: string;
  target: string;
  cacheManager: string;
}
