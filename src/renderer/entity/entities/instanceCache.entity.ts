import { Entity } from 'renderer/entity/entity';
import { InstanceCache } from 'infra/instance/models/cache';
import { EVICT_CACHE_ID } from 'renderer/entity/actions';

export const instanceCacheEntity: Entity<InstanceCache> = {
  id: 'instanceCache',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
      getTooltip: (item) => item.target,
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
  filterData: (data, filter) => data.filter((item) => item.name?.toLowerCase().includes(filter.toLowerCase())),
};
