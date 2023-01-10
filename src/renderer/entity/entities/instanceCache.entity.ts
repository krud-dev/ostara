import { Entity } from 'renderer/entity/entity';
import { InstanceCache } from 'infra/instance/models/cache';

export const EVICT_CACHE_ID = 'clearCache';

export const instanceCacheEntity: Entity<InstanceCache> = {
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
  ],
  actions: [
    {
      id: EVICT_CACHE_ID,
      labelId: 'evict',
      icon: 'CleaningServicesOutlined',
    },
  ],
  massActions: [
    {
      id: EVICT_CACHE_ID,
      labelId: 'evict',
      icon: 'CleaningServicesOutlined',
    },
  ],
  globalActions: [
    {
      id: EVICT_CACHE_ID,
      labelId: 'evictAll',
      icon: 'CleaningServicesOutlined',
    },
  ],
  defaultOrder: {
    id: 'name',
    direction: 'asc',
  },
  paging: false,
  getId: (item) => item.name,
  getGrouping: (item) => item.cacheManager,
  filterData: (data, filter) => data.filter((task) => task.name.toLowerCase().includes(filter.toLowerCase())),
};
