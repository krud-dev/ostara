import { Entity } from 'renderer/entity/entity';
import { ApplicationCache } from 'infra/instance/models/cache';
import { chain } from 'lodash';
import { EVICT_CACHE_ID } from 'renderer/entity/actions';

export const applicationCacheEntity: Entity<ApplicationCache> = {
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
  getGrouping: (item) => chain(item.instanceCaches).values().first().value()?.cacheManager || 'N/A',
  filterData: (data, filter) => data.filter((item) => item.name?.toLowerCase().includes(filter.toLowerCase())),
};
