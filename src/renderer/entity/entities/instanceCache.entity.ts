import { Entity } from 'renderer/entity/entity';
import { EVICT_CACHE_ID } from 'renderer/entity/actions';
import InstanceCacheDetails from 'renderer/pages/navigator/instance/caches/components/InstanceCacheDetails';
import { EnrichedInstanceCache } from 'renderer/apis/instance/getInstanceCaches';

export const instanceCacheEntity: Entity<EnrichedInstanceCache> = {
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
  rowAction: {
    type: 'Details',
    Component: InstanceCacheDetails,
  },
  isRowActionActive: (item) => item.hasStatistics,
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: false,
  getId: (item) => item.name,
  getGrouping: (item) => item.cacheManager,
  filterData: (data, filter) => data.filter((item) => item.name?.toLowerCase().includes(filter.toLowerCase())),
};
