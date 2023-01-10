export const instanceKeys = {
  instance: (instanceId: string) => ['instance', instanceId],
  caches: (instanceId: string) => [...instanceKeys.instance(instanceId), 'caches'],
};
