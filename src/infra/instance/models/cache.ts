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
